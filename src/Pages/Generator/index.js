import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import { SCREEN_WIDTH } from "../../Shared/Styles";
import * as MediaLibrary from "expo-media-library";
import { toast } from "../../Shared/Functions";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Feather } from "@expo/vector-icons";

export default function QrGenerator(props) {
  // *Local state
  const [qrcodeVal, setQrcodeVal] = useState("");
  // *Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();
  // *Qrcode ref
  const shareQrRef = useRef(null);

  let onSave = async () => {
    shareQrRef.current.capture().then(async (uri) => {
      console.log("do something with ", uri);
      const mediaLibPermission = await MediaLibrary.requestPermissionsAsync();
      if (mediaLibPermission.status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        console.log(asset);
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

  const openActionSheet = () => {
    const options = ["Save to gallery", "Share", "Cancel"];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          onSave();
          return;
        }
        if (buttonIndex == 1) {
          shareQrCode();
          return;
        }
      }
    );
  };

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ marginHorizontal: 20 }}
            onPress={() => {
              openActionSheet();
            }}
          >
            <Feather name="share" size={23} color="black" />
          </TouchableOpacity>
        );
      },
    });
  };

  useEffect(() => {
    setHeaderOptions();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
      }}
    >
      <View>
        <TextInput
          value={qrcodeVal}
          onChangeText={(text) => setQrcodeVal(text)}
          placeholder="Write your text here"
          style={styles.textInput}
        />
        <ViewShot
          style={styles.qrView}
          ref={shareQrRef}
          options={{ format: "jpg", quality: 1.0 }}
        >
          <QRCode size={280} value={qrcodeVal === "" ? "Empty" : qrcodeVal} />
        </ViewShot>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 10,
    borderColor: "#dfdfdf",
    borderWidth: 1,
  },
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
