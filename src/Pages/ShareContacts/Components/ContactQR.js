import React, { useRef, useState } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import { primaryColor, SCREEN_WIDTH } from "../../../Shared/Styles";
import * as MediaLibrary from "expo-media-library";
import { toast } from "../../../Shared/Functions";
import ShareQRBar from "../../../Shared/Components/ShareQRBar";

export default function ContactQR(props) {
  const { qrcodeVal } = props.route.params;
  // *Qrcode ref
  const shareQrRef = useRef(null);

  let onSave = async () => {
    shareQrRef.current.capture().then(async (uri) => {
      // console.log("do something with ", uri);
      const mediaLibPermission = await MediaLibrary.requestPermissionsAsync();
      if (mediaLibPermission.status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        // console.log(asset);
        toast("Saved to gallery");
      }
    });
  };

  const shareQrCode = () => {
    shareQrRef.current.capture().then(async (uri) => {
      console.log("shareQrCode ", uri);
      if (!(await Sharing.isAvailableAsync())) {
        alert(`Uh oh, sharing isn't available on your platform`);
        return;
      }
      await Sharing.shareAsync(uri);
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <ViewShot
          style={styles.qrView}
          ref={shareQrRef}
          options={{ format: "jpg", quality: 1.0 }}
        >
          <QRCode
            size={280}
            color={primaryColor}
            value={qrcodeVal === "" ? "Empty" : qrcodeVal}
          />
        </ViewShot>
        <ShareQRBar onSave={onSave} shareQrCode={shareQrCode} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  qrView: {
    borderRadius: 15,
    backgroundColor: "#fff",
    width: SCREEN_WIDTH - 40,
    height: SCREEN_WIDTH - 40,
    margin: 20,
    elevation: 0.1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#dfdfdf",
  },
  sliderView: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 0,
    marginHorizontal: 20,
  },
});
