import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import { primaryColor, SCREEN_WIDTH } from "../../Shared/Styles";
import * as MediaLibrary from "expo-media-library";
import { useDispatch } from "react-redux";
import { addScannedData } from "../../Redux/ScannedData/ActionCreator";
import { auth } from "../../Constants/Api";
import Header from "../../Shared/Components/Header";
import ShareQRBar from "../../Shared/Components/ShareQRBar";
import { showSnack } from "../../Redux/Snack/ActionCreator";

export default function QrGenerator() {
  // *Local state
  const [qrcodeVal, setQrcodeVal] = useState("");
  // *Qrcode ref
  const shareQrRef = useRef(null);

  const dispatch = useDispatch();

  let onSave = async () => {
    shareQrRef.current.capture().then(async (uri) => {
      // console.log("do something with ", uri);
      const mediaLibPermission = await MediaLibrary.requestPermissionsAsync();
      if (mediaLibPermission.status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        // console.log(asset);
        dispatch(showSnack("Saved to Gallery"));
      }
    });
  };

  const shareQrCode = () => {
    if (qrcodeVal === "") {
      dispatch(showSnack("Enter some text"));
      return;
    }
    shareQrRef.current.capture().then(async (uri) => {
      console.log("shareQrCode ", uri);
      if (!(await Sharing.isAvailableAsync())) {
        alert(`Uh oh, sharing isn't available on your platform`);
        return;
      }
      await Sharing.shareAsync(uri);
    });
  };

  const uploadScannedData = () => {
    if (qrcodeVal === "") {
      dispatch(showSnack("Enter some text"));
      return;
    }
    dispatch(
      addScannedData({
        scannedData: { type: "Not available", data: qrcodeVal },
        creationDate: new Date(),
        userId: auth.currentUser.uid,
      })
    );
    dispatch(showSnack("Added to list"));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={"Generator"} />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <View style={{ backgroundColor: "#f2f2f2" }}>
          <TextInput
            value={qrcodeVal}
            onChangeText={(text) => setQrcodeVal(text)}
            placeholder="Write your text here"
            style={styles.textInput}
            multiline={true}
          />
        </View>
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
        <ShareQRBar
          shareQrCode={shareQrCode}
          onSave={onSave}
          uploadScannedData={uploadScannedData}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 10,
    backgroundColor: "#fff",
  },
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
