import React from "react";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SCREEN_WIDTH } from "../Shared/Styles";

export default function QRBox({ shareQrRef, qrcodeVal }) {
  return (
    <View
      style={styles.qrView}
      ref={shareQrRef}
      options={{ format: "jpg", quality: 1.0 }}
    >
      <QRCode size={280} value={qrcodeVal === "" ? "Empty" : qrcodeVal} />
    </View>
  );
}

const styles = StyleSheet.create({
  qrView: {
    borderRadius: 15,
    backgroundColor: "#fff",
    width: SCREEN_WIDTH - 40,
    height: SCREEN_WIDTH - 40,
    marginHorizontal: 20,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
});
