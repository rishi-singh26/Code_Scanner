import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { primaryColor } from "../Styles";

export default function CustomActivityIndicator() {
  const theme = useSelector(state => state.theme)
  return (
    <View style={{
      padding: 20,
      borderRadius: 9,
      position: "absolute",
      top: 250,
      zIndex: 1000,
      alignSelf: "center",
      backgroundColor: theme.colors.backTwo
    }}>
    <ActivityIndicator
      size={35}
      color={primaryColor}
    />
    </View>
  );
}
