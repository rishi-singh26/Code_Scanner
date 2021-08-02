import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useDispatch, useSelector } from "react-redux";
import { addScannedData } from "../../Redux/ScannedData/ActionCreator";
import { auth } from "../../Constants/Api";
import { Feather } from "@expo/vector-icons";
import {
  pickImage,
  validateEmail,
  validateWaLinkForINNum,
} from "../../Shared/Functions";
import { show3BtnAlert } from "../../Redux/Alert/ActionCreator";
import { showSnack } from "../../Redux/Snack/ActionCreator";

export default function ScannerCamera(props) {
  const [scanned, setScanned] = useState(false);

  const theme = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  const handleBarCodeScanned = ({ type, data }) => {
    // console.log({ type, data });
    setScanned(true);
    checkForURLs(type, data);
  };

  const checkForURLs = (type, data) => {
    if (validateEmail(data)) {
      // console.log("it is an email");
      dispatch(
        show3BtnAlert(
          "Email detected",
          `Do you want to send email to ${data}?`,
          () => uploadScannedData(type, data),
          "Save",
          () => Linking.openURL(`mailto:${data}`),
          "Send email",
          () => setScanned(false),
          "Cancel"
        )
      );
    } else if (validateWaLinkForINNum(data)) {
      // console.log("it is a whatsapp link", data.split("/").pop());
      dispatch(
        show3BtnAlert(
          "Whatsapp chat link detected",
          `Do you want to open chat with +${data.split("/").pop()}?`,
          () => uploadScannedData(type, data),
          "Save",
          () => Linking.openURL(`whatsapp://send?phone=${data}`),
          "Open chat",
          () => setScanned(false),
          "Cancel"
        )
      );
    } else {
      console.log("Uploading data");
      uploadScannedData(type, data);
    }
  };

  const uploadScannedData = (type, data) => {
    dispatch(
      addScannedData({
        scannedData: { type, data },
        creationDate: new Date(),
        isDeleted: false,
        userId: auth.currentUser.uid,
      })
    );
    props.navigation.goBack();
  };

  const scanFromImage = async () => {
    try {
      const { status, result } = await pickImage();
      // console.log("Data from image", imageData);
      if (status && !result.cancelled) {
        const data = await BarCodeScanner.scanFromURLAsync(result.uri);
        // console.log("Data from code", data);
        if (data.length > 0) {
          const firstScannedCode = data[0];
          // console.log(firstScannedCode);
          handleBarCodeScanned({
            type: firstScannedCode.type,
            data: firstScannedCode.data,
          });
        } else
          dispatch(
            showSnack("No code detected. Select a picture with good resolution")
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingVertical: 14, paddingHorizontal: 20 }}
            onPress={() => {
              scanFromImage();
            }}
          >
            <Feather name="image" size={20} color={theme.colors.textOne} />
          </TouchableOpacity>
        );
      },
    });
  };

  useEffect(() => {
    setHeaderOptions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  scannerBox: {
    width: Dimensions.get("window").width - 100,
    height: Dimensions.get("window").width - 100,
    borderRadius: 30,
    backgroundColor: "#0004",
  },
});
