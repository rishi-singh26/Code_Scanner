import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  View,
  Linking,
  Alert,
  RefreshControl,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useDispatch, useSelector } from "react-redux";
import {
  addScannedData,
  getScannedData,
  removeDataOnLogout,
  removeScannedData,
  startLoading,
} from "../../Redux/ScannedData/ActionCreator";
import { logoutUser } from "../../Redux/Auth/ActionCreator";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  copyToClipboard,
  isContactInfo,
  pickImage,
  searchScannedDataTitle,
  validateEmail,
  validateUrl,
  validateWaLinkForINNum,
} from "../../Shared/Functions";
import { Feather, AntDesign } from "@expo/vector-icons";
import { primaryColor, SCREEN_WIDTH } from "../../Shared/Styles";
import TitleDilogue from "./Components/TitleDilogue";
import Header from "../../Shared/Components/Header";
import { FAB } from "react-native-paper";
import CollapsibleSearchBar from "../../Shared/Components/CollapsibleSearchBar";
import { auth } from "../../Constants/Api";

export default function Home(props) {
  // Global state
  const scannedData = useSelector((state) => state.scannedData);
  // Local state
  const [hasPermission, setHasPermission] = useState(false);
  const [showTitleDilogue, setShowTitleDilogue] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [searchBarCollapsed, setSearchBarCollapsed] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [dataList, setDataList] = useState(scannedData.data);
  // Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();

  console.log("Here is user data\n", auth.currentUser);

  const dispatch = useDispatch();

  useEffect(() => {
    getCamPermission();
    dispatch(getScannedData());
  }, []);

  const getCamPermission = async (navigationFunc = () => {}) => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
    status === "granted" ? navigationFunc() : null;
  };

  const scnaCode = () => {
    if (hasPermission) {
      props.navigation.navigate("Scanner");
    } else {
      getCamPermission(() => props.navigation.navigate("Scanner"));
      // alert("No permission to camera.");
    }
  };

  const openActionSheet = (data, index, titleText) => {
    const options = ["Delete", "Copy", titleText, "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 3;
    const icons = [
      <Feather name={"trash"} size={20} color={"#000"} />,
      <Feather name={"copy"} size={20} color={"#000"} />,
      <Feather name={"edit"} size={20} color={"#000"} />,
      <Feather name={"x"} size={20} color={"#000"} />,
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          // console.log({ index, id: data._id });
          Alert.alert(
            "Do you want to delete this text?",
            "It can not be recovered later!",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
              },
              {
                text: `Delete`,
                onPress: () => {
                  dispatch(removeScannedData(index, data._id));
                },
                style: "default",
              },
            ]
          );
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

  const openScannerOptionsSheet = () => {
    const options = ["Pick Image", "Open Camera", "Cancel"];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 2;
    // const message = "Do you want to logout?";
    // const messageTextStyle = { fontSize: 17, fontWeight: "700" };
    // const icons = ["camera", "image"];
    const icons = [
      <Feather name={"image"} size={20} color={"#000"} />,
      <Feather name={"camera"} size={20} color={"#000"} />,
      <Feather name={"x"} size={20} color={"#000"} />,
    ];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
        // message,
        // messageTextStyle,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          scanFromImage();
          return;
        }
        if (buttonIndex == 1) {
          scnaCode();
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
    const icons = [
      <Feather name={"log-out"} size={20} color={"#000"} />,
      <Feather name={"x"} size={20} color={"#000"} />,
    ];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        message,
        messageTextStyle,
        icons,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          dispatch(logoutUser());
          dispatch(removeDataOnLogout());
          return;
        }
      }
    );
  };

  const searchData = (searchKey) => {
    setSearchKey(searchKey);
    if (searchKey.length > 0) {
      const result = searchScannedDataTitle(scannedData.data, searchKey);
      setDataList(result);
    } else {
      setDataList(scannedData.data);
    }
  };

  const closeSearchBar = () => {
    setSearchKey("");
    setDataList(scannedData.data);
    setSearchBarCollapsed(true);
  };

  const scanFromImage = async () => {
    try {
      const imageData = await pickImage();
      // console.log("Data from image", imageData);
      if (!imageData.cancelled) {
        const data = await BarCodeScanner.scanFromURLAsync(imageData.uri);
        // console.log("Data from code", data);
        if (data.length > 0) {
          const firstScannedCode = data[0];
          console.log("Here is the scanned data", firstScannedCode);
          checkForURLs(firstScannedCode.type, firstScannedCode.data);
        } else alert("No code detected. Select a picture with good resolution");
      }
    } catch (error) {
      console.log(error.message);
    }
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
            onPress: () => {},
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
            },
            style: "default",
          },
        ],
        { cancelable: false }
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
  };

  const finalDataList = searchBarCollapsed ? scannedData.data : dataList;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title={"Scanner"}
        iconRightName={"settings"}
        onRightIconPress={() => {
          openLogoutActionSheet();
        }}
        showSearchIcon
        onSearchIconPress={() => {
          searchBarCollapsed ? setSearchBarCollapsed(false) : closeSearchBar();
        }}
      />
      {/* Search bar */}
      <CollapsibleSearchBar
        collapsed={searchBarCollapsed}
        onTextChange={(text) => searchData(text)}
        onXPress={() => {
          closeSearchBar();
        }}
        searchKey={searchKey}
      />
      {/* data liat */}
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={scannedData.isLoading}
            onRefresh={() => {
              dispatch(startLoading());
              dispatch(getScannedData());
            }}
            colors={[primaryColor]}
          />
        }
        data={finalDataList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const text = item.scannedData.data;
          // console.log("here is data", text);
          const isUrl = validateUrl(text);
          const isContact = isContactInfo(text);
          return (
            <View
              style={[
                styles.scannedDataContainer,
                {
                  marginTop: index === 0 ? 0 : 3,
                  marginBottom: index === finalDataList.length - 1 ? 2 : 0,
                },
              ]}
            >
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
                    <Text style={styles.scannedDataTitle}>{item.title}</Text>
                  ) : null}
                  {item?.scannedData?.data ? (
                    isContact ? (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <AntDesign
                          name="idcard"
                          size={28}
                          color={primaryColor}
                          style={{ marginRight: 15 }}
                        />
                        <Text style={styles.scannedDataText}>Contact Card</Text>
                      </View>
                    ) : (
                      <Text numberOfLines={2} style={styles.scannedDataText}>
                        {text}
                      </Text>
                    )
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
                <TouchableOpacity
                  onPress={() => (isUrl ? Linking.openURL(text) : null)}
                  style={styles.openURLView}
                >
                  <Text style={{ color: primaryColor, fontWeight: "700" }}>
                    Open URL
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          );
        }}
      />
      {/* FAB */}
      <FAB
        style={styles.fab}
        icon="qrcode-scan"
        onPress={() => {
          openScannerOptionsSheet();
        }}
      />
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
    borderWidth: 1,
    borderColor: "#efefef",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: primaryColor,
  },
  fab2: {
    position: "absolute",
    margin: 16,
    right: 70,
    bottom: 0,
    backgroundColor: primaryColor,
  },
  scannedDataTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#444",
    marginVertical: 5,
  },
  scannedDataText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#999",
    marginVertical: 5,
  },
});
