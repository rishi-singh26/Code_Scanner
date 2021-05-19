import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function ListEmpty({
  editorFunc,
  qrFunc,
  passwordsFunc,
  scannerFunc,
  scanImgFunc,
}) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  return (
    <View style={{ margin: 30 }}>
      <Text
        style={[{ fontSize: 29, fontWeight: "700" }, { color: colors.textOne }]}
      >
        Bit lonely here
      </Text>
      <View style={{ margin: 15 }}>
        <Text
          onPress={scannerFunc}
          style={[styles.emptyListOptions, { color: colors.primaryColor }]}
        >
          Scan QR
        </Text>
        <Text
          onPress={scanImgFunc}
          style={[styles.emptyListOptions, { color: colors.primaryColor }]}
        >
          Scan QR from image
        </Text>
        <Text
          onPress={editorFunc}
          style={[styles.emptyListOptions, { color: colors.primaryColor }]}
        >
          Add note
        </Text>
        <Text
          onPress={qrFunc}
          style={[styles.emptyListOptions, { color: colors.primaryColor }]}
        >
          Create QR
        </Text>
        <Text
          onPress={passwordsFunc}
          style={[styles.emptyListOptions, { color: colors.primaryColor }]}
        >
          Save passwords
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyListOptions: {
    marginVertical: 7,
    fontSize: 18,
    textDecorationLine: "underline",
  },
});
