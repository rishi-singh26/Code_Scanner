import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function LogTile({
  tileText,
  titleSubText,
  rightIcon,
  style,
  onPress,
  rightIconColor,
  onRightIconPress = () => {},
}) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  return (
    <TouchableOpacity
      style={[
        styles.tileContainer,
        { backgroundColor: colors.backOne },
        style ? style : null,
      ]}
      onPress={onPress}
    >
      <View>
        <Text style={[styles.tileText, { color: colors.textOne }]}>
          {tileText}
        </Text>
        {titleSubText && (
          <Text style={[styles.tileSubText, { color: colors.textTwo }]}>
            {titleSubText}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={onRightIconPress}>
        <Feather
          name={rightIcon}
          size={20}
          color={rightIconColor || colors.textOne}
          style={{ paddingVertical: 10, paddingHorizontal: 15 }}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingRight: 7,
    paddingVertical: 10,
    alignItems: "center",
  },
  tileText: {
    fontSize: 17,
    fontWeight: "700",
  },
  tileSubText: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "700",
  },
});
