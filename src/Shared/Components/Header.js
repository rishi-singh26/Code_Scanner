import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useSelector } from "react-redux";

export default function Header({
  title,
  iconRightName,
  onRightIconPress,
  showSearchIcon,
  onSearchIconPress,
}) {
  const theme = useSelector((state) => state.theme);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 3,
        backgroundColor: theme.colors.backOne,
      }}
    >
      <Text
        style={{ fontSize: 24, fontWeight: "700", color: theme.colors.textOne }}
      >
        {title}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {showSearchIcon ? (
          <TouchableOpacity
            onPress={onSearchIconPress}
            style={{ padding: 8, marginRight: iconRightName ? 10 : 0 }}
          >
            <Feather name={"search"} size={20} color={theme.colors.textOne} />
          </TouchableOpacity>
        ) : null}
        {iconRightName ? (
          <TouchableOpacity onPress={onRightIconPress} style={{ padding: 8 }}>
            <Feather
              name={iconRightName}
              size={20}
              color={theme.colors.textOne}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
