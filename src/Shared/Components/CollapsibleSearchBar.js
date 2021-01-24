import React from "react";
import Collapsible from "../../Components/Accordian/Collapsable";
import { View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function CollapsibleSearchBar({
  collapsed,
  onTextChange,
  onXPress,
  searchKey,
}) {
  return (
    <Collapsible collapsed={collapsed}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          padding: 5,
          paddingLeft: 8,
          height: 65,
          borderBottomColor: "#f2f2f2",
          borderBottomWidth: 0.8,
        }}
      >
        <TextInput
          value={searchKey}
          onChangeText={(text) => onTextChange(text)}
          placeholder={"Search here"}
          style={{
            backgroundColor: "#f2f2f2",
            paddingVertical: 10,
            paddingHorizontal: 20,
            fontSize: 17,
            flex: 1,
            color: "#555",
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
        />
      </View>
    </Collapsible>
  );
}
