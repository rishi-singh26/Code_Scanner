import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect, useReducer } from "react";
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { showSnack } from "../../../../Redux/Snack/ActionCreator";
import DatePickerModel from "../../../../Shared/Components/DatePickerModel";
import ImagePicker from "../../../../Shared/Components/ImagePicker/index.js";
import MapBox from "../../../../Shared/Components/MapBox";
import PDFPicker from "../../../../Shared/Components/PDFPicker";
import TimePickerModel from "../../../../Shared/Components/TimePickerModel";
import { validateInteger } from "../../../../Shared/Functions";
import CustomActivityIndicator from "../../../../Shared/Components/CustomActivityIndicator";
import {
  getCallingCodeAndFlag,
  hasFilledData,
  hasPhoneNumber,
  hasValidEmails,
  hasValidPhoneNumbers,
  hasValidUrls,
  imageAndPdfIndices,
  uploadImages,
  uploadPdfs,
} from "./Functions";
import { auth, firestore } from "../../../../Constants/Api";
import { SCREEN_WIDTH } from "../../../../Shared/Styles";

export default function AddLog(props) {
  const { loggerData } = props.route.params;
  // console.log("Logger id on add log", loggerData._id);

  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const dispatch = useDispatch();

  const [logData, setLogData] = useState([...loggerData.data]);
  const [countryCodeData, setcountryCodeData] = useState(null);
  const [title, setTitle] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const setData = (index, value) => {
    const allLogData = JSON.parse(JSON.stringify(logData));
    let thisLogData = allLogData[index];
    thisLogData.dataValue = value;
    allLogData.splice(index, 1, thisLogData);
    setLogData(allLogData);
  };

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingVertical: 14, paddingHorizontal: 30 }}
            onPress={() => {
              // uploadImages(imageAndPdfIndices().imageIndices);
              // uploadPdfs(imageAndPdfIndices().pdfIndices);
              // hasFilledData(JSON.parse(JSON.stringify(logData)));
              uploadLog();
            }}
          >
            <AntDesign name="check" size={24} color={colors.textOne} />
          </TouchableOpacity>
        );
      },
    });
  };

  useEffect(() => {
    setHeaderOptions();
  }, [logData]);

  const uploadLog = async () => {
    // TODO: validate text entries, number entries by checking if the length is 0 or not
    // check if data has been filled
    setIsLoading(true);
    const { isFilled, string } = hasFilledData(logData);
    if (!isFilled) {
      setIsLoading(false);
      dispatch(showSnack(string));
      return;
    }
    // checking if contact numbers are present
    dispatch(showSnack("Validating data..."));

    const { status: validContactsStatus, incorrectContactIndex: incConInd } =
      hasValidPhoneNumbers(logData);

    if (!validContactsStatus) {
      dispatch(
        showSnack("Enter correct phone number, " + logData[incConInd].dataName)
      );
      setIsLoading(false);
      return;
    }

    if (!hasValidEmails(logData)) {
      dispatch(
        showSnack("Email you enterd is not valid, please check and try again!")
      );
      setIsLoading(false);
      return;
    }
    if (!hasValidUrls(logData)) {
      dispatch(
        showSnack("URL you enterd is not valid, please check and try again!")
      );
      setIsLoading(false);
      return;
    }

    // data to be uploaded
    let uploadableData = { data: JSON.parse(JSON.stringify(logData)) };
    // get index of items which are images or pdf because they need to be uploaded to the server and their url needs to be posted to the database
    const { imageIndices, pdfIndices } = imageAndPdfIndices(logData);
    // are images present?
    if (imageIndices.length > 0) {
      dispatch(showSnack("Uploading images..."));
      // images are present
      // upload images
      const { status, data } = await uploadImages(imageIndices, logData);
      // above status is boolean and data is an array of strings, each string has two parts seperated by a # symbol example. "3#https://www.google.com"
      // check upload status
      if (!status) {
        dispatch(showSnack("Error while uploading image, please try again."));
        setIsLoading(false);
        return;
      }
      // console.log(data);
      // process urls
      data.map((item) => {
        const [imageIndex, imageDownloadUri] = item.split("#"); //imageIndex is the index at which thsi image is present in the logData state
        let thisImage = uploadableData.data[imageIndex];
        thisImage = {
          ...thisImage,
          fileName: thisImage.dataValue.uri.split("/").pop(),
        };
        thisImage.dataValue.uri = imageDownloadUri;
        uploadableData.data.splice(imageIndex, 1, thisImage);
      });
    }
    if (pdfIndices.length > 0) {
      dispatch(showSnack("Uploading pdfs..."));
      // pdfs are present
      // upload images
      const { status, data } = await uploadPdfs(pdfIndices, logData);
      // above status is boolean and data is an array of strings, each string has two parts seperated by a # symbol example. "3#https://www.google.com"
      // check upload status
      if (!status) {
        dispatch(showSnack("Error while uploading pdf, please try again."));
        setIsLoading(false);
        return;
      }
      // console.log(data);
      // process urls
      data.map((item) => {
        const [pdfIndex, pdfDownloadUri] = item.split("#"); //pdfIndex is the index at which thsi image is present in the logData state
        let thisPdf = uploadableData.data[pdfIndex];
        thisPdf.dataValue.uri = pdfDownloadUri;
        uploadableData.data.splice(pdfIndex, 1, thisPdf);
      });
    }
    uploadableData.userId = auth.currentUser.uid;
    uploadableData.loggerId = loggerData._id;
    uploadableData.createdOn = new Date();
    uploadableData.title = title;
    console.log(uploadableData);
    if (!auth.currentUser) {
      dispatch(showSnack("Authentication error, logout and login again"));
      return;
    }
    dispatch(showSnack("Finishing up..."));
    firestore
      .collection("logs")
      .add(uploadableData)
      .then(() => {
        console.log("Added log successfully");
        dispatch(showSnack("Log added successfully"));
        setIsLoading(false);
        props.navigation.goBack();
      })
      .catch((err) => {
        dispatch(showSnack("Error in uploading log data", err.message));
        setIsLoading(false);
      });
  };

  const getCountryCodeFlag = async () => {
    if (countryCodeData) return;
    const { status, data } = await getCallingCodeAndFlag(loggerData.data);
    // console.log({ status, data });
    if (!status) {
      dispatch(
        showSnack("Error in getting country code data, please try again!")
      );
      props.navigation.goBack();
      return;
    }
    setcountryCodeData(data);
  };

  useEffect(() => {
    getCountryCodeFlag();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backOne }}>
      {isLoading && <CustomActivityIndicator />}
      <FlatList
        data={logData}
        contentContainerStyle={{ paddingBottom: 100 }}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <View>
            <Text style={[styles.label, { color: colors.textOne }]}>
              Logger Name
            </Text>
            <TextInput
              value={title}
              onChangeText={(txt) => setTitle(txt)}
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.backTwo,
                  color: colors.textOne,
                  fontSize: 18,
                  fontWeight: "700",
                },
              ]}
              placeholder={"Enter log title"}
              placeholderTextColor={colors.textThree}
            />
          </View>
        }
        renderItem={({ item, index }) => {
          if (item.dataId === 0) {
            return (
              <>
                {/* <Text style={{ color: colors.textOne }}>
                  {JSON.stringify(item?.dataValue, null, 4)}
                </Text> */}
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                <TextInput
                  placeholder={item.dataName}
                  placeholderTextColor={colors.textTwo}
                  style={[
                    styles.textInput,
                    { backgroundColor: colors.backTwo, color: colors.textOne },
                  ]}
                  keyboardType="email-address"
                  value={item?.dataValue || ""}
                  onChangeText={(txt) => setData(index, txt)}
                  autoCapitalize={"none"}
                />
              </>
            );
          }
          if (item.dataId == 1) {
            return (
              <>
                {/* <Text style={{ color: colors.textOne }}>
                  {JSON.stringify(item?.dataValue, null, 4)}
                </Text> */}
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                <TextInput
                  placeholder={item.dataName}
                  placeholderTextColor={colors.textTwo}
                  style={[
                    styles.textInput,
                    { backgroundColor: colors.backTwo, color: colors.textOne },
                  ]}
                  keyboardType="default"
                  value={item?.dataValue || ""}
                  onChangeText={(txt) => setData(index, txt)}
                />
              </>
            );
          }
          if (item.dataId == 2) {
            return (
              <>
                {/* <Text style={{ color: colors.textOne }}>
                  {JSON.stringify(item?.dataValue, null, 4)}
                </Text> */}
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                <TextInput
                  placeholder={item.dataName}
                  placeholderTextColor={colors.textTwo}
                  style={[
                    styles.textInput,
                    { backgroundColor: colors.backTwo, color: colors.textOne },
                  ]}
                  keyboardType="number-pad"
                  value={item?.dataValue || ""}
                  onChangeText={(txt) =>
                    validateInteger(txt) ? setData(index, txt) : null
                  }
                />
              </>
            );
          }
          if (item.dataId == 3) {
            return (
              <>
                {/* <Text style={{ color: colors.textOne }}>
                  {JSON.stringify(item?.dataValue, null, 4)}
                </Text> */}
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                <TextInput
                  placeholder={item.dataName}
                  placeholderTextColor={colors.textTwo}
                  style={[
                    styles.textInput,
                    { backgroundColor: colors.backTwo, color: colors.textOne },
                  ]}
                  keyboardType={"email-address"}
                  value={item?.dataValue || ""}
                  onChangeText={(txt) => setData(index, txt)}
                  autoCapitalize={"none"}
                />
              </>
            );
          }
          if (item.dataId == 4) {
            return (
              <>
                {/* <Text style={{ color: colors.textOne }}>
                  {JSON.stringify(item?.dataValue, null, 4)}
                </Text> */}
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                <DatePickerModel
                  style={styles.textInput}
                  setValue={(data) => setData(index, data)}
                />
              </>
            );
          }
          if (item.dataId == 5) {
            return (
              <>
                {/* <Text style={{ color: colors.textOne }}>
                  {JSON.stringify(item?.dataValue, null, 4)}
                </Text> */}
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                <TimePickerModel
                  style={styles.textInput}
                  setValue={(data) => setData(index, data)}
                />
              </>
            );
          }
          if (item.dataId == 6) {
            return (
              <>
                {/* <Text style={{ color: colors.textOne }}>
                  {JSON.stringify(item?.dataValue, null, 4)}
                </Text> */}
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                <View
                  style={[
                    styles.mapContainer,
                    { backgroundColor: colors.backTwo },
                  ]}
                >
                  <MapBox
                    height={380}
                    pinStyle={{ top: "40.5%", right: "40.5%" }}
                    addressSetter={(address) => setData(index, address)}
                    regionSetter={(region) => {}}
                  />
                  <Text
                    style={[
                      styles.label,
                      {
                        color: colors.textTwo,
                        fontSize: 13,
                        marginHorizontal: 0,
                        // height: 50,
                      },
                    ]}
                  >
                    {item?.dataValue
                      ? item.dataValue == "Loading..."
                        ? "Loading..."
                        : item.dataValue[0].formatted
                      : "Loading..."}
                  </Text>
                </View>
              </>
            );
          }
          if (item.dataId == 7) {
            return (
              <>
                {/* <Text style={{ color: colors.textOne }}>
                  {JSON.stringify(item?.dataValue || "", null, 4)}
                </Text> */}
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                <ImagePicker
                  viewStyle={[
                    styles.imagePicker,
                    { backgroundColor: colors.backTwo },
                  ]}
                  imageStyle={styles.imageStyle}
                  setData={(imageData) => setData(index, imageData)}
                  textColor={colors.textOne}
                  value={item?.dataValue || null}
                  navigate={props.navigation.navigate}
                />
              </>
            );
          }
          if (item.dataId == 8) {
            return (
              <>
                {/* <Text style={{ color: colors.textOne }}>
                  {JSON.stringify(item?.dataValue, null, 4)}
                </Text> */}
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                <PDFPicker
                  viewStyle={[
                    styles.pdfPicker,
                    { backgroundColor: colors.backTwo },
                  ]}
                  setData={(data) => setData(index, data)}
                  pdfIconColor={colors.primaryErrColor}
                  textColor={colors.textOne}
                  value={item?.dataValue || null}
                />
              </>
            );
          }
          if (item.dataId == 9) {
            return (
              <>
                {/* <Text style={{ color: colors.textOne }}>
                  {JSON.stringify(item?.dataValue, null, 4)}
                </Text> */}
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                <View style={styles.phoneNumInputContainer}>
                  <View
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: colors.backTwo,
                        paddingVertical: 14,
                      },
                    ]}
                  >
                    {countryCodeData ? (
                      <Text style={{ color: colors.textOne }}>
                        {`${countryCodeData.code} ${countryCodeData.flag}`}
                      </Text>
                    ) : (
                      <Text>
                        <CustomActivityIndicator size={15} />
                      </Text>
                    )}
                  </View>
                  <TextInput
                    placeholder={item.dataName}
                    placeholderTextColor={colors.textTwo}
                    keyboardType={"number-pad"}
                    maxLength={10}
                    value={item?.dataValue?.phoneNumber || ""}
                    onChangeText={(txt) =>
                      validateInteger(txt)
                        ? setData(index, {
                            callingCode: countryCodeData.code,
                            countryFlag: countryCodeData.flag,
                            phoneNumber: txt,
                          })
                        : null
                    }
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: colors.backTwo,
                        color: colors.textOne,
                        margin: 0,
                        flex: 1,
                      },
                    ]}
                  />
                </View>
              </>
            );
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 7,
    marginHorizontal: 10,
    marginTop: 3,
  },
  submitBtn: {
    paddingHorizontal: 130,
    paddingVertical: 13,
    borderRadius: 7,
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 20,
    marginTop: 40,
    // position: "absolute",
    // bottom: 20,
    // flex: 1,
    // alignSelf: "center",
  },
  submitBtnTxt: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginHorizontal: 10,
    marginTop: 10,
  },
  mapContainer: {
    padding: 7,
    marginHorizontal: 10,
    marginTop: 3,
    borderRadius: 7,
  },
  imagePicker: {
    padding: 8,
    marginHorizontal: 10,
    borderRadius: 7,
    marginTop: 3,
  },
  imageStyle: {
    width: SCREEN_WIDTH - 36,
    borderRadius: 5,
    // height: 400,
  },
  pdfPicker: {
    // paddingVertical: 14,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    borderRadius: 7,
    marginTop: 3,
  },
  phoneNumInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
