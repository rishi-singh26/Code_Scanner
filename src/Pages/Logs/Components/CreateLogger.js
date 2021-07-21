import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth, firestore } from "../../../Constants/Api";
import { showSnack } from "../../../Redux/Snack/ActionCreator";
import CustomActivityIndicator from "../../../Shared/Components/CustomActivityIndicator";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { SCREEN_HEIGHT } from "../../../Shared/Styles";
import {
  Ionicons,
  Fontisto,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function CreateLogger(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const dispatch = useDispatch();

  // Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();

  const [title, setTitle] = useState("");
  const [logData, setLogData] = useState([
    {
      dataName: "",
      dataType: "Select",
      dataId: -1,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addData = () => {
    const newData = {
      dataName: ``,
      dataType: `Select`,
      dataId: -1,
    };
    setLogData([...logData, newData]);
  };

  const removeData = () => {
    try {
      if (logData.length > 1) {
        const allLogData = [...logData];
        allLogData.pop();
        setLogData(allLogData);
      } else {
        dispatch(showSnack("Minimum one data is required"));
      }
    } catch (err) {
      dispatch(showSnack("An error occured, please try again"));
      console.log("Error while removing data field on CREATE LOG");
    }
  };

  const setData = (dataName, index, data, dataIndex = -1) => {
    const thisLogData = logData[index];
    const allLogData = [...logData];
    thisLogData[dataName] = data;
    dataIndex == -1 ? null : (thisLogData.dataId = dataIndex);
    allLogData.splice(index, 1, thisLogData);
    setLogData(allLogData);
  };

  const uploadLogger = () => {
    if (!hasFilledData()) {
      dispatch(showSnack("Fill all data and try again"));
      return;
    }
    if (!auth.currentUser) {
      dispatch(showSnack("Authentication error, logout and login again"));
      return;
    }
    // console.log(logData);
    setIsLoading(true);
    firestore
      .collection("loggers")
      .add({
        userId: auth.currentUser.uid,
        creationDate: new Date(),
        title,
        data: logData,
        loggerType: "Custom",
        loggerTypeId: 0,
      })
      .then(() => {
        setIsLoading(false);
        dispatch(showSnack("Logger created successfully"));
        props.navigation.goBack();
      })
      .catch((err) => {
        setIsLoading(false);
        dispatch(showSnack("Error in creating logger, please try again"));
        console.log("Error while creating logger", err.message);
      });
  };

  const dataTypeOptions = [
    "URL", // 0
    "Text", // 1
    "Number", // 2
    "Email", // 3
    "Date", // 4
    "Time", // 5
    "Location", // 6
    "Image", // 7
    "Pdf", // 8
    "Phone number", // 9
    "Cancel", // 10
  ];

  const icons = [
    <Ionicons name={"link-outline"} size={21} color={colors.textOne} />,
    <Ionicons name={"text-outline"} size={20} color={colors.textOne} />,
    <MaterialCommunityIcons
      name={"numeric"}
      size={20}
      color={colors.textOne}
    />,
    <Ionicons name={"mail-outline"} size={20} color={colors.textOne} />,
    <Fontisto name={"date"} size={18} color={colors.textOne} />,
    <AntDesign name={"clockcircleo"} size={18} color={colors.textOne} />,
    <Ionicons name={"location-outline"} size={20} color={colors.textOne} />,
    <AntDesign name={"picture"} size={18} color={colors.textOne} />,
    <Ionicons name={"document-outline"} size={20} color={colors.textOne} />,
    <AntDesign name={"contacts"} size={20} color={colors.textOne} />,
    <Ionicons name={"close"} size={20} color={colors.primaryErrColor} />,
  ];

  const dataTypesSelector = (index) => {
    const options = dataTypeOptions;
    const destructiveButtonIndex = 10;
    const cancelButtonIndex = 10;
    const containerStyle = {
      backgroundColor: colors.backTwo,
      maxHeight: SCREEN_HEIGHT - 350,
    };
    const textStyle = { color: colors.textOne };
    const message = `Select data type`;
    const messageTextStyle = {
      fontSize: 17,
      fontWeight: "700",
      color: colors.textOne,
    };

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        containerStyle,
        textStyle,
        message,
        messageTextStyle,
        icons: icons,
      },
      async (buttonIndex) => {
        if (buttonIndex != 10)
          setData("dataType", index, dataTypeOptions[buttonIndex], buttonIndex);
      }
    );
  };

  const hasFilledData = () => {
    let hasFilled = true;
    for (let i = 0; i < logData.length; i++) {
      if (
        logData[i].dataName == "" ||
        logData[i].dataType == "Select" ||
        logData[i].dataId == -1
      ) {
        hasFilled = false;
        break;
      }
    }
    return hasFilled;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.backOne }]}
    >
      {isLoading && <CustomActivityIndicator />}
      <FlatList
        data={logData}
        keyExtractor={(item, index) => index.toString()}
        removeClippedSubviews={false}
        ListHeaderComponent={
          <View>
            <Text style={[styles.label, { color: colors.textTwo }]}>
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
              placeholder={"Title"}
              placeholderTextColor={colors.textThree}
            />
          </View>
        }
        renderItem={({ item, index }) => {
          return (
            <View style={{ marginTop: 10 }}>
              <TextInput
                value={item.dataName}
                style={[
                  styles.textInput,
                  { backgroundColor: colors.backTwo, color: colors.textOne },
                ]}
                onChangeText={(txt) => setData("dataName", index, txt)}
                placeholder={"Data name"}
                placeholderTextColor={colors.textThree}
              />
              <TouchableOpacity
                style={[
                  styles.dataTypeSelector,
                  { backgroundColor: colors.backTwo },
                ]}
                onPress={() => dataTypesSelector(index)}
              >
                <View
                  style={{ paddingRight: item.dataType == "Select" ? 0 : 10 }}
                >
                  {icons[dataTypeOptions.indexOf(item.dataType)]}
                </View>
                <Text style={{ color: colors.textOne }}>{item.dataType}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <View style={styles.dataAddrBtnsContainer}>
        <TouchableOpacity
          style={[
            styles.dataAddrRemoverBtn,
            {
              backgroundColor: colors.backOne,
              borderColor:
                logData.length > 1 ? colors.primaryColor : colors.backThree,
            },
          ]}
          onPress={removeData}
        >
          <Text
            style={{
              fontSize: 17,
              color:
                logData.length > 1 ? colors.primaryColor : colors.backThree,
            }}
          >
            Remove
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.dataAddrRemoverBtn,
            {
              backgroundColor: colors.backOne,
              borderColor: colors.primaryColor,
            },
          ]}
          onPress={addData}
        >
          <Text style={{ fontSize: 17, color: colors.primaryColor }}>Add</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.createLogBtn,
          {
            backgroundColor: colors.primaryColor,
          },
        ]}
        onPress={uploadLogger}
      >
        <Text style={styles.createLogBtnTxt}>{"Create Logger"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 10,
    marginTop: 10,
  },
  textInput: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 7,
    marginTop: 5,
    marginHorizontal: 10,
  },
  dataAddrBtnsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  dataAddrRemoverBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 7,
    minWidth: 160,
    borderWidth: 1,
  },
  createLogBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 7,
    minWidth: 160,
    marginVertical: 10,
  },
  createLogBtnTxt: {
    fontSize: 19,
    fontWeight: "700",
    color: "#fff",
  },
  dataTypeSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 7,
    marginTop: 8,
    marginHorizontal: 10,
  },
});
