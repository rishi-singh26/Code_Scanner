import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { primaryColor } from "../Styles";

export default function CustomActivityIndicator({ text }) {
  const theme = useSelector((state) => state.theme);
  return (
    <View
      style={{
        padding: 8,
        borderRadius: 9,
        position: "absolute",
        top: 250,
        zIndex: 1000,
        alignSelf: "center",
        backgroundColor: theme.colors.backTwo,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
      <ActivityIndicator size={35} color={primaryColor} />
    </View>
  );
}
