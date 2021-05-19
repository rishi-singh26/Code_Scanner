import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth, firestore } from "../../../Constants/Api";
import { showAlert } from "../../../Redux/Alert/ActionCreator";
import { showSnack } from "../../../Redux/Snack/ActionCreator";
import { encryptPasswords } from "../../../Shared/Functions";

export default function AddPassword(props) {
  const { isEditing, data, passKey } = props.route.params;
  const theme = useSelector((state) => state.theme);
  const [title, setTitle] = useState(isEditing ? data.title : "");
  const [passwords, setPasswords] = useState(
    isEditing ? data.passwords : [{ email: "", password: "", description: "" }]
  );

  const dispatch = useDispatch();

  const setData = (dataName, index, data) => {
    const thisPassword = passwords[index];
    const allPasswords = [...passwords];
    thisPassword[dataName] = data;
    allPasswords.splice(index, 1, thisPassword);
    setPasswords(allPasswords);
  };

  const isEmpty = () => {
    return title === "";
  };

  const savePass = async () => {
    if (isEmpty()) {
      dispatch(showSnack("Enter a title"));
      return;
    }
    if (!auth.currentUser) {
      dispatch(
        showSnack(
          "You are not authorized to perform this operation, please login"
        )
      );
      return;
    }
    // console.log(passwords);
    const { status: encryptionStatus, data: encryptedPasswords } =
      await encryptPasswords(passwords, passKey);
    // console.log({ encryptionStatus, encryptedPasswords });
    encryptionStatus
      ? firestore
          .collection("passwords")
          .add({
            creationDate: new Date(),
            title: title,
            passwords: encryptedPasswords,
            userId: auth.currentUser.uid,
            updationDate: new Date(),
          })
          .then(() => {
            dispatch(showSnack("Password added successfully"));
            props.navigation.goBack();
          })
          .catch((err) => {
            dispatch(showSnack("Error in adding password, please try again"));
            console.log("Error while adding password", err.message);
          })
      : dispatch(
          showAlert(
            "Could not save this password because of error in encryption process. Please try again."
          )
        );
  };

  const editPass = async () => {
    if (isEmpty()) {
      dispatch(showSnack("Enter a title"));
      return;
    }
    if (auth.currentUser) {
      // console.log(passwords);
      const { status: encryptionStatus, data: encryptedPasswords } =
        await encryptPasswords(passwords, passKey);
      // console.log({ encryptionStatus, encryptedPasswords });
      encryptionStatus
        ? firestore
            .collection("passwords")
            .doc(data._id)
            .update({
              title: title,
              passwords: encryptedPasswords,
              updationDate: new Date(),
            })
            .then(() => {
              dispatch(showSnack("Password updated successfully"));
              props.navigation.goBack();
            })
            .catch((err) => {
              dispatch(
                showSnack("Error in updating password, please try again")
              );
              console.log("Error while adding password", err.message);
            })
        : dispatch(
            showAlert(
              "Could not edit this password because of error in encryption process. Please try again."
            )
          );
    }
  };

  const addAccount = () => {
    try {
      const newPassData = {
        email: "",
        password: "",
        description: "",
      };
      setPasswords([...passwords, newPassData]);
    } catch (err) {
      dispatch(showSnack("An error occured, please try again"));
      console.log("Error while adding new account field on ADD PASSWORD");
    }
  };

  const removeAccount = () => {
    try {
      if (passwords.length > 1) {
        const allPass = [...passwords];
        allPass.pop();
        setPasswords(allPass);
      } else {
        dispatch(showSnack("Minimum one account is required"));
      }
    } catch (err) {
      dispatch(showSnack("An error occured, please try again"));
      console.log("Error while removing account field on ADD PASSWORD");
    }
  };

  const { colors } = theme;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backOne }}>
      <FlatList
        ListHeaderComponent={
          <TextInput
            placeholderTextColor={colors.textTwo}
            placeholder={"Title"}
            style={[
              styles.textInput,
              { backgroundColor: colors.backTwo, color: colors.textOne },
            ]}
            value={title}
            onChangeText={(txt) => setTitle(txt)}
          />
        }
        data={passwords}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <View>
              <Text style={[styles.accNumberTxt, { color: colors.textOne }]}>
                Account {index + 1}
              </Text>
              <TextInput
                placeholderTextColor={colors.textTwo}
                placeholder={"User id or email"}
                style={[
                  styles.textInput,
                  { backgroundColor: colors.backTwo, color: colors.textOne },
                ]}
                keyboardType="email-address"
                textContentType="emailAddress"
                value={item.email}
                onChangeText={(txt) => setData("email", index, txt)}
                // removeClippedSubviews={false}
              />
              <TextInput
                placeholderTextColor={colors.textTwo}
                placeholder={"Passowrd"}
                style={[
                  styles.textInput,
                  { backgroundColor: colors.backTwo, color: colors.textOne },
                ]}
                textContentType="password"
                value={item.password}
                onChangeText={(txt) => setData("password", index, txt)}
              />
              <TextInput
                placeholderTextColor={colors.textTwo}
                placeholder={"Description (optional)"}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.backTwo,
                    color: colors.textOne,
                    minHeight: 80,
                  },
                ]}
                multiline
                value={item.description}
                onChangeText={(txt) => setData("description", index, txt)}
              />
            </View>
          );
        }}
        ListFooterComponent={
          <View style={styles.accAddedContainer}>
            <TouchableOpacity
              style={[
                styles.accAddrSubrBtn,
                {
                  backgroundColor: colors.backOne,
                  borderColor:
                    passwords.length > 1
                      ? colors.primaryColor
                      : colors.backThree,
                },
              ]}
              onPress={removeAccount}
            >
              <Text
                style={{
                  fontSize: 17,
                  color:
                    passwords.length > 1
                      ? colors.primaryColor
                      : colors.backThree,
                }}
              >
                Remove account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.accAddrSubrBtn,
                {
                  backgroundColor: colors.backOne,
                  borderColor: colors.primaryColor,
                },
              ]}
              onPress={addAccount}
            >
              <Text style={{ fontSize: 17, color: colors.primaryColor }}>
                Add account
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity
        style={[
          styles.addPassBtn,
          {
            backgroundColor: colors.primaryColor,
          },
        ]}
        onPress={() => {
          isEditing ? editPass() : savePass();
        }}
      >
        <Text style={styles.addPassBtnTxt}>{isEditing ? "UPDATE" : "ADD"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginHorizontal: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  addPassBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 7,
    minWidth: 160,
    marginBottom: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  addPassBtnTxt: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  accAddrSubrBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 7,
    minWidth: 160,
    borderWidth: 1,
  },
  accAddedContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  accNumberTxt: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 15,
    marginHorizontal: 10,
  },
});
