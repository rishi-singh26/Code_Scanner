import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useDispatch } from "react-redux";
import { addScannedData } from "../../Redux/ScannedData/ActionCreator";

export default function Scanner(props) {
  const [scanned, setScanned] = useState(false);

  const dispatch = useDispatch();

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    dispatch(
      addScannedData({
        scannedData: { type, data },
        creationDate: new Date(),
        isDeleted: false,
      })
    );
    props.navigation.goBack();
  };

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
