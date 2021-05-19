import React from "react";
import { useSelector } from "react-redux";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import Dilogue from "../../../Shared/Components/Dilogue";
import { Ionicons } from "@expo/vector-icons";

export default function AppLockDiloge({ showAuthErrBox, checkLocalAuth }) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  return (
    <Dilogue
      dilogueVisible={showAuthErrBox}
      closeDilogue={() => {
        console.log("Closing Auth modal");
      }}
      cancellable={false}
      transparentBackColor={"#0007"}
      dilogueBackground={colors.backOne}
    >
      <Text style={[styles.authDilogueHeader, { color: colors.textOne }]}>
        Authentication Required
      </Text>
      <Ionicons
        name="ios-finger-print"
        size={80}
        color={colors.primaryErrColor}
        style={{ alignSelf: "center", paddingVertical: 20 }}
      />
      <TouchableOpacity onPress={checkLocalAuth}>
        <Text style={[styles.authDilogueTxt, { color: colors.textOne }]}>
          Try Again
        </Text>
      </TouchableOpacity>
    </Dilogue>
  );
}

const styles = StyleSheet.create({
  authDilogueHeader: {
    fontSize: 18,
    fontWeight: "700",
  },
  authDilogueTxt: {
    fontSize: 16,
    paddingVertical: 10,
    fontWeight: "700",
    alignSelf: "flex-end",
    paddingHorizontal: 20,
  },
});
