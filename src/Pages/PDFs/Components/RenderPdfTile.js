import React from "react";
import { FlatList, TouchableOpacity, StyleSheet, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { SCREEN_WIDTH } from "../../../Shared/Styles";

export default function RenderPdfTile({ pdfs, onPress, onLongPress }) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  return (
    <FlatList
      data={pdfs}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            onPress={() => onPress(item)}
            onLongPress={() => onLongPress(item)}
            style={[styles.viewBox, { backgroundColor: colors.backOne }]}
          >
            <AntDesign
              name="pdffile1"
              size={50}
              color={colors.primaryErrColor}
            />
            <Text style={{ color: colors.textOne }}>{item.pdfName}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  viewBox: {
    width: SCREEN_WIDTH / 3 - 16,
    height: SCREEN_WIDTH / 3 - 16,
    marginTop: 12,
    marginLeft: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
  },
});
