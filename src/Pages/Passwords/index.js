import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Collapsible from "../../Components/Accordian/Collapsable";
import { auth, firestore } from "../../Constants/Api";
import { showAlert } from "../../Redux/Alert/ActionCreator";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import CustomActivityIndicator from "../../Shared/Components/CustomActivityIndicator";
import {
  copyToClipboard,
  getPasswordsData,
  localAuth,
  sortArrayOfObjs,
} from "../../Shared/Functions";

export default function Passwords(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  //   const { data } = props?.route?.params;
  const [passwords, setPasswords] = useState([]);
  const [collapsArr, setCollapsArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localAuthDone, setLocalAuthDone] = useState(false);

  const dispatch = useDispatch();

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("ChangePassword");
              }}
              style={styles.headerQRIconStyle}
            >
              <Feather name={"key"} size={23} color={colors.textOne} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("AddPassword", { isEditing: false });
              }}
              style={styles.headerQRIconStyle}
            >
              <Feather name={"plus"} size={23} color={colors.textOne} />
            </TouchableOpacity>
          </View>
        );
      },
    });
  };

  const getPasswords = () => {
    // console.log(auth.currentUser);
    if (!auth.currentUser) {
      alert("Please logout and login again!!");
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
          setPasswords(passowords);
          setCollapsArr(nums);
          setLoading(false);
        },
        (err) => {
          setLoading(false);
          console.log("Erron in getting all PASSWORDS\n", err.message);
        }
      );
  };

  const toggelCollpase = (index) => {
    const collapsData = [...collapsArr];
    const currentVal = collapsData[index];
    collapsData.splice(index, 1, !currentVal);
    setCollapsArr(collapsData);
  };

  const handleCollapsePress = async (index) => {
    if (!collapsArr[index]) {
      if (!localAuthDone) {
        const isAuthenticated = await localAuth();
        if (isAuthenticated) {
          toggelCollpase(index);
          setLocalAuthDone(true);
        } else {
          dispatch(showSnack("Authentication is required!"));
        }
      } else {
        toggelCollpase(index);
      }
    } else {
      toggelCollpase(index);
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
        await firestore
          .collection("passwords")
          .doc(password._id)
          .delete()
          .then(() => {
            dispatch(showSnack("Password deleted!"));
          });
      }
    } catch (error) {
      dispatch(showSnack("Could not delte password, please try again"));
    }
  };

  useEffect(() => {
    getPasswords();
    setHeaderOptions();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      {loading ? <CustomActivityIndicator /> : null}
      {!loading && passwords.length === 0 ? (
        <Text style={styles.noPassTxt}>You have not saved any passwords</Text>
      ) : (
        <FlatList
          data={passwords}
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
                  onPress={() => handleCollapsePress(index)}
                >
                  <Text style={[{ color: colors.textOne }, styles.passTitle]}>
                    {item.title}
                  </Text>
                  <Feather
                    name={!collapsArr[index] ? "eye" : "eye-off"}
                    color={colors.textTwo}
                    size={18}
                  />
                </TouchableOpacity>
                <Collapsible collapsed={!collapsArr[index]}>
                  {item.passwords
                    ? item.passwords.map((pass, index) => {
                        return (
                          <View key={index}>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "700",
                                color: colors.textOne,
                                marginTop: 15,
                              }}
                            >
                              Account {index + 1}
                            </Text>
                            <View
                              style={[
                                styles.horizontalView,
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
                              <Feather
                                name={"copy"}
                                color={colors.textTwo}
                                size={18}
                                style={{ padding: 10 }}
                                onPress={() => copy(pass.emailORId)}
                              />
                            </View>
                            <View
                              style={[
                                styles.horizontalView,
                                styles.accountData,
                                { backgroundColor: colors.backTwo },
                              ]}
                            >
                              <Text
                                style={[{ color: colors.textOne }, styles.pass]}
                              >
                                {pass.password}
                              </Text>
                              <Feather
                                name={"copy"}
                                color={colors.textTwo}
                                size={18}
                                style={{ padding: 10 }}
                                onPress={() => copy(pass.password)}
                              />
                            </View>
                            {pass.description ? (
                              <Text
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
                  <View
                    style={[
                      styles.horizontalView,
                      { justifyContent: "flex-start" },
                    ]}
                  >
                    <Feather
                      name={"trash"}
                      color={colors.textTwo}
                      size={20}
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
                    <Feather
                      name={"edit-2"}
                      color={colors.textTwo}
                      size={20}
                      style={{ padding: 10 }}
                      onPress={() => {
                        props.navigation.navigate("AddPassword", {
                          isEditing: true,
                          data: item,
                        });
                      }}
                    />
                  </View>
                </Collapsible>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  passContainer: {
    flex: 1,
    marginTop: 7,
    marginHorizontal: 7,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  passTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
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
    paddingRight: 10,
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
    paddingLeft: 15,
    marginVertical: 5,
    borderRadius: 7,
  },
});
