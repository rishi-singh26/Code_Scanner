import React from "react";
import { ActivityIndicator } from "react-native";
import { primaryColor } from "../Styles";

export default function CustomActivityIndicator() {
  return (
    <ActivityIndicator
      size={35}
      color={primaryColor}
      style={{
        position: "absolute",
        top: 250,
        zIndex: 1000,
        alignSelf: "center",
      }}
    />
  );
}
