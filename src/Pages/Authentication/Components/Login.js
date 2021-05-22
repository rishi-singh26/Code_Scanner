import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { primaryColor, primaryErrColor } from "../../../Shared/Styles/index";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../../Redux/Auth/ActionCreator";
import { validateEmail } from "../../../Shared/Functions/index";

export default function Login(props) {
  // Global state
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  // local state
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [shouldShowPassword, setShouldShowPassword] = useState(true);
  const [emailErr, setEmailErr] = useState("");
  const [passwdErr, setPasswdErr] = useState("");

  const dispatch = useDispatch();

  const loginUserOnDataValidation = (username, password) => {
    if (!validateEmail(username)) {
      setEmailErr("Enter a valid email");
      return;
    }
    setEmailErr("");
    if (password.length === 0) {
      setPasswdErr("Enter a password");
      return;
    }
    setPasswdErr("");
    dispatch(loginUser({ username, password }));
  };

  return (
    <View>
      <View style={styles.header}>
        <AntDesign
          name="qrcode"
          size={25}
          color="#fff"
          style={styles.iconStyle}
        />
        <Text style={[styles.headerText, { color: colors.textOne }]}>
          Scanner
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
        autoCapitalize={"none"}
      />
      {emailErr.length > 0 ? (
        <Text style={styles.errTxt}>{emailErr}</Text>
      ) : null}
      <View
        style={[
          styles.textInput,
          styles.textInputView,
          ,
          { backgroundColor: colors.backTwo, paddingVertical: 7 },
        ]}
      >
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={pass}
          onChangeText={(text) => {
            setPass(text);
          }}
          style={{ flex: 1, color: colors.textOne }}
          secureTextEntry={shouldShowPassword}
        />
        <Feather
          color={colors.textThree}
          size={18}
          name={shouldShowPassword ? "eye" : "eye-off"}
          onPress={() => {
            setShouldShowPassword(!shouldShowPassword);
          }}
          style={{ padding: 8 }}
        />
      </View>
      {passwdErr.length > 0 ? (
        <Text style={styles.errTxt}>{passwdErr}</Text>
      ) : null}
      <TouchableOpacity
        onPress={() => loginUserOnDataValidation(email, pass)}
        style={[styles.loginBtn, { backgroundColor: colors.primaryColor }]}
      >
        <Text style={styles.loginBtnTxt}>Login</Text>
      </TouchableOpacity>
      <View style={styles.btnsView}>
        <Text
          onPress={() => props.onForgotPassPress()}
          style={[
            styles.loginBtnTxt,
            styles.forgotPasswordBtn,
            { color: colors.textOne, borderRightColor: colors.textOne },
          ]}
        >
          Forgot Password
        </Text>
        <Text
          onPress={() => props.onSignupPress()}
          style={[
            styles.loginBtnTxt,
            styles.signUpBtn,
            { color: colors.textOne },
          ]}
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
    alignSelf: "center",
    marginTop: 15,
    marginHorizontal: 5,
    paddingRight: 10,
    borderRightColor: "#000",
    borderRightWidth: 1,
    paddingVertical: 5,
  },
  signUpBtn: {
    alignSelf: "center",
    marginTop: 15,
    marginHorizontal: 5,
    paddingVertical: 5,
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
  },
  textInput: {
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
