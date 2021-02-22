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

export default function Editor(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
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

  const saveData = async (title, textData, id, isEditing) => {
    if (isEditing) {
      if (id) {
        const {isLockaed, notePass} = props?.route?.params;
        if(isLockaed){
          const { status, data } = await encryptText(textData, notePass);
          console.log({status, data});
          if(status){
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
          }else{
            dispatch(showSnack("Error while editing, please try again"))
          }
        }else{
          dispatch(
            editScannedData(
              {
                title: title,
                scannedData: { data: textData },
                updatedDate: new Date(),
              },
              id
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
