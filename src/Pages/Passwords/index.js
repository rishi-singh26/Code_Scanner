import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Collapsible from "../../Components/Accordian/Collapsable";
import { auth, firestore } from "../../Constants/Api";
import { showAlert } from "../../Redux/Alert/ActionCreator";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import {
  copyToClipboard,
  decryptPasswords,
  decryptText,
  searchPasswords,
  sortArrayOfObjs,
} from "../../Shared/Functions";
import { FAB } from "react-native-paper";
import CollapsibleSearchBar from "../../Shared/Components/CollapsibleSearchBar";

export default function Passwords(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const [passwords, setPasswords] = useState([]);
  const [collapsArr, setCollapsArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isKeyBoxHidden, setIsKeyBoxHidden] = useState(true);
  const [passKey, setPassKey] = useState("");
  const [showingPassKey, setShowingPassKey] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const dispatch = useDispatch();

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={() => {
              setIsKeyBoxHidden(!isKeyBoxHidden);
              // props.navigation.navigate("ChangePassword");
            }}
            style={styles.headerQRIconStyle}
          >
            <Feather name={"key"} size={23} color={colors.textOne} />
          </TouchableOpacity>
        );
      },
    });
  };

  const getPasswords = () => {
    // console.log(auth.currentUser);
    if (!auth.currentUser) {
      dispatch(showSnack("Please logout and login again!!"));
      return;
    }
    setPasswords([]);
    setLoading(true);
    firestore
      .collection("passwords")
      .where("userId", "==", auth.currentUser.uid)
      .onSnapshot(
        (resp) => {
          let passowords = [];
          let nums = [];
          resp.forEach((pass) => {
            const data = pass.data();
            const _id = pass.id;
            passowords.push({ _id, ...data });
            nums.push(false);
          });
          const sortedPass = sortArrayOfObjs(passowords, "creationDate");
          setPasswords(sortedPass);
          setCollapsArr(nums);
          setLoading(false);
        },
        (err) => {
          setLoading(false);
          console.log("Error in getting all PASSWORDS\n", err.message);
        }
      );
  };

  const toggelCollpase = (index) => {
    const currentVal = collapsArr[index];
    const newArr = new Array(passwords.length).fill(false);
    newArr.splice(index, 1, !currentVal);
    setCollapsArr(newArr);
  };

  const handleCollapsePress = async (data, index) => {
    if (!collapsArr[index]) {
      decryptPass(data, passKey, index);
    } else {
      toggelCollpase(index);
    }
  };

  const decryptPass = async (data, decryptionKey, index) => {
    if (decryptionKey.length === 0) {
      dispatch(showSnack("Enter your pass key"));
      return;
    }
    const { status, data: decryptedPass } = await decryptPasswords(
      data.passwords,
      decryptionKey
    );
    if (status && decryptedPass[0].email.length > 0) {
      setDecryptedPassword(decryptedPass);
      toggelCollpase(index);
    } else {
      dispatch(showSnack("Could not decrypt password, check your pass key!"));
    }
  };

  const copy = async (data) => {
    const hasBeenCopied = await copyToClipboard(data);
    hasBeenCopied
      ? dispatch(showSnack("Copied"))
      : dispatch(showSnack("OOPS, could not copy userid, please try again"));
  };

  const deletePassword = async (password) => {
    try {
      if (auth.currentUser) {
        const { status, data } = await decryptText(
          password.passwords[0].email,
          passKey
        );
        if (status && data.length > 0) {
          await firestore
            .collection("passwords")
            .doc(password._id)
            .delete()
            .then(() => {
              dispatch(showSnack("Password deleted!"));
            });
        } else {
          dispatch(showSnack("Could not delte password, check your pass key!"));
        }
      }
    } catch (error) {
      dispatch(showSnack("Could not delte password, please try again"));
    }
  };

  const navigateToPassAddr = () => {
    if (passKey.length === 0) {
      dispatch(
        showAlert(
          "Alert",
          "Enter a passkey in the key box, this exact passkey will be used to encrypt and decrypt your passwords.\n\nDO NOT FORGET IT.\n\nYou can use different passkeys for different passwords but if you forget your passkey you will lose your password permanently because ones the passwords are encrypted they can only be decrypted by the passkey which was used to encrypt them."
        )
      );
      return;
    }
    props.navigation.navigate("AddPassword", { isEditing: false, passKey });
  };

  useEffect(() => {
    setHeaderOptions();
  }, [isKeyBoxHidden]);

  useEffect(() => {
    getPasswords();
  }, []);

  const searchPass = (searchKey) => {
    setSearchKey(searchKey);
    if (searchKey.length > 0) {
      const result = searchPasswords(passwords, searchKey);
      result.length > 0 ? setPasswords(result) : null;
    } else {
      getPasswords();
    }
  };

  const closeSearch = () => {
    getPasswords();
    setSearchKey("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      {/* Search bar */}
      <CollapsibleSearchBar
        onTextChange={(text) => searchPass(text)}
        searchKey={searchKey}
        onXPress={closeSearch}
      />
      <Collapsible collapsed={isKeyBoxHidden}>
        <View style={[styles.passKeyBox, { backgroundColor: colors.backOne }]}>
          <View
            style={[
              styles.keyBoxContainer,
              { backgroundColor: colors.backTwo },
            ]}
          >
            <TextInput
              style={[styles.keyBox, { color: colors.textOne }]}
              placeholder="Enter password key"
              placeholderTextColor={colors.textTwo}
              value={passKey}
              onChangeText={(t) => setPassKey(t)}
              secureTextEntry={!showingPassKey}
            />
            {passKey.length > 0 && (
              <Feather
                name="x"
                size={18}
                color={colors.textTwo}
                style={{ padding: 8, paddingRight: 12 }}
                onPress={() => setPassKey("")}
              />
            )}
          </View>
          <Feather
            name={showingPassKey ? "eye-off" : "eye"}
            size={18}
            color={colors.textTwo}
            style={{ padding: 8, paddingRight: 10, paddingLeft: 12 }}
            onPress={() => setShowingPassKey(!showingPassKey)}
          />
        </View>
      </Collapsible>
      {!loading && passwords.length === 0 ? (
        <Text style={styles.noPassTxt}>You have not saved any passwords</Text>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 80 }}
          data={passwords}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                getPasswords();
              }}
              progressBackgroundColor={colors.backTwo}
              colors={[colors.primaryColor]}
            />
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <View
                style={[
                  styles.passContainer,
                  { backgroundColor: colors.backOne },
                ]}
              >
                <TouchableOpacity
                  style={styles.passTitleContainer}
                  onPress={() => handleCollapsePress(item, index)}
                >
                  <Text style={[{ color: colors.textOne }, styles.passTitle]}>
                    {item.title}
                  </Text>
                  <View
                    style={[
                      styles.horizontalView,
                      { justifyContent: "flex-start" },
                    ]}
                  >
                    {!collapsArr[index] ? (
                      <Feather
                        name={"trash"}
                        color={colors.textTwo}
                        size={18}
                        style={{ padding: 10 }}
                        onPress={() => {
                          dispatch(
                            showAlert(
                              "Do you want to delete this password?",
                              "This action is permanent and can not be reversed!!",
                              () => deletePassword(item)
                            )
                          );
                        }}
                      />
                    ) : (
                      <Feather
                        name={"edit-2"}
                        color={colors.textTwo}
                        size={18}
                        style={{ padding: 10 }}
                        onPress={() => {
                          const passData = { ...item };
                          passData.passwords = decryptedPassword;
                          props.navigation.navigate("AddPassword", {
                            isEditing: true,
                            data: passData,
                            passKey,
                          });
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <Collapsible collapsed={!collapsArr[index]}>
                  <View style={{ paddingVertical: 6 }}>
                    {item.passwords
                      ? decryptedPassword.map((pass, index) => {
                          return (
                            <View key={index}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "700",
                                  color: colors.textOne,
                                }}
                              >
                                Account {index + 1}
                              </Text>
                              <TouchableOpacity
                                onPress={() => copy(pass.email)}
                                style={[
                                  styles.accountData,
                                  { backgroundColor: colors.backTwo },
                                ]}
                              >
                                <Text
                                  style={[
                                    { color: colors.textOne },
                                    styles.email,
                                  ]}
                                >
                                  {pass.email}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => copy(pass.password)}
                                style={[
                                  styles.accountData,
                                  { backgroundColor: colors.backTwo },
                                ]}
                              >
                                <Text
                                  style={[
                                    { color: colors.textOne },
                                    styles.pass,
                                  ]}
                                >
                                  {pass.password}
                                </Text>
                              </TouchableOpacity>
                              {pass.description ? (
                                <Text
                                  onPress={() => copy(pass.description)}
                                  style={[
                                    { color: colors.textOne },
                                    styles.email,
                                  ]}
                                >
                                  {pass.description}
                                </Text>
                              ) : null}
                            </View>
                          );
                        })
                      : null}
                  </View>
                </Collapsible>
              </View>
            );
          }}
        />
      )}
      <FAB
        style={[styles.fab, { backgroundColor: colors.primaryColor }]}
        icon="plus"
        onPress={navigateToPassAddr}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  passContainer: {
    flex: 1,
    marginTop: 7,
    marginHorizontal: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  passTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  passTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  email: {
    fontSize: 16,
    paddingVertical: 10,
  },
  pass: {
    fontSize: 16,
    paddingVertical: 10,
  },
  horizontalView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerQRIconStyle: {
    paddingVertical: 12,
    paddingRight: 25,
  },
  noPassTxt: {
    alignSelf: "center",
    marginTop: 200,
    fontSize: 20,
    fontWeight: "700",
    color: "#888",
  },
  accountData: {
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 7,
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  keyBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
  },
  keyBox: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    flex: 1,
  },
  passKeyBox: {
    padding: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
