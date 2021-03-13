import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth, firestore } from "../../../Constants/Api";
import { showSnack } from "../../../Redux/Snack/ActionCreator";
import CustomActivityIndicator from "../../../Shared/Components/CustomActivityIndicator";
import { decryptText, encryptText } from "../../../Shared/Functions";

export default function ChangePassword(props) {
  const theme = useSelector((state) => state.theme);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [retypeNewPass, setRetypeNewPass] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const dispatch = useDispatch();

  const getPassPgName = async () => {
    setisLoading(true);
    try {
      const response = await firestore
        .collection("scannerPassPgName")
        .where("userId", "==", auth.currentUser.uid)
        .get();
      if (response.docs.length > 0) {
        let pageData;
        response.forEach((passPgData) => {
          pageData = { ...passPgData.data(), _id: passPgData.id };
          //   console.log(pageData);
        });
        setisLoading(false);
        return { status: true, data: pageData };
      }
      console.log("Password pg doesnot exist");
      setisLoading(false);
      return { status: false, data: null };
    } catch (error) {
      dispatch(
        showSnack("Error occured while resetting password, please try again")
      );
      setisLoading(false);
      return { status: false, data: null };
    }
  };

  const hasEntredValues = (oldPass, newPass, retypePass) => {
    return oldPass.length > 0 && newPass.length > 0 && retypePass.length > 0;
  };

  const isNewPassAndRetypeSame = (newPass, retypeNewPass) => {
    return newPass === retypeNewPass;
  };

  const decryptPgNameUsingOldPass = async (pgName, oldPass) => {
    //   console.log(pgName);
    const { status, data } = await decryptText(pgName, oldPass);
    if (status) {
      return { status: true, data };
    }
    dispatch(showSnack("Check your old password, it may be wrong!"));
    return { status: false, data: null };
  };

  const encryptPgNameUsingNewPass = async (pgName, newPass) => {
    const { status, data } = await encryptText(pgName, newPass);
    if (status) {
      return { status: true, data };
    }
    dispatch(showSnack("Error while changing password, please try again"));
    return { status: false, data: null };
  };

  const resetPass = async () => {
    if (!hasEntredValues(oldPass, newPass, retypeNewPass)) {
      dispatch(showSnack("Fill all three fields"));
      return;
    }
    if (!isNewPassAndRetypeSame(newPass, retypeNewPass)) {
      dispatch(showSnack("New passwords do not match!"));
      return;
    }
    // getting encrypted page name from server
    const { status, data } = await getPassPgName();
    if (!status) {
      dispatch(
        showSnack("Error occured while resetting password, please try again")
      );
      return;
    }
    // decrypting pagename
    const {
      status: decryptionStatus,
      data: decryptedData,
    } = await decryptPgNameUsingOldPass(data.pageName, oldPass);
    if (!decryptionStatus) {
      dispatch(
        showSnack("Error occured while resetting password, please try again")
      );
      return;
    }
    // encrypting pagename
    const {
      status: encryptionStatus,
      data: encryptedData,
    } = await encryptPgNameUsingNewPass(decryptedData, newPass);
    if (!encryptionStatus) {
      dispatch(showSnack("Could not change password, plaese try again!"));
      return;
    }
    // updating server
    firestore
      .collection("scannerPassPgName")
      .doc(data._id)
      .update({ updatedDate: new Date(), pageName: encryptedData })
      .then(() => {
        dispatch(showSnack("Password changed"));
        props.navigation.navigate("Home");
      })
      .catch((err) => {
        dispatch(showSnack("Could not change password, plaese try again!"));
        console.log(
          "Error while updating pagename on server on CHANGE PASSWORD",
          err.message
        );
      });
  };

  const { colors } = theme;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backOne }}>
      {isLoading ? <CustomActivityIndicator /> : null}
      <TextInput
        style={[
          styles.textInput,
          { backgroundColor: colors.backTwo, color: colors.textOne },
        ]}
        placeholder="Enter old password"
        value={oldPass}
        onChangeText={(txt) => setOldPass(txt)}
      />
      <TextInput
        style={[
          styles.textInput,
          { backgroundColor: colors.backTwo, color: colors.textOne },
        ]}
        placeholder="Enter new password"
        value={newPass}
        onChangeText={(txt) => setNewPass(txt)}
      />
      <TextInput
        style={[
          styles.textInput,
          { backgroundColor: colors.backTwo, color: colors.textOne },
        ]}
        placeholder="Retype new password"
        value={retypeNewPass}
        onChangeText={(txt) => setRetypeNewPass(txt)}
      />
      <TouchableOpacity
        onPress={() => resetPass()}
        style={[styles.changePassBtn, { backgroundColor: colors.primaryColor }]}
      >
        <Text style={{ fontSize: 17, fontWeight: "700", color: "#fff" }}>
          Change password
        </Text>
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
  changePassBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 7,
    marginVertical: 20,
    marginHorizontal: 20,
    alignItems: "center",
  },
});
