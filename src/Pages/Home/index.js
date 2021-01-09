import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  View,
  Clipboard,
  Linking,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useDispatch, useSelector } from "react-redux";
import {
  removeScannedData,
  getScannedData,
} from "../../Redux/ScannedData/ActionCreator";
import { logoutUser } from "../../Redux/Auth/ActionCreator";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { toast, validateUrl } from "../../Shared/Functions";
import CustomActivityIndicator from "../../Shared/Components/CustomActivityIndicator";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { primaryColor, SCREEN_WIDTH } from "../../Shared/Styles";
import TitleDilogue from "./Components/TitleDilogue";

export default function Home(props) {
  // Global state
  const scannedData = useSelector((state) => state.scannedData);
  // Local state
  const [hasPermission, setHasPermission] = useState(false);
  const [showTitleDilogue, setShowTitleDilogue] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  // Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();

  const dispach = useDispatch();

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ marginHorizontal: 20 }}
            onPress={() => {
              openLogoutActionSheet();
            }}
          >
            <Feather name="log-out" size={22} color="black" />
          </TouchableOpacity>
        );
      },
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    setHeaderOptions();
    dispach(getScannedData());
  }, []);

  const scnaCode = () => {
    if (hasPermission) {
      props.navigation.navigate("Scanner");
    } else {
      alert("No permission to camera.");
    }
  };

  const openActionSheet = (data, index, titleText) => {
    const options = ["Delete", "Copy", titleText, "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 3;

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
        if (buttonIndex == 2) {
          setSelectedData({ ...data });
          setShowTitleDilogue(true);
          return;
        }
      }
    );
  };

  const openLogoutActionSheet = () => {
    const options = ["Logout", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;
    const message = "Do you want to logout?";
    const messageTextStyle = { fontSize: 17, fontWeight: "700" };
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        message,
        messageTextStyle,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          dispach(logoutUser());
          return;
        }
      }
    );
  };

  const copyToClipboard = (data) => {
    Clipboard.setString(data.scannedData.data);
    toast("Copied to clipboard.");
  };

  const openUrl = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      {scannedData.isLoading ? <CustomActivityIndicator /> : null}
      <FlatList
        data={scannedData.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const text = item.scannedData.data;
          const isUrl = validateUrl(text);
          return (
            <View style={styles.scannedData}>
              <View style={{ flex: 16 }}>
                {item.title ? (
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "700",
                      color: "#666",
                      marginVertical: 5,
                    }}
                  >
                    {item.title}
                  </Text>
                ) : null}
                {item?.scannedData?.data ? (
                  <Text
                    onPress={() => (isUrl ? openUrl(text) : null)}
                    numberOfLines={2}
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: isUrl ? primaryColor : "#666",
                      marginVertical: 5,
                    }}
                  >
                    {text}
                  </Text>
                ) : null}
                {item?.scannedData?.type ? (
                  <Text
                    style={{ color: "#888" }}
                  >{`Type: ${item.scannedData.type}`}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                  openActionSheet(
                    item,
                    index,
                    item.title ? "Edit title" : "Add title"
                  )
                }
              >
                <Feather name="more-vertical" color={"#444"} size={20} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[styles.button, { flex: 1 }]}
          onPress={() => props.navigation.navigate("QrGenerator")}
        >
          <FontAwesome name="qrcode" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { flex: 6, marginRight: 20 }]}
          onPress={scnaCode}
        >
          <Text style={{ fontSize: 17, fontWeight: "700", color: "#fff" }}>
            Scan code
          </Text>
        </TouchableOpacity>
      </View>
      <TitleDilogue
        isVisible={showTitleDilogue}
        closeDilogue={() => {
          setShowTitleDilogue(false);
          setSelectedData(null);
        }}
        selectedData={selectedData}
      />
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
    marginLeft: 20,
  },
  scannedData: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // height: 80,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
});
