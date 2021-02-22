import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth, firestore } from "../../../Constants/Api";
import { showSnack } from "../../../Redux/Snack/ActionCreator";

export default function AddPassword(props) {
    const { isEditing, data } = props.route.params;
  const theme = useSelector((state) => state.theme);
  const [showPass, setShowPass] = useState(false);
  const [title, setTitle] = useState(isEditing ? data.title : "");
  const [passwords, setPasswords] = useState(isEditing ? data.passwords : [
    { email: "", password: "", description: "" },
  ]);

  const dispatch = useDispatch();

  const setData = (dataName, index, data) => {
    const thisPassword = passwords[index];
    const allPasswords = [...passwords];
    thisPassword[dataName] = data;
    allPasswords.splice(index, 1, thisPassword);
    setPasswords(allPasswords);
  };

  const savePass = () => {
    if (auth.currentUser) {
      firestore
        .collection("passwords")
        .add({
          creationDate: new Date(),
          title: title,
          passwords: passwords,
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
        });
    }
  };

  const editPass = () => {
      if(auth.currentUser){
          firestore.collection("passwords").doc(data._id).update({
              title: title,
              passwords: passwords,
              updationDate: new Date(),
          }).then(() => {
            dispatch(showSnack("Password updated successfully"));
            props.navigation.goBack();
          })
          .catch((err) => {
            dispatch(showSnack("Error in updating password, please try again"));
            console.log("Error while adding password", err.message);
          });
      }
  }

  const { colors } = theme;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backOne }}>
      <ScrollView>
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
        {passwords.map((pass, index) => {
          return (
            <>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: colors.textOne,
                  marginTop: 15,
                  marginHorizontal: 10,
                }}
              >
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
                value={pass.email}
                onChangeText={(txt) => setData("email", index, txt)}
              />
              <TextInput
                placeholderTextColor={colors.textTwo}
                placeholder={"Passowrd"}
                style={[
                  styles.textInput,
                  { backgroundColor: colors.backTwo, color: colors.textOne },
                ]}
                textContentType="password"
                // secureTextEntry={!showPass}
                value={pass.password}
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
                value={pass.description}
                onChangeText={(txt) => setData("description", index, txt)}
              />
            </>
          );
        })}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {passwords.length > 1 ? (
            <TouchableOpacity
              style={[
                styles.addPassBtn,
                { backgroundColor: `${colors.primaryColor}77` },
              ]}
              onPress={() => {
                const allPass = [...passwords];
                allPass.pop();
                setPasswords(allPass);
              }}
            >
              <Feather name={"minus"} size={20} color={"#fff"} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={[
              styles.addPassBtn,
              { backgroundColor: `${colors.primaryColor}77` },
            ]}
            onPress={() => {
              const newPassData = { email: "", password: "", description: "" };
              setPasswords([...passwords, newPassData]);
            }}
          >
            <Feather name={"plus"} size={20} color={"#fff"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.addPassBtn,
          {
            backgroundColor: colors.primaryColor,
            marginBottom: 10,
            paddingVertical: 10,
            marginTop: 10,
          },
        ]}
        onPress={() => {
            isEditing ? editPass() : savePass();
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: "#fff",
          }}
        >
          {isEditing ? "UPDATE" : "ADD"}
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
  addPassBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 4,
    minWidth: 160,
  },
});
