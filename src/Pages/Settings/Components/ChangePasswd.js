import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../../Constants/Api";
import { showSnack } from "../../../Redux/Snack/ActionCreator";

export default function ChangePasswd(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const dispatch = useDispatch();

  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [isNewPassHiden, setIsNewPassHiden] = useState(true);
  const [isConfirmPasHiden, setIsConfirmPasHiden] = useState(true);
  const [newPassErr, setNewPassErr] = useState("");
  const [confirmPassErr, setConfirmPassErr] = useState("");

  const resetPass = () => {
    if (!auth.currentUser) {
      dispatch(showSnack("Login again!!"));
      return;
    }
    if (newPass.length < 8) {
      setNewPassErr("Password must be atleast 8 characters long");
      return;
    }
    setNewPassErr("");
    if (confirmNewPass.length < 8) {
      setConfirmPassErr("Password must be atleast 8 characters long");
      return;
    }
    setConfirmPassErr("");
    if (newPass !== confirmNewPass) {
      setConfirmPassErr("Both passwords must match");
      return;
    }
    setConfirmPassErr("");
    try {
      auth.currentUser
        .updatePassword(newPass)
        .then(() => {
          dispatch(showSnack("Password updated"));
          props.navigation.goBack();
        })
        .catch((err) => {
          dispatch(showSnack(err.message));
          console.log("err one");
        });
    } catch (err) {
      console.log("err two");
      dispatch(showSnack(err.message));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backOne }}>
      <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
        <Text
          style={[styles.labelTxt, { color: colors.textTwo, fontSize: 17 }]}
        >
          Your new password must be different from prviously used passwords.
        </Text>
        <Text style={[styles.labelTxt, { color: colors.textTwo }]}>
          New password
        </Text>
        <View style={[styles.txtInpView, { backgroundColor: colors.backTwo }]}>
          <TextInput
            value={newPass}
            onChangeText={(t) => setNewPass(t)}
            style={[styles.txtInp, { color: colors.textOne }]}
            secureTextEntry={isNewPassHiden}
            textContentType={"password"}
          />
          <Feather
            name={isNewPassHiden ? "eye" : "eye-off"}
            size={20}
            color={colors.textTwo}
            style={{ padding: 12 }}
            onPress={() => setIsNewPassHiden(!isNewPassHiden)}
          />
        </View>
        {newPassErr.length > 0 && (
          <Text
            style={[
              styles.labelTxt,
              { color: colors.primaryErrColor, fontSize: 13 },
            ]}
          >
            {newPassErr}
          </Text>
        )}
        <Text style={[styles.labelTxt, { color: colors.textTwo }]}>
          Confirm new password
        </Text>
        <View style={[styles.txtInpView, { backgroundColor: colors.backTwo }]}>
          <TextInput
            value={confirmNewPass}
            onChangeText={(t) => setConfirmNewPass(t)}
            style={[styles.txtInp, { color: colors.textOne }]}
            secureTextEntry={isConfirmPasHiden}
            textContentType={"newPassword"}
          />
          <Feather
            name={isConfirmPasHiden ? "eye" : "eye-off"}
            size={20}
            color={colors.textTwo}
            style={{ padding: 12 }}
            onPress={() => setIsConfirmPasHiden(!isConfirmPasHiden)}
          />
        </View>
        {confirmPassErr.length > 0 && (
          <Text
            style={[
              styles.labelTxt,
              { color: colors.primaryErrColor, fontSize: 13 },
            ]}
          >
            {confirmPassErr}
          </Text>
        )}
        <TouchableOpacity
          onPress={resetPass}
          style={[
            styles.resetPassBtn,
            { backgroundColor: colors.primaryColor },
          ]}
        >
          <Text style={styles.resetPassBtnTxt}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  labelTxt: {
    fontSize: 14,
    fontWeight: "700",
    paddingVertical: 10,
  },
  txtInpView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 6,
  },
  txtInp: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  resetPassBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 25,
  },
  resetPassBtnTxt: { fontSize: 18, fontWeight: "700", color: "#fff" },
});
