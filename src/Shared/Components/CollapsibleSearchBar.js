import React from "react";
import Collapsible from "../../Components/Accordian/Collapsable";
import { View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function CollapsibleSearchBar({
  collapsed,
  onTextChange,
  onXPress,
  searchKey,
}) {
  const theme = useSelector((state) => state.theme);
  const { colors, mode } = theme;
  return (
    <Collapsible
      collapsed={collapsed}
      style={{ backgroundColor: colors.backOne }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.backOne,
          padding: 5,
          paddingLeft: 8,
          height: 65,
          borderBottomColor: colors.backTwo,
          borderBottomWidth: 0.8,
        }}
      >
        <TextInput
          value={searchKey}
          onChangeText={(text) => onTextChange(text)}
          placeholder={"Search here"}
          placeholderTextColor={colors.textTwo}
          style={{
            backgroundColor: colors.backTwo,
            paddingVertical: 10,
            paddingHorizontal: 20,
            fontSize: 17,
            flex: 1,
            color: colors.textOne,
            borderRadius: 8,
          }}
        />
        <Feather
          name="x"
          size={22}
          style={{ paddingHorizontal: 20, paddingVertical: 5 }}
          onPress={() => {
            onXPress();
          }}
          color={colors.textOne}
        />
      </View>
    </Collapsible>
  );
}
