import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { primaryColor } from "../../Shared/Styles";
import { Feather } from "@expo/vector-icons";

export default function ShareQRBar({
  shareQrCode,
  onSave,
  uploadScannedData,
  backgroundColor,
}) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColor ? backgroundColor : "#f2f2f2" },
      ]}
    >
      <TouchableOpacity onPress={shareQrCode} style={styles.btn}>
        <Feather name="share-2" color={primaryColor} size={26} />
        <Text>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSave} style={styles.btn}>
        <Feather name="download" color={primaryColor} size={26} />
        <Text>Save to Gallery</Text>
      </TouchableOpacity>
      {uploadScannedData ? (
        <TouchableOpacity onPress={uploadScannedData} style={styles.btn}>
          <Feather name="plus-square" color={primaryColor} size={26} />
          <Text>Add to list</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    margin: 20,
    borderRadius: 15,
    justifyContent: "space-around",
    alignItems: "center",
  },
  btn: { justifyContent: "center", alignItems: "center", padding: 5 },
});
