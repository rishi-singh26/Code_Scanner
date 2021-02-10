import React, { useState, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../Constants/Api";
import {
  addScannedData,
  editScannedData,
} from "../../Redux/ScannedData/ActionCreator";
import { showSnack } from "../../Redux/Snack/ActionCreator";

export default function Editor(props) {
  const theme = useSelector((state) => state.theme);
  const { colors, mode } = theme;
  // console.log(props);
  const [testWidth, setTestWidth] = useState("99%");
  const [title, setTitle] = useState(props?.route?.params?.title || "");
  const [data, setData] = useState(props?.route?.params?.data || "");
  const [inputHeight, setInputHeight] = useState(150);
  const [inputFullHeight, setInputFullHeight] = useState(150);

  const dispatch = useDispatch();

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={() => {
              console.log({ title, data, id: props?.route?.params?.id });
              saveData(
                title,
                data,
                props?.route?.params?.id,
                props?.route?.params?.isEditing
              );
            }}
            style={styles.headerEditIconStyle}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#888",
                marginHorizontal: 20,
              }}
            >
              SAVE
            </Text>
          </TouchableOpacity>
        );
      },
    });
  };

  const saveData = (title, data, id, isEditing) => {
    if (isEditing) {
      if (id) {
        dispatch(
          editScannedData(
            {
              title: title,
              scannedData: { data: data },
              updatedDate: new Date(),
            },
            id
          )
        );
        props.navigation.navigate("Home");
      } else {
        dispatch(showSnack("Error while editing"));
      }
    } else {
      dispatch(
        addScannedData({
          scannedData: { data },
          creationDate: new Date(),
          isDeleted: false,
          userId: auth.currentUser.uid,
          title: title,
        })
      );
      props.navigation.goBack();
    }
  };

  const onMount = () => {
    Keyboard.addListener("keyboardDidShow", updateKeyboardSpace);
    Keyboard.addListener("keyboardDidHide", resetKeyboardSpace);
  };

  const onUnMount = () => {
    Keyboard.removeAllListeners("keyboardDidShow");
    Keyboard.removeAllListeners("keyboardDidHide");
  };

  const updateKeyboardSpace = (frames) => {
    console.log(`Keyboard showm\n${JSON.stringify(frames, null, 2)}`);
    var change;
    if (frames.endCoordinates) change = frames.endCoordinates.height;
    else change = frames.end.height;
    setInputHeight(inputHeight - change);
  };
  const resetKeyboardSpace = (frames) => {
    setInputHeight(inputFullHeight);
    console.log(`Keyboard hidden\n${JSON.stringify(frames, null, 2)}`);
  };

  useEffect(() => {
    setTestWidth("100%");
    // onMount();
    return () => {
      //   onUnMount();
    };
  }, []);

  useEffect(() => {
    setHeaderOptions();
  }, [title, data]);

  return (
    <SafeAreaView
      onLayout={(ev) => {
        var fullHeight = ev.nativeEvent.layout.height - 47;
        // console.log(fullHeight);
        setInputHeight(fullHeight);
        setInputFullHeight(fullHeight);
      }}
      style={{
        flex: 1,
        backgroundColor: colors.backTwo,
        alignItems: "stretch",
      }}
    >
      {/* <ScrollView> */}
      <TextInput
        value={title}
        onChangeText={(text) => setTitle(text)}
        placeholder="Enter title"
        style={[
          styles.textInput,
          { fontSize: 19, fontWeight: "700", color: colors.textOne },
        ]}
      />
      <TextInput
        placeholder="Note"
        autoFocus
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});
