import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { primaryColor, primaryErrColor } from "../../../Shared/Styles/index";
import { auth } from "../../../Constants/Api";
import { validateEmail } from "../../../Shared/Functions";
import { useDispatch, useSelector } from "react-redux";
import { showSnack } from "../../../Redux/Snack/ActionCreator";

export default function ResetPassword(props) {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const dispatch = useDispatch();

  const sendPasswordResetLink = (email) => {
    if (!validateEmail(username)) {
      setEmailErr("Enter a valid email");
      return;
    }
    setEmailErr("");
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        // console.log("Password reset link sent");
        dispatch(showSnack("Password reset link sent"));
      })
      .catch((err) => {
        console.log(
          "Here is err message from sending password reset link",
          err.message
        );
      });
  };

  return (
    <View>
      <View style={styles.header}>
        <Feather
          onPress={() => {
            props.onBackPress();
          }}
          name="chevron-left"
          size={30}
          color={colors.textOne}
          style={{ paddingRight: 20 }}
        />
        <Text style={[styles.headerText, { color: colors.textOne }]}>
          Reset Password
        </Text>
      </View>
      <TextInput
        style={[
          styles.textInput,
          { backgroundColor: colors.backTwo, color: colors.textOne },
        ]}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      {emailErr.length > 0 ? (
        <Text style={styles.errTxt}>{emailErr}</Text>
      ) : null}
      <TouchableOpacity
        style={[styles.loginBtn, { backgroundColor: colors.primaryColor }]}
        onPress={() => sendPasswordResetLink(email)}
      >
        <Text style={styles.loginBtnTxt}>Send password reset link</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 23,
    marginVertical: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "700",
  },
  textInput: {
    marginHorizontal: 25,
    marginVertical: 13,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  loginBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 40,
    marginVertical: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  loginBtnTxt: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  errTxt: {
    fontSize: 14,
    fontWeight: "700",
    marginHorizontal: 30,
    color: primaryErrColor,
  },
});
