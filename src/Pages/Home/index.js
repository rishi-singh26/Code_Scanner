import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  View,
  Linking,
  RefreshControl,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useDispatch, useSelector } from "react-redux";
import {
  addScannedData,
  getScannedData,
  removeScannedData,
  startLoading,
  editScannedData,
} from "../../Redux/ScannedData/ActionCreator";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  copyToClipboard,
  decryptText,
  encryptText,
  isContactInfo,
  isContactsApiAvailable,
  localAuth,
  pickImage,
  searchScannedDataTitle,
  shareScannedDataPdf,
  shareThings,
  validateEmail,
  validateUrl,
  validateWaLinkForINNum,
} from "../../Shared/Functions";
import {
  Feather,
  AntDesign,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { SCREEN_WIDTH } from "../../Shared/Styles";
import Header from "../../Shared/Components/Header";
import { FAB } from "react-native-paper";
import CollapsibleSearchBar from "../../Shared/Components/CollapsibleSearchBar";
import { auth } from "../../Constants/Api";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import { show3BtnAlert, showAlert } from "../../Redux/Alert/ActionCreator";
import LockNoteDilogue from "./Components/LockNoteDilogue";
import UnlockNoteDilogue from "./Components/UnlockNoteDilogue";
import ListEmpty from "./Components/ListEmpty";
import AppLockDiloge from "./Components/AppLockDiloge";

export default function Home(props) {
  // Global state
  const scannedData = useSelector((state) => state.scannedData);
  const theme = useSelector((state) => state.theme);
  const useAppLock = useSelector((state) => state.useAppLock);
  const usePassPageLock = useSelector((state) => state.usePassPageLock);
  const {
    primaryColor,
    backTwo,
    backThree,
    textOne,
    textTwo,
    primaryErrColor,
    backOne,
  } = theme.colors;
  // Local state
  const [hasPermission, setHasPermission] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [dataList, setDataList] = useState([]);
  const [notePass, setNotePass] = useState("");
  const [showLockNoteDilogue, setShowLockNoteDilogue] = useState(false);
  const [showUnlockNoteDilogue, setShowUnlockNoteDilogue] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [noteOpenerTitle, setNoteOpenerTitle] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [passInpHotBtnTxt, setPassInpHotBtnTxt] = useState("");
  const [showLocAuthErrBox, setShowLocAuthErrBox] = useState(false);
  // Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();

  // console.log("Here is user data\n", auth.currentUser);

  const dispatch = useDispatch();

  useEffect(() => {
    getCamPermission();
    checkLocalAuth();
  }, []);

  const checkLocalAuth = async () => {
    if (useAppLock) {
      const authenticated = await localAuth();
      if (authenticated) {
        setShowLocAuthErrBox(false);
        dispatch(getScannedData());
      } else {
        setShowLocAuthErrBox(true);
      }
    } else {
      setShowLocAuthErrBox(false);
      dispatch(getScannedData());
    }
  };

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

  const lockedNoteActions = (data) => {
    const options = ["Unlock note", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;
    const containerStyle = { backgroundColor: backTwo };
    const textStyle = { color: textOne };
    const icons = [
      <Feather name={"unlock"} size={20} color={primaryErrColor} />,
      <Feather name={"x"} size={20} color={textOne} />,
    ];
    const message = data?.title || "";
    const messageTextStyle = {
      fontSize: 17,
      fontWeight: "700",
      color: textOne,
    };

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
        containerStyle,
        textStyle,
        message,
        messageTextStyle,
      },
      async (buttonIndex) => {
        if (buttonIndex == 0) {
          setSelectedData(data);
          if (data.isLockaed) {
            setNoteOpenerTitle("Unlock note");
            setPassInpHotBtnTxt("Unlock");
            setIsUnlocking(true);
            setShowUnlockNoteDilogue(true);
            return;
          } else {
            setShowLockNoteDilogue(true);
            return;
          }
        }
      }
    );
  };

  const openUnlockedNoteActions = (data, index) => {
    const options = [
      "Delete",
      "Lock note",
      "Copy",
      "Edit",
      "Share as pdf",
      "Cancel",
    ];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 5;
    const containerStyle = { backgroundColor: backTwo };
    const textStyle = { color: textOne };
    const icons = [
      <Feather name={"trash"} size={20} color={primaryErrColor} />,
      <Feather name={"lock"} size={20} color={textOne} />,
      <Feather name={"copy"} size={20} color={textOne} />,
      <Feather name={"edit"} size={20} color={textOne} />,
      <Feather name={"share"} size={20} color={textOne} />,
      <Feather name={"x"} size={20} color={textOne} />,
    ];
    const message = data?.title || "";
    const messageTextStyle = {
      fontSize: 17,
      fontWeight: "700",
      color: textOne,
    };

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
        containerStyle,
        textStyle,
        message,
        messageTextStyle,
      },
      async (buttonIndex) => {
        if (buttonIndex == 0) {
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
          setSelectedData(data);
          setShowLockNoteDilogue(true);
          return;
        }
        if (buttonIndex == 2) {
          copyToClipboard(data.scannedData.data);
          dispatch(showSnack("Copied to clipboard"));
          return;
        }
        if (buttonIndex == 3) {
          props.navigation.navigate("Editor", {
            title: data?.title || "",
            data: data?.scannedData?.data || "",
            id: data?._id,
            isEditing: true,
          });
          return;
        }
        if (buttonIndex == 4) {
          const pdfuri = await shareScannedDataPdf(
            `<h1>${data.title}</h1><h4>${data.scannedData.data}</h4>`
          );
          pdfuri.status ? shareThings(pdfuri.pdfUri) : null;
          return;
        }
      }
    );
  };

  const navigateToPass = async () => {
    if (usePassPageLock) {
      const isAuthneticated = await localAuth();
      isAuthneticated
        ? props.navigation.navigate("Passwords")
        : dispatch(showSnack("Authentication required!"));
    } else {
      props.navigation.navigate("Passwords");
    }
  };

  const openScannerOptionsSheet = () => {
    // TODO: Add image encryption
    // TODO: Add pdf encryption
    // TODO: Work on logger
    // TODO: work on image viewer
    const options = [
      "Open Camera",
      "Select Image",
      "Add note",
      "Create QR code",
      "Images",
      "PDFs",
      "Share contacts",
      "Passwords",
      "Logger",
      "Cancel",
    ];
    const destructiveButtonIndex = 9;
    const cancelButtonIndex = 9;
    const containerStyle = { backgroundColor: backTwo };
    const textStyle = { color: textOne };
    const icons = [
      <Feather name={"camera"} size={19} color={textOne} />,
      <Feather name={"image"} size={20} color={textOne} />,
      <Feather name={"file-text"} size={20} color={textOne} />,
      <Fontisto name="qrcode" size={16} color={textOne} />,
      <Feather name={"image"} size={20} color={textOne} />,
      <AntDesign name={"pdffile1"} size={20} color={textOne} />,
      <Feather name={"users"} size={20} color={textOne} />,
      <Feather name={"key"} size={20} color={textOne} />,
      <MaterialCommunityIcons name={"counter"} size={20} color={textOne} />,
      <Feather name={"x"} size={20} color={"#d10000"} />,
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
        if (buttonIndex === 0) {
          scnaCode();
          return;
        }
        if (buttonIndex === 1) {
          scanFromImage();
          return;
        }
        if (buttonIndex === 2) {
          props.navigation.navigate("Editor", { isEditing: false });
          return;
        }
        if (buttonIndex === 3) {
          props.navigation.navigate("QrGenerator");
          return;
        }
        if (buttonIndex === 4) {
          props.navigation.navigate("Images");
          return;
        }
        if (buttonIndex === 5) {
          props.navigation.navigate("Pdfs");
          return;
        }
        if (buttonIndex === 6) {
          isContactsApiAvailable()
            ? props.navigation.navigate("ContactSharing")
            : dispatch(showSnack("Oops, can't share contacts on this device!"));
          return;
        }
        if (buttonIndex === 7) {
          navigateToPass();
          return;
        }
        if (buttonIndex === 8) {
          props.navigation.navigate("Loggers");
          return;
        }
      }
    );
  };

  const searchData = (searchKey) => {
    setSearchKey(searchKey);
    if (searchKey.length > 0) {
      const result = searchScannedDataTitle(scannedData.data, searchKey);
      result.length > 0 ? setDataList(result) : null;
    } else {
      setDataList([]);
    }
  };

  const scanFromImage = async () => {
    try {
      const { status, result } = await pickImage();
      // console.log("Data from image", { status, result });
      if (status && !result.cancelled) {
        const data = await BarCodeScanner.scanFromURLAsync(result.uri);
        // console.log("Data from code", data);
        if (data.length === 0) {
          dispatch(showSnack("No code detected"));
          return;
        }
        const firstScannedCode = data[0];
        // console.log("Here is the scanned data", firstScannedCode);
        checkForURLs(firstScannedCode.type, firstScannedCode.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkForURLs = (type, data) => {
    // console.log("Checking for url", { type, data });
    if (validateEmail(data)) {
      // console.log("it is an email");
      dispatch(
        show3BtnAlert(
          "Email detected",
          `Do you want to send email to ${data}?`,
          () => uploadScannedData(type, data),
          "Save",
          () => Linking.openURL(`mailto:${data}`),
          "Send email"
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
          "Open chat"
        )
      );
    } else {
      // console.log("Uploading data");
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

  const handleLockNote = async () => {
    const text = selectedData.scannedData.data;
    const { status, data } = await encryptText(text, notePass);
    if (status) {
      dispatch(
        editScannedData(
          { scannedData: { data: data }, isLockaed: true },
          selectedData._id,
          "Locked successfully"
        )
      );
      resetLockerState();
      return;
    }
    resetLockerState();
    dispatch(showSnack("Could not lock data, please try again"));
  };

  const handleUnlockNote = async () => {
    const text = selectedData.scannedData.data;
    const { status, data } = await decryptText(text, notePass);
    if (status) {
      data.length === 0
        ? dispatch(showSnack("Incorrect password, please try again"))
        : dispatch(
            editScannedData(
              { scannedData: { data: data }, isLockaed: false },
              selectedData._id,
              "Unlocked successfully"
            )
          );
      resetLockerState();
      return;
    }
    resetLockerState();
    dispatch(
      showSnack("Could not unlock data, check your password and try again")
    );
  };

  const openNote = (data) => {
    setSelectedData(data);
    setNoteOpenerTitle("Open note");
    setPassInpHotBtnTxt("Open");
    setIsUnlocking(false);
    setShowUnlockNoteDilogue(true);
  };

  const handelOpenNote = async () => {
    const text = selectedData.scannedData.data;
    const { status, data } = await decryptText(text, notePass);
    if (status) {
      // console.log(`Here is decrypted data ${data} and its length is ${data.length}`);
      data.length === 0
        ? dispatch(showSnack("Incorrect password, please try again"))
        : props.navigation.navigate("ScannedDataDetail", {
            scannedData: {
              text: data,
              title: selectedData?.title || null,
              id: selectedData._id,
              isLockaed: selectedData.isLockaed,
              notePass: notePass,
            },
          });
      resetLockerState();
      return;
    }
    resetLockerState();
    dispatch(
      showSnack("Could not open data, check your password and try again")
    );
  };

  const resetLockerState = () => {
    setShowUnlockNoteDilogue(false);
    setNotePass("");
    setShowLockNoteDilogue(false);
    setSelectedData(null);
  };

  const handleNodeDecryption = () => {
    // console.log({ isUnlocking });
    if (isUnlocking) {
      handleUnlockNote();
      // return;
    } else {
      handelOpenNote();
    }
  };

  const closeSearch = () => {
    setDataList([]);
    setSearchKey("");
  };
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backTwo }]}>
      {/* Header */}
      <Header
        title={"Scanner"}
        iconRightName={"settings"}
        onRightIconPress={() => props.navigation.navigate("Settings")}
      />
      {/* Search bar */}
      {scannedData.data.length > 0 ? (
        <CollapsibleSearchBar
          onTextChange={(text) => searchData(text)}
          searchKey={searchKey}
          onXPress={closeSearch}
        />
      ) : null}
      {/* List empty */}
      {scannedData.data.length === 0 && !scannedData.isLoading && (
        <ListEmpty
          editorFunc={() =>
            props.navigation.navigate("Editor", { isEditing: false })
          }
          qrFunc={() => props.navigation.navigate("QrGenerator")}
          passwordsFunc={navigateToPass}
          scanImgFunc={scanFromImage}
          scannerFunc={scnaCode}
        />
      )}
      {/* data list */}
      <FlatList
        contentContainerStyle={{ paddingBottom: 80 }}
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
        data={dataList.length > 0 ? dataList : scannedData.data}
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
                  borderBottomWidth: 0,
                  borderColor: backTwo,
                  backgroundColor: backOne,
                },
              ]}
            >
              <View style={styles.scannedData}>
                <TouchableOpacity
                  onPress={() => {
                    // console.log(item);
                    item.isLockaed
                      ? openNote(item)
                      : props.navigation.navigate("ScannedDataDetail", {
                          scannedData: {
                            text,
                            title: item?.title || null,
                            id: item._id,
                            isLockaed: false,
                          },
                        });
                  }}
                  onLongPress={() =>
                    item.isLockaed
                      ? lockedNoteActions(item)
                      : openUnlockedNoteActions(item, index)
                  }
                  style={{ flex: 5 }}
                >
                  {item.title ? (
                    <Text style={[styles.scannedDataTitle, { color: textOne }]}>
                      {item.title}
                    </Text>
                  ) : null}
                  {item?.scannedData?.data ? (
                    item.isLockaed ? (
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.scannedDataText,
                          { color: primaryErrColor, fontSize: 13 },
                        ]}
                      >
                        Locked
                      </Text>
                    ) : isContact ? (
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
                          style={[styles.scannedDataText, { color: textTwo }]}
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
                  onPress={() =>
                    item.isLockaed
                      ? lockedNoteActions(item)
                      : openUnlockedNoteActions(item, index)
                  }
                >
                  <Feather name="more-vertical" color={textOne} size={20} />
                </TouchableOpacity>
              </View>
              {isUrl ? (
                <TouchableOpacity
                  onPress={() => (isUrl ? Linking.openURL(text) : null)}
                  style={[styles.openURLView, { borderColor: backThree }]}
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
      {/* Lock note dilogue */}
      <LockNoteDilogue
        password={notePass}
        setPassword={setNotePass}
        onCancelPress={() => {
          setNotePass("");
          setShowLockNoteDilogue(false);
        }}
        onOkPress={handleLockNote}
        visible={showLockNoteDilogue}
      />
      {/* Unlock note dilogue */}
      <UnlockNoteDilogue
        title={noteOpenerTitle}
        hotBtnText={passInpHotBtnTxt}
        password={notePass}
        setPassword={setNotePass}
        onCancelPress={() => {
          setSelectedData(null);
          setNoteOpenerTitle("");
          setIsUnlocking(false);
          setNotePass("");
          setShowUnlockNoteDilogue(false);
        }}
        onOkPress={handleNodeDecryption}
        visible={showUnlockNoteDilogue}
      />
      {/* Local auth error box */}
      <AppLockDiloge
        showAuthErrBox={showLocAuthErrBox}
        checkLocalAuth={checkLocalAuth}
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
