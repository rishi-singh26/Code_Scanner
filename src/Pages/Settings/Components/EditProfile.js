import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function EditProfile(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Camera roll permissions is required to choose an image.");
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log(result);

      if (!result.cancelled) {
        setImage(result);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      <View style={[styles.card, { backgroundColor: colors.backOne }]}>
        {image != null ? (
          <TouchableOpacity
            onPress={() => {
              const imgData = {
                uploadDate: null,
                userId: null,
                image: image.uri,
                imageName: "Profile image",
                isDeleted: false,
              };
              props.navigation.navigate("ImageViewer", {
                imgData,
                removeImage: null,
              });
            }}
          >
            <Image source={{ uri: image.uri }} style={styles.imageStyle} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.imageEditIconStyle,
              { backgroundColor: colors.backThree },
            ]}
            onPress={() => {
              pickImage();
            }}
          >
            <Feather name="edit-2" size={22} color="#999" />
          </TouchableOpacity>
        )}
        <TextInput
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
          style={[
            styles.textInput,
            { borderBottomColor: colors.textThree, color: colors.textOne },
          ]}
          placeholder="Name"
          placeholderTextColor={colors.textTwo}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 15,
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
    borderBottomWidth: 1,
    width: "90%",
    marginTop: 30,
    fontSize: 17,
  },
});
