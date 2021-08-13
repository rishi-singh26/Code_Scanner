import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

export default function ListTile({
  tileText,
  rightIcon,
  style,
  onPress,
  rightIconColor,
}) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  return (
    <TouchableOpacity
      style={[
        styles.tileContainer,
        { backgroundColor: colors.backTwo },
        style ? style : null,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.tileText, { color: colors.textOne }]}>
        {tileText}
      </Text>
      <Feather
        name={rightIcon}
        size={20}
        color={rightIconColor || colors.textOne}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tileText: {
    fontSize: 17,
  },
});
