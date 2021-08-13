import React, { useState, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../Constants/Api";
import {
  addScannedData,
  editScannedData,
} from "../../Redux/ScannedData/ActionCreator";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import { encryptText } from "../../Shared/Functions";
import { AntDesign } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import LockNoteDilogue from "../Home/Components/LockNoteDilogue";

export default function Editor(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const {
    title: prevTitle,
    data: prevData,
    isEditing,
    id,
  } = props?.route?.params;
  // console.log(props);
  const [testWidth, setTestWidth] = useState("99%");
  const [title, setTitle] = useState(prevTitle || "");
  const [data, setData] = useState(prevData || "");
  const [inputHeight, setInputHeight] = useState(150);
  const [isPassInputShown, setIsPassInputShown] = useState(false);
  const [password, setPassword] = useState("");
  // Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();

  const dispatch = useDispatch();

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={() =>
              isEditing
                ? saveData(title, data, id, isEditing)
                : openSaveOptions()
            }
            style={{ padding: 6 }}
          >
            <Text style={styles.svaeBtnTxt}>SAVE</Text>
          </TouchableOpacity>
        );
      },
    });
  };

  const openSaveOptions = () => {
    const options = [
      "Save note without password",
      "Add password before saving",
      "Cancel",
    ];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 2;
    const containerStyle = { backgroundColor: colors.backTwo };
    const textStyle = { color: colors.textOne };
    const icons = [
      <AntDesign name={"warning"} size={20} color={colors.textOne} />,
      <AntDesign name={"Safety"} size={21} color={colors.textOne} />,
      <AntDesign name={"close"} size={20} color={colors.primaryErrColor} />,
    ];
    const message = "Options";
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
        icons,
        containerStyle,
        textStyle,
        message,
        messageTextStyle,
      },
      async (buttonIndex) => {
        if (buttonIndex == 0) {
          saveData(title, data, id, isEditing);
          return;
        }
        if (buttonIndex == 1) {
          setIsPassInputShown(true);
          return;
        }
      }
    );
  };

  const saveData = async (
    title,
    textData,
    id,
    isEditing,
    isEncrypted = false
  ) => {
    if (isEditing) {
      if (id) {
        const { isLockaed, notePass } = props?.route?.params;
        if (isLockaed) {
          const { status, data } = await encryptText(textData, notePass);
          // console.log({ status, data });
          if (status) {
            dispatch(
              editScannedData(
                {
                  title: title,
                  scannedData: { data: data },
                  updatedDate: new Date(),
                }, // fields to be updated
                id // _id of the document to be updated
              )
            );
          } else {
            dispatch(showSnack("Error while editing, please try again"));
          }
        } else {
          dispatch(
            editScannedData(
              {
                title: title,
                scannedData: { data: textData },
                updatedDate: new Date(),
              }, // fields to be updated
              id // _id of the document to be updated
            )
          );
        }
        props.navigation.navigate("Home");
      } else {
        dispatch(showSnack("Error while editing, please try again"));
      }
    } else {
      dispatch(
        addScannedData({
          scannedData: { data: textData },
          creationDate: new Date(),
          isDeleted: false,
          userId: auth.currentUser.uid,
          title: title,
          isLockaed: isEncrypted, // checks if the data being saved is encrypted or not
        })
      );
      props.navigation.goBack();
    }
  };

  useEffect(() => {
    setTestWidth("100%");
  }, []);

  useEffect(() => {
    setHeaderOptions();
  }, [title, data]);

  const passwordDologueCancelPress = () => {
    setIsPassInputShown(false);
    setPassword("");
  };

  const passwordDologueOkPress = async () => {
    if (password.length < 4) {
      dispatch(showSnack("Password too small"));
      return;
    }
    setIsPassInputShown(false);
    const { status, data: encryptedData } = await encryptText(data, password);
    console.log({ status, encryptedData });
    if (!status) {
      dispatch(showSnack("Could not save note, please try again!"));
      return;
    }
    saveData(title, encryptedData, id, isEditing, true);
  };

  return (
    <SafeAreaView
      onLayout={(ev) => {
        var fullHeight = ev.nativeEvent.layout.height - 47;
        // console.log(fullHeight);
        setInputHeight(fullHeight);
      }}
      style={{
        flex: 1,
        backgroundColor: colors.backOne,
        alignItems: "stretch",
      }}
    >
      {/* <ScrollView> */}
      <TextInput
        value={title}
        onChangeText={(text) => setTitle(text)}
        placeholder="Title"
        placeholderTextColor={colors.textTwo}
        style={[
          styles.textInput,
          { fontSize: 19, fontWeight: "700", color: colors.textOne },
        ]}
      />
      <TextInput
        placeholder="Note"
        placeholderTextColor={colors.textTwo}
        // autoFocus
        value={data}
        onChangeText={(text) => setData(text)}
        style={[
          styles.textInput,
          {
            width: testWidth,
            fontSize: 16,
            height: inputHeight,
            textAlignVertical: "top",
            color: colors.textTwo,
          },
        ]}
        multiline
      />
      {/* </ScrollView> */}
      <LockNoteDilogue
        password={password}
        setPassword={setPassword}
        onOkPress={passwordDologueOkPress}
        onCancelPress={passwordDologueCancelPress}
        visible={isPassInputShown}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  svaeBtnTxt: {
    fontSize: 16,
    fontWeight: "700",
    color: "#888",
    marginHorizontal: 20,
  },
});
