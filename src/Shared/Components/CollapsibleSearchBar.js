import React from "react";
import { View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function CollapsibleSearchBar({
  onTextChange,
  searchKey,
  onXPress,
}) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.backTwo,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomColor: colors.backTwo,
        borderBottomWidth: 0.8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.backOne,
          paddingLeft: 20,
          paddingRight: 0,
          borderRadius: 8,
        }}
      >
        <TextInput
          value={searchKey}
          onChangeText={(text) => onTextChange(text)}
          placeholder={"Search here"}
          placeholderTextColor={colors.textTwo}
          style={{
            fontSize: 17,
            flex: 1,
            color: colors.textOne,
            paddingVertical: 8,
          }}
        />
        {searchKey.length > 0 && (
          <Feather
            name={"x"}
            size={20}
            color={colors.textTwo}
            style={{ padding: 10 }}
            onPress={onXPress}
          />
        )}
      </View>
    </View>
  );
}
