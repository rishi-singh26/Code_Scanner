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
  removeDataOnLogout,
  removeScannedData,
  startLoading,
  editScannedData,
} from "../../Redux/ScannedData/ActionCreator";
import { logoutUser } from "../../Redux/Auth/ActionCreator";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  addScannerPassPgName,
  copyToClipboard,
  decryptText,
  encryptText,
  isContactInfo,
  isContactsApiAvailable,
  pickImage,
  searchScannedDataTitle,
  shareScannedDataPdf,
  shareThings,
  validateEmail,
  validateUrl,
  validateWaLinkForINNum,
} from "../../Shared/Functions";
import { Feather, AntDesign, Fontisto, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "../../Shared/Styles";
import Header from "../../Shared/Components/Header";
import { FAB } from "react-native-paper";
import CollapsibleSearchBar from "../../Shared/Components/CollapsibleSearchBar";
import { auth, firestore } from "../../Constants/Api";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import { changeToDark, changeToLight } from "../../Redux/Theme/ActionCreator";
import { show3BtnAlert, showAlert } from "../../Redux/Alert/ActionCreator";
import LockNoteDilogue from "./Components/LockNoteDilogue";
import UnlockNoteDilogue from "./Components/UnlockNoteDilogue";
import CustomActivityIndicator from "../../Shared/Components/CustomActivityIndicator";

export default function Home(props) {
  // Global state
  const scannedData = useSelector((state) => state.scannedData);
  const theme = useSelector((state) => state.theme);
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
  const [searchBarCollapsed, setSearchBarCollapsed] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [dataList, setDataList] = useState(scannedData.data);
  const [notePass, setNotePass] = useState("");
  const [showLockNoteDilogue, setShowLockNoteDilogue] = useState(false);
  const [showUnlockNoteDilogue, setShowUnlockNoteDilogue] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [noteOpenerTitle, setNoteOpenerTitle] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isLodaingPassPgData, setIsLodaingPassPgData] = useState(false);
  const [passInpHotBtnTxt, setPassInpHotBtnTxt] = useState("");
  const [isOpeningPassowrds, setIsOpeningPassowrds] = useState(false);
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

  const lockedNoteActions = (data) => {
    const options = ["Unlock note", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;
    const containerStyle = { backgroundColor: backTwo };
    const textStyle = { color: textOne };
    const icons = [
      <Feather name={"unlock"} size={20} color={textOne} />,
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
      <Feather name={"trash"} size={20} color={textOne} />,
      <Feather name={"lock"} size={20} color={textOne} />,
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
            `<h3>${data.title}</h3><p>${data.scannedData.data}</p>`
          );
          pdfuri.status ? shareThings(pdfuri.pdfUri) : null;
          return;
        }
      }
    );
  };

  const openPassowrds = () => {
    setNoteOpenerTitle("Enter password");
    setPassInpHotBtnTxt("Show passwords");
    setIsOpeningPassowrds(true);
    setShowUnlockNoteDilogue(true);
  };

  const resetPasswordsOpenerState = () => {
    setNoteOpenerTitle("");
    setPassInpHotBtnTxt("");
    setIsOpeningPassowrds(false);
    setShowUnlockNoteDilogue(false);
    setIsLodaingPassPgData(false);
    setNotePass("");
  };

  const navigateToPassowrds = async (password) => {
    setIsLodaingPassPgData(true);
    setShowUnlockNoteDilogue(false);
    try {
      firestore
        .collection("scannerPassPgName")
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then(async (resp) => {
          if (resp.docs.length > 0) {
            resp.forEach(async (passPgData) => {
              const pageData = { ...passPgData.data(), _id: passPgData.id };
              // console.log(data);
              const { _id, pageName, userID } = pageData;
              const { status, data } = await decryptText(pageName, password);
              if (status) {
                data !== "Passwords"
                  ? dispatch(showSnack("Incorrect password, please try again"))
                  : props.navigation.navigate("Passwords", { data: password });
              }
              resetPasswordsOpenerState();
            });
          } else {
            console.log("Creatinfg pass pg name");
            await addScannerPassPgName(password, () => {
              dispatch(
                showSnack(
                  "You can now access your passwords with the same kay you provided now"
                )
              );
              props.navigation.navigate("Passwords", { data: password });
              resetPasswordsOpenerState();
            });
          }
        });
    } catch (error) {
      resetPasswordsOpenerState();
      console.log(
        "Error occured while getting password page name on HOME",
        error.message
      );
      dispatch(
        showSnack(
          "Error occured while opening passwords page, please try again!\nCheck your password"
        )
      );
    }
  };

  const openScannerOptionsSheet = () => {
    const options = [
      "Scan Image",
      "Open Camera",
      "Add note",
      "Create QR code",
      "Images",
      "PDFs",
      "Share contacts",
      "Passwords",
      "Fuel Log",
      "Cancel",
    ];
    const destructiveButtonIndex = 9;
    const cancelButtonIndex = 9;
    const containerStyle = { backgroundColor: backTwo };
    const textStyle = { color: textOne };
    const icons = [
      <Feather name={"image"} size={20} color={textOne} />,
      <Feather name={"camera"} size={20} color={textOne} />,
      <Feather name={"file-text"} size={20} color={textOne} />,
      <Fontisto name="qrcode" size={17} color={textOne} />,
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
          scanFromImage();
          return;
        }
        if (buttonIndex === 1) {
          scnaCode();
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
          openPassowrds();
          return;
        }
        if (buttonIndex === 8) {
          props.navigation.navigate("FuelLog")
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
      if (imageData.status && !imageData.result.cancelled) {
        const data = await BarCodeScanner.scanFromURLAsync(
          imageData.result.uri
        );
        // console.log("Data from code", data);
        if (data.length > 0) {
          const firstScannedCode = data[0];
          // console.log("Here is the scanned data", firstScannedCode);
          checkForURLs(firstScannedCode.type, firstScannedCode.data);
        } else dispatch(showSnack("No code detected"));
      }
    } catch (error) {
      console.log(error.message);
    }
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

  const finalDataList = searchBarCollapsed ? scannedData.data : dataList;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backTwo }]}>
      {isLodaingPassPgData ? <CustomActivityIndicator /> : null}
      {/* Header */}
      <Header
        title={"Scanner"}
        iconRightName={"settings"}
        onRightIconPress={() => {
          // props.navigation.navigate("Settings");
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
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 10,
                        }}
                      >
                        <Ionicons
                          name="lock-closed-outline"
                          color={primaryErrColor}
                          size={23}
                          style={{ paddingRight: 10 }}
                        />
                        <Text
                          numberOfLines={2}
                          style={[styles.scannedDataText, { color: textOne }]}
                        >
                          Note Locked
                        </Text>
                      </View>
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
          setIsOpeningPassowrds(false);
        }}
        onOkPress={() => {
          console.log({isOpeningPassowrds, isUnlocking});
          if(isUnlocking && !isOpeningPassowrds){
            handleUnlockNote();
            return;
          }
          if(!isUnlocking && isOpeningPassowrds){
            navigateToPassowrds(notePass);
            return;
          }
          else {
            handelOpenNote();
          }
          // isOpeningPassowrds
          //   ? navigateToPassowrds(notePass)
          //   : isUnlocking
          //   ? handleUnlockNote
          //   : handelOpenNote;
        }}
        showSubHead={isOpeningPassowrds}
        visible={showUnlockNoteDilogue}
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
