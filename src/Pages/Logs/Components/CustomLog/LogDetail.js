import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { showSnack } from "../../../../Redux/Snack/ActionCreator";
import MapBox from "../../../../Shared/Components/MapBox";
import {
  copyToClipboard,
  getMapUrl,
  openFile,
  openUrl,
  saveToDevice,
  shareText,
  shareThings,
} from "../../../../Shared/Functions";
import { SCREEN_WIDTH } from "../../../../Shared/Styles";
import { getTimeFromDateObj } from "./Functions";
import ViewShot from "react-native-view-shot";
import CustomActivityIndicator from "../../../../Shared/Components/CustomActivityIndicator";

export default function LogDetail(props) {
  const { logData } = props.route.params;
  // console.log(logData);
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  // * mapref
  const shareMapShot = useRef(null);

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      title: logData.title,
    });
  };

  useEffect(() => {
    setHeaderOptions();
  }, []);

  const shareMapSnapShot = () => {
    shareMapShot.current.capture().then(async (uri) => {
      // console.log("shareQrCode ", uri);
      const result = await shareThings(uri);
    });
  };

  const shareFile = async (uri, fileName) => {
    setLoading(true);
    const { status, localUri } = await saveToDevice(uri, fileName);
    // console.log({ status, localUri });
    if (!status) {
      dispatch(showSnack("Could not share file, please try again!!"));
      return;
    }
    const shareStatus = await shareThings(localUri.uri);
    shareStatus
      ? null
      : dispatch(showSnack("Oops!! Could not share file, please try again"));
    setLoading(false);
  };

  const viewFile = async (uri, fileName) => {
    setLoading(true);
    const { status, localUri } = await saveToDevice(uri, fileName);
    // console.log({ status, localUri });
    if (!status) {
      dispatch(showSnack("Could not open file, please try again!!"));
      return;
    }
    const viewStatus = await openFile(localUri.uri);
    viewStatus
      ? null
      : dispatch(showSnack("Oops!! Could not open file, please try again"));
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backOne }}>
      {loading && <CustomActivityIndicator />}
      <FlatList
        data={logData.data}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 60 }}
        removeClippedSubviews={false}
        renderItem={({ item, index }) => {
          if (item.dataId == 0) {
            // url
            return (
              <>
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                {/* <Text>{JSON.stringify(item, null, 4)}</Text> */}
                <View
                  style={[
                    styles.dataContainer,
                    { backgroundColor: colors.backTwo },
                  ]}
                >
                  <Text
                    style={[styles.txt, { color: colors.primaryColor }]}
                    selectable={true}
                  >
                    {item.dataValue}
                  </Text>
                </View>
              </>
            );
          }
          if (item.dataId == 1) {
            // text
            return (
              <>
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                {/* <Text>{JSON.stringify(item, null, 4)}</Text> */}
                <View
                  style={[
                    styles.dataContainer,
                    { backgroundColor: colors.backTwo },
                  ]}
                >
                  <Text
                    selectable={true}
                    style={[styles.txt, { color: colors.textOne }]}
                  >
                    {item.dataValue}
                  </Text>
                </View>
              </>
            );
          }
          if (item.dataId == 2) {
            // number
            return (
              <>
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                {/* <Text>{JSON.stringify(item, null, 4)}</Text> */}
                <View
                  style={[
                    styles.dataContainer,
                    { backgroundColor: colors.backTwo },
                  ]}
                >
                  <Text
                    selectable={true}
                    style={[styles.txt, { color: colors.textOne }]}
                  >
                    {item.dataValue}
                  </Text>
                </View>
              </>
            );
          }
          if (item.dataId == 3) {
            // email
            return (
              <>
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                {/* <Text>{JSON.stringify(item, null, 4)}</Text> */}
                <View
                  style={[
                    styles.dataContainer,
                    { backgroundColor: colors.backTwo },
                  ]}
                >
                  <Text
                    selectable={true}
                    style={[styles.txt, { color: colors.textOne }]}
                  >
                    {item.dataValue}
                  </Text>
                </View>
              </>
            );
          }
          if (item.dataId == 4) {
            // date
            return (
              <>
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                {/* <Text>{JSON.stringify(item, null, 4)}</Text> */}
                <View
                  style={[
                    styles.dataContainer,
                    { backgroundColor: colors.backTwo },
                  ]}
                >
                  <Text
                    selectable={true}
                    style={[styles.txt, { color: colors.textOne }]}
                  >
                    {new Date(item.dataValue).toDateString()}
                  </Text>
                </View>
              </>
            );
          }
          if (item.dataId == 5) {
            // time
            return (
              <>
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                {/* <Text>{JSON.stringify(item, null, 4)}</Text> */}
                <View
                  style={[
                    styles.dataContainer,
                    { backgroundColor: colors.backTwo },
                  ]}
                >
                  <Text
                    selectable={true}
                    style={[styles.txt, { color: colors.textOne }]}
                  >
                    {getTimeFromDateObj(new Date(item.dataValue))}
                  </Text>
                </View>
              </>
            );
          }
          if (item.dataId == 6) {
            const coords = item.dataValue[0].geometry;
            const coordinates = {
              latitude: coords.lat,
              longitude: coords.lng,
            };
            const mapURL = getMapUrl(coordinates);
            // map box
            return (
              <>
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                {/* <Text>{JSON.stringify(item, null, 4)}</Text> */}
                <ViewShot
                  ref={shareMapShot}
                  options={{ format: "jpg", quality: 1.0 }}
                >
                  <View
                    style={[
                      styles.dataContainer,
                      { backgroundColor: colors.backTwo, padding: 6 },
                    ]}
                  >
                    <MapBox
                      height={380}
                      pinStyle={{ top: "40.5%", right: "40.5%" }}
                      addressSetter={() => {}}
                      regionSetter={() => {}}
                      oneCoordinate={coordinates}
                    />
                    <Text
                      selectable={true}
                      style={[styles.addressTxt, { color: colors.textOne }]}
                    >
                      {item.dataValue[0].formatted}
                    </Text>
                  </View>
                </ViewShot>
                <View
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: colors.backThree,
                    borderRadius: 8,
                  }}
                >
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                      onPress={() => {
                        openUrl(mapURL)
                          ? dispatch(showSnack("Url opened"))
                          : dispatch(showSnack("Cannot open url"));
                      }}
                      style={[
                        styles.button,
                        { backgroundColor: colors.backTwo },
                      ]}
                    >
                      <Text
                        style={[styles.btnTxt, { color: colors.primaryColor }]}
                      >
                        Open in Maps
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        { backgroundColor: colors.backTwo },
                      ]}
                      onPress={() => shareText(mapURL)}
                    >
                      <Text
                        style={[styles.btnTxt, { color: colors.primaryColor }]}
                      >
                        Share Location
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        { backgroundColor: colors.backTwo },
                      ]}
                      onPress={shareMapSnapShot}
                    >
                      <Text
                        style={[styles.btnTxt, { color: colors.primaryColor }]}
                      >
                        Share Snapshot
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        { backgroundColor: colors.backTwo },
                      ]}
                      onPress={() =>
                        shareText(
                          item?.dataValue[0]?.formatted ||
                            "Address not available"
                        )
                      }
                    >
                      <Text
                        style={[styles.btnTxt, { color: colors.primaryColor }]}
                      >
                        Share Address
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        { backgroundColor: colors.backTwo },
                      ]}
                      onPress={() =>
                        dispatch(
                          showSnack(
                            copyToClipboard(mapURL)
                              ? "Copied to clipboard"
                              : "Oops! Could not copy"
                          )
                        )
                      }
                    >
                      <Text
                        style={[styles.btnTxt, { color: colors.primaryColor }]}
                      >
                        Copy Location URL
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        { backgroundColor: colors.backTwo },
                      ]}
                      onPress={() =>
                        dispatch(
                          showSnack(
                            copyToClipboard(
                              `${coordinates.latitude},${coordinates.longitude}`
                            )
                              ? "Copied to clipboard"
                              : "Oops! Could not copy"
                          )
                        )
                      }
                    >
                      <Text
                        style={[styles.btnTxt, { color: colors.primaryColor }]}
                      >
                        Copy Coordinates
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </>
            );
          }
          if (item.dataId == 7) {
            // image
            return (
              <>
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                {/* <Text>{JSON.stringify(item, null, 4)}</Text> */}
                <View
                  style={[
                    styles.dataContainer,
                    { backgroundColor: colors.backTwo },
                  ]}
                >
                  <Image
                    source={{ uri: item.dataValue.uri }}
                    style={{
                      aspectRatio: item.dataValue.width / item.dataValue.height,
                      alignSelf: "center",
                      width: SCREEN_WIDTH - 32,
                      margin: 6,
                    }}
                  />
                  <TouchableOpacity
                    style={styles.expandBtn}
                    onPress={() => viewFile(item.dataValue.uri, item.fileName)}
                  >
                    <Ionicons
                      name={"share-social-outline"}
                      size={20}
                      color={"#222"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.expandBtn, { right: 60 }]}
                    onPress={() => shareFile(item.dataValue.uri, item.fileName)}
                  >
                    <Ionicons
                      name={"expand-outline"}
                      size={20}
                      color={"#222"}
                    />
                  </TouchableOpacity>
                </View>
              </>
            );
          }
          if (item.dataId == 8) {
            // pdf document
            return (
              <>
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                {/* <Text>{JSON.stringify(item, null, 4)}</Text> */}
                <View
                  style={[
                    styles.dataContainer,
                    styles.horizontalView,
                    { backgroundColor: colors.backTwo, paddingLeft: 15 },
                  ]}
                >
                  <View style={styles.iconTextView}>
                    <AntDesign
                      name={"pdffile1"}
                      size={22}
                      color={colors.primaryErrColor}
                    />
                    <Text style={[styles.pdfName, { color: colors.textOne }]}>
                      {item.dataValue.name}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.iconTextView,
                      { justifyContent: "flex-end" },
                    ]}
                  >
                    <TouchableOpacity
                      style={{ padding: 15 }}
                      onPress={() =>
                        viewFile(item.dataValue.uri, item.dataValue.name)
                      }
                    >
                      <Ionicons
                        name={"expand-outline"}
                        size={20}
                        color={colors.textOne}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        shareFile(item.dataValue.uri, item.dataValue.name)
                      }
                      style={{ padding: 15 }}
                    >
                      <Ionicons
                        name={"share-social-outline"}
                        size={22}
                        color={colors.textOne}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            );
          }
          if (item.dataId == 9) {
            // contact number
            return (
              <>
                {/* <Text>{JSON.stringify(item, null, 4)}</Text> */}
                <Text style={[styles.label, { color: colors.textOne }]}>
                  {item.dataName}
                </Text>
                <View
                  style={[
                    styles.dataContainer,
                    { backgroundColor: colors.backTwo },
                  ]}
                >
                  <Text
                    selectable
                    style={[styles.txt, { color: colors.textOne }]}
                  >
                    {`${item?.dataValue?.countryFlag || ``}  +${
                      item?.dataValue?.callingCode || ``
                    } ${item?.dataValue?.phoneNumber || ``}`}
                  </Text>
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
  label: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginTop: 5,
  },
  dataContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 7,
  },
  txt: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  addressTxt: {
    fontSize: 16,
    fontWeight: "700",
    margin: 3,
    marginVertical: 7,
  },
  horizontalView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconTextView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  button: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
  },
  btnTxt: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  expandBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 10,
    backgroundColor: "#efefef",
    borderRadius: 8,
  },
  pdfName: {
    marginLeft: 10,
    fontSize: 15,
    maxWidth: SCREEN_WIDTH / 2,
  },
});
