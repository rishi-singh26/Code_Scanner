import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

export default function Header({
  title,
  iconRightName,
  onRightIconPress,
  showSearchIcon,
  onSearchIconPress,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 1,
        height: 60,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "700" }}>{title}</Text>
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
            <Feather name={"search"} size={20} color="black" />
          </TouchableOpacity>
        ) : null}
        {iconRightName ? (
          <TouchableOpacity onPress={onRightIconPress} style={{ padding: 8 }}>
            <Feather name={iconRightName} size={20} color="black" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
