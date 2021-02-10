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
import { SCREEN_WIDTH } from "../../Shared/Styles";
import Header from "../../Shared/Components/Header";
import { FAB } from "react-native-paper";
import CollapsibleSearchBar from "../../Shared/Components/CollapsibleSearchBar";
import { auth } from "../../Constants/Api";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import { changeToDark, changeToLight } from "../../Redux/Theme/ActionCreator";
import { showAlert } from "../../Redux/Alert/ActionCreator";

export default function Home(props) {
  // Global state
  const scannedData = useSelector((state) => state.scannedData);
  const theme = useSelector((state) => state.theme);

  const {
    primaryColor,
    backOne,
    backTwo,
    textOne,
    textTwo,
    textThree,
  } = theme.colors;
  // Local state
  const [hasPermission, setHasPermission] = useState(false);
  const [searchBarCollapsed, setSearchBarCollapsed] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [dataList, setDataList] = useState(scannedData.data);
  // Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();

  // console.log("Here is user data\n", auth.currentUser);

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

  const openActionSheet = (data, index) => {
    const options = ["Delete", "Copy", "Edit", "Share as pdf", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 4;
    const containerStyle = { backgroundColor: backTwo };
    const textStyle = { color: textOne };
    const icons = [
      <Feather name={"trash"} size={20} color={textOne} />,
      <Feather name={"copy"} size={20} color={textOne} />,
      <Feather name={"edit"} size={20} color={textOne} />,
      <Feather name={"share"} size={20} color={textOne} />,
      <Feather name={"x"} size={20} color={textOne} />,
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
        containerStyle,
        textStyle,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          // console.log({ index, id: data._id });
          dispatch(
            showAlert(
              "Do you want to delete this text?",
              "It can not be recovered later!",
              () => {
                dispatch(removeScannedData(index, data._id));
              }
            )
          );
          return;
        }
        if (buttonIndex == 1) {
          copyToClipboard(data);
          dispatch(showSnack("Copied to clipboard"));
          return;
        }
        if (buttonIndex == 2) {
          props.navigation.navigate("Editor", {
            title: data?.title || "",
            data: data?.scannedData?.data || "",
            id: data?._id,
            isEditing: true,
          });
          return;
        }
        if (buttonIndex == 3) {
          dispatch(showAlert("No implemented yet!", "Wait for it"));
          return;
        }
      }
    );
  };

  const openScannerOptionsSheet = () => {
    const options = ["Pick Image", "Open Camera", "Add note", "Cancel"];
    const destructiveButtonIndex = 3;
    const cancelButtonIndex = 3;
    const containerStyle = { backgroundColor: backTwo };
    const textStyle = { color: textOne };
    const icons = [
      <Feather name={"image"} size={20} color={textOne} />,
      <Feather name={"camera"} size={20} color={textOne} />,
      <Feather name={"file-text"} size={20} color={textOne} />,
      <Feather name={"x"} size={20} color={textOne} />,
    ];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
        containerStyle,
        textStyle,
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
        if (buttonIndex == 2) {
          props.navigation.navigate("Editor", { isEditing: false });
          return;
        }
      }
    );
  };

  const settingsActionSheet = () => {
    const themeToggleBtnTxt = theme.mode
      ? "Enable dark mode"
      : "Disable dark mode";
    const options = [themeToggleBtnTxt, "Logout", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;
    const containerStyle = { backgroundColor: backTwo };
    const textStyle = { color: textOne };
    const icons = [
      <Feather
        name={theme.mode ? "sunset" : "sunrise"}
        size={20}
        color={textOne}
      />,
      <Feather name={"log-out"} size={20} color={textOne} />,
      <Feather name={"x"} size={20} color={textOne} />,
    ];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
        containerStyle,
        textStyle,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          theme.mode ? dispatch(changeToDark()) : dispatch(changeToLight());
          return;
        }
        if (buttonIndex == 1) {
          dispatch(
            showAlert("Do you want to log-out?", "", () => {
              dispatch(logoutUser());
              dispatch(removeDataOnLogout());
            })
          );
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
        } else dispatch(showAlert("No code detected", "Try again"));
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
    <SafeAreaView style={[styles.container, { backgroundColor: backTwo }]}>
      {/* Header */}
      <Header
        title={"Scanner"}
        iconRightName={"settings"}
        onRightIconPress={() => {
          settingsActionSheet();
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
            progressBackgroundColor={backTwo}
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
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderBottomWidth: index === finalDataList.length - 1 ? 2 : 0,
                  borderColor: backTwo,
                  backgroundColor: backOne,
                },
              ]}
            >
              <View style={styles.scannedData}>
                <TouchableOpacity
                  onPress={() => {
                    // console.log(item);
                    props.navigation.navigate("ScannedDataDetail", {
                      scannedData: {
                        text,
                        isUrl,
                        title: item?.title || null,
                        id: item._id,
                      },
                    });
                  }}
                  onLongPress={() => openActionSheet(item, index)}
                  style={{ flex: 5 }}
                >
                  {item.title ? (
                    <Text style={[styles.scannedDataTitle, { color: textOne }]}>
                      {item.title}
                    </Text>
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
                        <Text
                          style={[styles.scannedDataText, { color: textThree }]}
                        >
                          Contact Card
                        </Text>
                      </View>
                    ) : (
                      <Text
                        numberOfLines={2}
                        style={[styles.scannedDataText, { color: textTwo }]}
                      >
                        {text}
                      </Text>
                    )
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, paddingVertical: 10 }}
                  onPress={() => openActionSheet(item, index)}
                >
                  <Feather name="more-vertical" color={textOne} size={20} />
                </TouchableOpacity>
              </View>
              {isUrl ? (
                <TouchableOpacity
                  onPress={() => (isUrl ? Linking.openURL(text) : null)}
                  style={[styles.openURLView, { borderColor: backTwo }]}
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
        style={[styles.fab, { backgroundColor: primaryColor }]}
        icon="qrcode-scan"
        onPress={() => {
          openScannerOptionsSheet();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  scannedDataTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginVertical: 5,
  },
  scannedDataText: {
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 5,
  },
});
