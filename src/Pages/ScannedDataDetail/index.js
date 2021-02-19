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
import { Feather, FontAwesome } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "../../Shared/Styles";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { isContactInfo } from "../../Shared/Functions";
import RenderContactInfo from "../../Shared/Components/RenderContactInfo";
import Collapsible from "../../Components/Accordian/Collapsable";
import ShareQRBar from "../../Shared/Components/ShareQRBar";
import { useDispatch, useSelector } from "react-redux";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import HorizontalView from "../../Shared/Components/HorizontalView";

export default function ScannedDataDetail(props) {
  const { scannedData } = props.route.params;
  const [isQrCollapsed, setIsQrCollapsed] = useState(true);
  const theme = useSelector((state) => state.theme);

  const { backOne, backTwo, backThree, textOne, textTwo } = theme.colors;

  const dispatch = useDispatch();

  // console.log(scannedData);
  // *Qrcode ref
  const shareQrRef = useRef(null);

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <HorizontalView style={{ alignItems: "center" }}>
            {isContactInfo(scannedData.text) ? null : (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("Editor", {
                    title: scannedData?.title || "",
                    data: scannedData?.text || "",
                    id: scannedData?.id,
                    isEditing: true,
                    isLockaed: scannedData?.isLockaed,
                    notePass: scannedData?.notePass
                  });
                }}
                style={styles.headerEditIconStyle}
              >
                <Feather name="edit" size={23} color={textOne} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setIsQrCollapsed(!isQrCollapsed);
              }}
              style={styles.headerQRIconStyle}
            >
              <FontAwesome name="qrcode" size={23} color={textOne} />
            </TouchableOpacity>
          </HorizontalView>
        );
      },
      headerTitle: scannedData?.title || "Detail",
      headerTitleStyle: { width: SCREEN_WIDTH / 2, fontWeight: "700" },
    });
  };

  useEffect(() => {
    setHeaderOptions();
  }, [isQrCollapsed]);

  const onSave = async () => {
    shareQrRef.current.capture().then(async (uri) => {
      // console.log("do something with ", uri);
      const mediaLibPermission = await MediaLibrary.requestPermissionsAsync();
      if (mediaLibPermission.status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        // console.log(asset);
        dispatch(showSnack("Svaed to Gallery"));
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
    <SafeAreaView style={{ flex: 1, backgroundColor: backTwo }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Collapsible collapsed={isQrCollapsed}>
          <View>
            <ViewShot
              style={[styles.qrView, { backgroundColor: backTwo }]}
              ref={shareQrRef}
              options={{ format: "jpg", quality: 1.0 }}
            >
              <QRCode
                size={280}
                value={scannedData?.text || "Empty"}
                backgroundColor={backTwo}
                color={textOne}
              />
            </ViewShot>
            <ShareQRBar
              backgroundColor={backOne}
              shareQrCode={shareQrCode}
              onSave={onSave}
            />
          </View>
        </Collapsible>
        {isContactInfo(scannedData.text) ? (
          <RenderContactInfo data={scannedData.text} />
        ) : (
          <Text style={[styles.text, { color: textOne }]}>
            {scannedData?.text || ""}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
  },
  qrView: {
    height: SCREEN_WIDTH - 20,
    // width: SCREEN_WIDTH - 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  headerEditIconStyle: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  headerQRIconStyle: {
    paddingVertical: 12,
    paddingRight: 25,
    paddingLeft: 10,
  },
});
