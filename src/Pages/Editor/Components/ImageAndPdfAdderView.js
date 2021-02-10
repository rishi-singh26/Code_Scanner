import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function ImageAndPdfAdderView({
  setImageViewCollapsed,
  imageViewCollapsed,
  images,
  onAddPress,
  pdfs,
}) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  return (
    <View
      style={[
        styles.addImageActivatorView,
        { backgroundColor: colors.backOne },
      ]}
    >
      <Text style={{ color: colors.textOne, fontSize: 16, fontWeight: "700" }}>
        {images.length > 0 ? "Images and PDF" : "Attach Image or PDF"}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={onAddPress}
          style={{ marginHorizontal: 5, padding: 10 }}
        >
          <Feather name={"map-pin"} color={colors.primaryColor} size={23} />
        </TouchableOpacity>
        {images.length > 0 || pdfs.length > 0 ? (
          <TouchableOpacity
            onPress={() => setImageViewCollapsed(!imageViewCollapsed)}
            style={{ padding: 10 }}
          >
            <Feather
              name={imageViewCollapsed ? "chevron-down" : "chevron-up"}
              color={colors.primaryColor}
              size={23}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addImageActivatorView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    // paddingVertical: 10,
  },
});
