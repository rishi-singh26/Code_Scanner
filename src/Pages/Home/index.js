import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  View,
  Clipboard,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useDispatch, useSelector } from "react-redux";
import {
  removeScannedData,
  getScannedData,
} from "../../Redux/ScannedData/ActionCreator";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { toast } from "../../Shared/Functions";
import CustomActivityIndicator from "../../Shared/Components/CustomActivityIndicator";

export default function Home(props) {
  // Global state
  const scannedData = useSelector((state) => state.scannedData);
  console.log(scannedData.data);
  // Local state
  const [hasPermission, setHasPermission] = useState(false);
  // Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();

  const dispach = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    dispach(getScannedData());
  }, []);

  const scnaCode = () => {
    if (hasPermission) {
      props.navigation.navigate("Scanner");
    } else {
      alert("No permission to camera.");
    }
  };

  const openActionSheet = (data, index) => {
    const options = ["Delete", "Copy", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          console.log({ index, id: data._id });
          dispach(removeScannedData(index, data._id));
          return;
        }
        if (buttonIndex == 1) {
          copyToClipboard(data);
          return;
        }
      }
    );
  };

  const copyToClipboard = (data) => {
    Clipboard.setString(data.data.data);
    toast("Copied to clipboard.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {scannedData.isLoading ? <CustomActivityIndicator /> : null}
      <FlatList
        data={scannedData.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.scannedData}>
              <Text style={styles.listNumber}>{index + 1}</Text>
              <TouchableOpacity
                onPress={() => openActionSheet(item, index)}
                style={{ flex: 8 }}
              >
                {item.scannedData.data != "" ? (
                  <Text
                    numberOfLines={3}
                    style={{ fontSize: 15, fontWeight: "700" }}
                  >
                    {item.scannedData.data}
                  </Text>
                ) : null}
                {item.scannedData.type != "" ? (
                  <Text>{item.scannedData.type}</Text>
                ) : null}
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <TouchableOpacity style={styles.button} onPress={scnaCode}>
        <Text style={{ fontSize: 17, fontWeight: "700", color: "#fff" }}>
          Scan code
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#3071ff",
    alignItems: "center",
    margin: 20,
  },
  scannedData: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listNumber: {
    paddingLeft: 10,
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
  },
});
