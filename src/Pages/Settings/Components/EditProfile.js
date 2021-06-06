import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  pickImage,
  uploadImageToServer,
} from "../../../Shared/Functions/index";
import { showSnack } from "../../../Redux/Snack/ActionCreator";
import { auth } from "../../../Constants/Api";
import CustomActivityIndicator from "../../../Shared/Components/CustomActivityIndicator";

export default function EditProfile(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const dispatch = useDispatch();

  const [name, setName] = useState(auth?.currentUser?.displayName || "");
  const [image, setImage] = useState({
    uri: auth?.currentUser?.photoURL || null,
  });
  const [isLoding, setIsLoding] = useState(false);

  const getImage = async () => {
    console.log("getting profile image");
    const { status, result } = await pickImage();
    if (!status || result.cancelled) {
      dispatch(showSnack("Error while getting image, please try again!"));
      return;
    }
    setImage(result);
    const data = await uploadImageToServer(
      {
        image: result.uri,
        name: result.uri.split("/").pop(),
      },
      false
    );
    console.log("Here is data", data);
    if (!data.status) {
      dispatch(
        showSnack("Error while updating profile image, please try again!")
      );
      return;
    }
    setIsLoding(true);
    auth.currentUser
      .updateProfile({
        photoURL: data.downloadUri,
      })
      .then(() => {
        auth.currentUser.reload();
        dispatch(showSnack("Profile image updated."));
        setIsLoding(false);
        props.navigation.navigate("Home");
      })
      .catch((err) => {
        // this.setState({ isLoading: false });
        setIsLoding(false);
        dispatch(showSnack(err.message));
      });
  };

  const updateName = () => {
    try {
      if (name.length === 0) {
        dispatch(showSnack("Enter your name!"));
        return;
      }
      setIsLoding(true);
      auth.currentUser
        .updateProfile({
          displayName: name,
        })
        .then(() => {
          auth.currentUser.reload();
          setIsLoding(false);
          dispatch(showSnack("Name updated"));
          props.navigation.navigate("Home");
        })
        .catch((err) => {
          setIsLoding(false);
          dispatch(showSnack(err.message));
          console.log(err.message);
        });
    } catch (err) {
      dispatch(showSnack("Error while updating user name, please try again!"));
      console.log(err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      {isLoding ? <CustomActivityIndicator /> : null}
      <View style={[styles.card, { backgroundColor: colors.backOne }]}>
        {image != null ? (
          <TouchableOpacity onPress={() => getImage()}>
            <Image source={{ uri: image.uri }} style={styles.imageStyle} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.imageEditIconStyle,
              { backgroundColor: colors.backThree },
            ]}
            onPress={() => getImage()}
          >
            <Feather name="edit-2" size={22} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={[styles.card, { backgroundColor: colors.backOne, marginTop: 2 }]}
      >
        <TextInput
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
          style={[
            styles.textInput,
            { color: colors.textOne, backgroundColor: colors.backTwo },
          ]}
          placeholder="Name"
          placeholderTextColor={colors.textTwo}
        />
        <TouchableOpacity
          onPress={updateName}
          style={[
            styles.updateNameBtnView,
            { backgroundColor: colors.primaryColor },
          ]}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>
            Update name
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  imageEditIconStyle: {
    padding: 40,
    borderRadius: 70,
  },
  textInput: {
    marginTop: 10,
    fontSize: 17,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "stretch",
  },
  updateNameBtnView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 7,
    marginTop: 20,
  },
});
