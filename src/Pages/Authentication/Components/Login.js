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
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../../Redux/Auth/ActionCreator";
import { validateEmail } from "../../../Shared/Functions/index";

export default function Login(props) {
  // Global state
  const auth = useSelector((state) => state.auth);
  // local state
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [shouldShowPassword, setShouldShowPassword] = useState(true);
  const [emailErr, setEmailErr] = useState("");

  const dispatch = useDispatch();

  const loginUserOnDataValidation = (username, password) => {
    if (!validateEmail(username)) {
      setEmailErr("Enter a valid email");
      return;
    }
    setEmailErr("");
    dispatch(loginUser({ username, password }));
  };

  return (
    <View>
      <View style={styles.header}>
        <Feather
          color={"#fff"}
          size={24}
          name="plus-square"
          style={styles.iconStyle}
        />
        <Text style={styles.headerText}>Docto</Text>
      </View>
      <TextInput
        style={styles.textInput}
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
      <View style={[styles.textInput, styles.textInputView]}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={pass}
          onChangeText={(text) => {
            setPass(text);
          }}
          style={{ flex: 1 }}
          secureTextEntry={shouldShowPassword}
        />
        <Feather
          color={"#333"}
          size={18}
          name={shouldShowPassword ? "eye" : "eye-off"}
          onPress={() => {
            setShouldShowPassword(!shouldShowPassword);
          }}
        />
      </View>
      <TouchableOpacity
        onPress={() => loginUserOnDataValidation(email, pass)}
        style={styles.loginBtn}
      >
        <Text style={styles.loginBtnTxt}>Login</Text>
      </TouchableOpacity>
      <View style={styles.btnsView}>
        <Text
          onPress={() => props.onForgotPassPress()}
          style={[styles.loginBtnTxt, styles.forgotPasswordBtn]}
        >
          Forgot Password
        </Text>
        <Text
          onPress={() => props.onSignupPress()}
          style={[styles.loginBtnTxt, styles.signUpBtn]}
        >
          SignUp
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnsView: {
    flexDirection: "row",
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotPasswordBtn: {
    color: "#000",
    alignSelf: "center",
    marginTop: 15,
    marginHorizontal: 5,
    paddingRight: 10,
    borderRightColor: "#000",
    borderRightWidth: 1,
  },
  signUpBtn: {
    color: "#000",
    alignSelf: "center",
    marginTop: 15,
    marginHorizontal: 5,
  },
  iconStyle: {
    backgroundColor: primaryColor,
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
  },
  header: {
    marginHorizontal: 30,
    marginTop: 40,
    marginBottom: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 27,
    fontWeight: "700",
    color: "#000",
  },
  textInput: {
    backgroundColor: "#f2f2f2",
    marginHorizontal: 25,
    marginVertical: 13,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: 15,
  },
  textInputView: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 40,
    alignItems: "center",
    backgroundColor: "#000",
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
