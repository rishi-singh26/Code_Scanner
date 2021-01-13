import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useDispatch } from "react-redux";
import { addScannedData } from "../../Redux/ScannedData/ActionCreator";
import { auth } from "../../Constants/Api";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { validateEmail, validateWaLinkForINNum } from "../../Shared/Functions";

export default function Scanner(props) {
  const [scanned, setScanned] = useState(false);

  const dispatch = useDispatch();

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    checkForURLs(type, data);
  };

  const checkForURLs = (type, data) => {
    if (validateEmail(data)) {
      console.log("it is an email");
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
      console.log("it is a whatsapp link", data.split("/").pop());
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

  const pickImage = async () => {
    if (Platform.OS === "web") {
      alert("Device not supported.");
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      // console.log(result);
      if (!result.cancelled) {
        console.log(result.uri);
        const data = await BarCodeScanner.scanFromURLAsync(result.uri);
        // console.log("Data from code", data);
        if (data.length > 0) {
          const firstScannedCode = data[0];
          handleBarCodeScanned({
            type: firstScannedCode.type,
            data: firstScannedCode.data,
          });
        } else alert("No code detected. Select a picture with good resolution");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ marginHorizontal: 20 }}
            onPress={() => {
              pickImage();
            }}
          >
            <Feather name="image" size={23} color="black" />
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
