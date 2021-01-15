import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Accordion from "../../Components/Accordian/Accordian";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "../../Shared/Styles";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { toast } from "../../Shared/Functions";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function ScannedDataDetail(props) {
  const { scannedData } = props.route.params;
  const [activeSections, setActiveSections] = useState([]);
  // console.log(scannedData);
  // *Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();
  // *Qrcode ref
  const shareQrRef = useRef(null);

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row" }}>
            {activeSections.length > 0 ? (
              <TouchableOpacity
                style={{ paddingHorizontal: 15, paddingVertical: 12 }}
                onPress={() => {
                  openActionSheet();
                }}
              >
                <Feather name="share" size={22} color="black" />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={{
                paddingLeft: 15,
                paddingVertical: 12,
                paddingRight: 20,
              }}
              onPress={() => {
                activeSections.length > 0
                  ? setActiveSections([])
                  : setActiveSections([0]);
              }}
            >
              <FontAwesome name="qrcode" size={23} color={"black"} />
            </TouchableOpacity>
          </View>
        );
      },
    });
  };

  const openActionSheet = () => {
    const options = ["Save to gallery", "Share", "Cancel"];
    const cancelButtonIndex = 3;
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

  useEffect(() => {
    setHeaderOptions();
  }, [activeSections]);

  const _renderContent = (qrValue) => {
    return (
      <ViewShot
        style={styles.qrView}
        ref={shareQrRef}
        options={{ format: "jpg", quality: 1.0 }}
      >
        <QRCode size={280} value={qrValue} backgroundColor="#f2f2f2" />
      </ViewShot>
    );
  };

  const _updateSections = (activeSections) => {
    console.log(activeSections);
    setActiveSections(activeSections);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Accordion
          sections={[1]}
          activeSections={activeSections}
          renderHeader={() => null}
          renderContent={() => _renderContent(scannedData?.text || "Empty")}
          onChange={_updateSections}
        />
        <Text
          onPress={() => {
            scannedData?.title ? null : setShowTitleTextBox(true);
          }}
          style={styles.title}
        >
          {scannedData?.title || "No title"}
        </Text>
        <Text style={styles.text}>{scannedData?.text || ""}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: "#666",
  },
  title: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  textInputView: {
    padding: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: "700",
    backgroundColor: "#f2f2f2",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  qrView: {
    height: SCREEN_WIDTH - 20,
    // width: SCREEN_WIDTH - 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
});
