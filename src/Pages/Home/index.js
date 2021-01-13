import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  View,
  Linking,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useDispatch, useSelector } from "react-redux";
import { removeScannedData } from "../../Redux/ScannedData/ActionCreator";
import { logoutUser } from "../../Redux/Auth/ActionCreator";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { copyToClipboard, validateUrl } from "../../Shared/Functions";
import CustomActivityIndicator from "../../Shared/Components/CustomActivityIndicator";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { primaryColor, SCREEN_WIDTH } from "../../Shared/Styles";
import TitleDilogue from "./Components/TitleDilogue";
import Accordion from "../../Components/Accordian/Accordian";

export default function Home(props) {
  // Global state
  const scannedData = useSelector((state) => state.scannedData);
  // Local state
  const [hasPermission, setHasPermission] = useState(false);
  const [showTitleDilogue, setShowTitleDilogue] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  // Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();

  const dispatch = useDispatch();

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row" }}>
            {/* <TouchableOpacity
              style={{ paddingHorizontal: 15, paddingVertical: 12 }}
              onPress={() => {
                showSearchBar.length > 0
                  ? setShowSearchBar([])
                  : setShowSearchBar([0]);
              }}
            >
              <Feather name="search" size={22} color="black" />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={{
                paddingLeft: 15,
                paddingVertical: 12,
                paddingRight: 20,
              }}
              onPress={() => {
                openLogoutActionSheet();
              }}
            >
              <Feather name="log-out" size={22} color="black" />
            </TouchableOpacity>
          </View>
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
  }, [showSearchBar]);

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
          dispatch(removeScannedData(index, data._id));
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
          dispatch(logoutUser());
          return;
        }
      }
    );
  };

  const _renderContent = () => {
    return (
      <View>
        <TextInput
          value={searchKey}
          onChangeText={(text) => setSearchKey(text)}
          placeholder={"Search here"}
          style={{
            backgroundColor: "#f2f2f2",
            paddingVertical: 10,
            paddingHorizontal: 20,
            fontSize: 17,
          }}
        />
      </View>
    );
  };

  const _updateSections = (activeSections) => {
    console.log(activeSections);
    setShowSearchBar(activeSections);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Accordion
        sections={[1]}
        activeSections={showSearchBar}
        renderHeader={() => null}
        renderContent={() => _renderContent()}
        onChange={_updateSections}
      />
      {scannedData.isLoading ? <CustomActivityIndicator /> : null}
      <FlatList
        data={scannedData.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const text = item.scannedData.data;
          console.log("here is data", text);
          const isUrl = validateUrl(text);
          return (
            <View style={styles.scannedDataContainer}>
              <View style={styles.scannedData}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("ScannedDataDetail", {
                      scannedData: {
                        text,
                        isUrl,
                        title: item?.title || null,
                        id: item._id,
                      },
                    });
                  }}
                  style={{ flex: 5 }}
                >
                  {item.title ? (
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "700",
                        color: "#444",
                        marginVertical: 5,
                      }}
                    >
                      {item.title}
                    </Text>
                  ) : null}
                  {item?.scannedData?.data ? (
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: "#888",
                        marginVertical: 5,
                      }}
                    >
                      {text}
                    </Text>
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, paddingVertical: 10 }}
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
              {isUrl ? (
                <View style={styles.openURLView}>
                  <Text
                    style={{ color: primaryColor, fontWeight: "700" }}
                    onPress={() => (isUrl ? Linking.openURL(text) : null)}
                  >
                    Open URL
                  </Text>
                </View>
              ) : null}
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
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  scannedDataContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginVertical: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: SCREEN_WIDTH,
  },
  openURLView: {
    alignSelf: "flex-end",
    marginHorizontal: 5,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    // backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#efefef",
  },
});
