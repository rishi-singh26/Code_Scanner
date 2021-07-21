import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { useDispatch } from "react-redux";
import { showSnack } from "../../../Redux/Snack/ActionCreator";
import { openFile } from "../../Functions";
import { pickImage } from "./Functions";

export default function ImagePicker({
  viewStyle,
  imageStyle,
  setData,
  textColor,
  value,
}) {
  const dispatch = useDispatch();

  const getImage = async () => {
    const { status, result } = await pickImage();
    if (!status) {
      dispatch(showSnack("Error in picking image, plaese try again."));
    }
    setData(result);
  };
  // console.log("hereisvalue", value);
  return (
    <TouchableOpacity style={viewStyle} onPress={getImage}>
      {value ? (
        <>
          <Image
            source={{ uri: value.uri }}
            style={[imageStyle, { aspectRatio: value.width / value.height }]}
            // style={{ height: image.heigth, width: image.width }}
          />
          <TouchableOpacity
            style={styles.expandBtn}
            onPress={() => openFile(value.uri)}
          >
            <Ionicons name={"expand-outline"} size={20} color={"#222"} />
          </TouchableOpacity>
        </>
      ) : (
        <Text style={{ fontSize: 15, color: textColor, padding: 6 }}>
          Tap to pick image
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  expandBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 10,
    backgroundColor: "#efefef",
    borderRadius: 8,
  },
});
