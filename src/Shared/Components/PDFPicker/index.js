import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { showSnack } from "../../../Redux/Snack/ActionCreator";
import { pickDocuments } from "./Functions";
import { AntDesign, Ionicons } from "@expo/vector-icons";

export default function PDFPicker({
  viewStyle,
  setData,
  pdfIconColor,
  textColor,
  value,
}) {
  const dispatch = useDispatch();

  const getPdf = async () => {
    const { status, result } = await pickDocuments();
    if (!status) {
      dispatch(showSnack("Error in picking pdf, plaese try again."));
    }
    setData(result);
  };
  return (
    <TouchableOpacity style={viewStyle} onPress={getPdf}>
      {value ? (
        <View style={styles.pdfView}>
          <View style={styles.iconTextView}>
            <AntDesign name={"pdffile1"} size={22} color={pdfIconColor} />
            <Text style={{ marginLeft: 10, color: textColor, fontSize: 15 }}>
              {value.name}
            </Text>
          </View>
          <TouchableOpacity style={{ padding: 15 }}>
            <Ionicons name={"expand-outline"} size={20} color={textColor} />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={{ fontSize: 15, paddingVertical: 14, color: textColor }}>
          Tap to pick PDF
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconTextView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  pdfView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
