import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Linking,
  Alert,
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

export default function Scanner(props) {
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
      Alert.alert(
        `Email detected`,
        `Do you want to send email to ${data}?`,
        [
          {
            text: "Cancel",
            onPress: () => setScanned(false),
            style: "cancel",
          },
          {
            text: `Save`,
            onPress: () => uploadScannedData(type, data),
            style: "default",
          },
          {
            text: `Send email`,
            onPress: () => {
              Linking.openURL(`mailto:${data}`);
              props.navigation.goBack();
            },
            style: "default",
          },
        ],
        { cancelable: false }
      );
    } else if (validateWaLinkForINNum(data)) {
      // console.log("it is a whatsapp link", data.split("/").pop());
      Alert.alert(
        `Whatsapp chat link detected`,
        `Do you want to open chat with +${data.split("/").pop()}?`,
        [
          {
            text: "Cancel",
            onPress: () => setScanned(false),
            style: "cancel",
          },
          {
            text: `Save`,
            onPress: () => uploadScannedData(type, data),
            style: "default",
          },
          {
            text: `Open chat`,
            onPress: () => {
              Linking.openURL(`${data}`);
              props.navigation.goBack();
            },
            style: "default",
          },
        ],
        { cancelable: false }
      );
    } else {
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
      const imageData = await pickImage();
      // console.log("Data from image", imageData);
      if (imageData.status && !imageData.result.cancelled) {
        const data = await BarCodeScanner.scanFromURLAsync(
          imageData.result.uri
        );
        // console.log("Data from code", data);
        if (data.length > 0) {
          const firstScannedCode = data[0];
          // console.log(firstScannedCode);
          handleBarCodeScanned({
            type: firstScannedCode.type,
            data: firstScannedCode.data,
          });
        } else alert("No code detected. Select a picture with good resolution");
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
