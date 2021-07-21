import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { primaryColor } from "../Styles";

export default function CustomActivityIndicator({ text, size }) {
  const theme = useSelector((state) => state.theme);
  return (
    <View
      style={{
        borderRadius: 9,
        position: "absolute",
        top: 250,
        zIndex: 1000,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.colors.backOne,
        padding: 6,
      }}
    >
      {text ? (
        <Text
          style={{
            fontSize: 19,
            fontWeight: "700",
            color: theme.colors.textOne,
          }}
        >
          {text}
        </Text>
      ) : null}
      <ActivityIndicator size={size ? size : 35} color={primaryColor} />
    </View>
  );
}
