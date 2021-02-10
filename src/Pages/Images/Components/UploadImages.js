import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { showAlert } from "../../../Redux/Alert/ActionCreator";
import { showSnack } from "../../../Redux/Snack/ActionCreator";
import { pickImage } from "../../../Shared/Functions";
import RenderImage from "./RenderImage";

export default function UploadImages(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const [selectedImgs, setSelectedImgs] = useState([]);

  const dispatch = useDispatch();

  const imagePicker = async () => {
    const { status, result } = await pickImage();
    status && !result.cancelled
      ? setSelectedImgs([...selectedImgs, { image: result.uri }])
      : dispatch(showSnack("Oops!! Image not selected. Please try again"));
  };

  const uploadImages = async () => {
    console.log("uploading all images");
  };

  const finalyze = () => {
    const numImages = selectedImgs.length;
    dispatch(
      showAlert(
        `Do you want to upload ${numImages} ${
          numImages > 1 ? `images` : "image"
        }?`,
        ``,
        uploadImages
      )
    );
  };

  const AddImgBigBtn = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: colors.primarySuperFadedColor,
          padding: 40,
          borderRadius: 20,
          alignItems: "center",
          margin: 10,
        }}
        onPress={imagePicker}
      >
        <Feather name="plus" size={50} color={"#fff"} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      {selectedImgs.length > 0 ? (
        <RenderImage
          images={[
            { isAddBtn: true, onPress: () => imagePicker() },
            ...selectedImgs,
          ]}
          onPress={(source) =>
            props.navigation.navigate("ImageViewer", {
              source,
              removeImage: null,
            })
          }
        />
      ) : (
        <AddImgBigBtn />
      )}
      <FAB
        style={[
          styles.fab,
          {
            backgroundColor:
              selectedImgs.length > 0
                ? colors.primaryColor
                : colors.primaryLightColor,
          },
        ]}
        icon="check"
        onPress={finalyze}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
