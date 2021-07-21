import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, cloudStorage } from "../../../Constants/Api";

/**
 * Uploads one pdf to firebase storage.
 * @param {Object} imageData
 * @param {String} path - cloud storage path where image is to be stored
 * @returns {Object} {status: Boolean, downloadUri: URL}
 * image data must be like the default object returned by expo image picker
 * {
      "cancelled": boolean,
      "height": number,
      "type": "String",
      "uri": "image uri in local file system",
      "width": number,
    },
 */
export async function uploadImageToServer(imageData, path) {
  console.log("Uploading selected image...");
  const response = await fetch(imageData.uri);
  const blob = await response.blob();

  const imageName = auth.currentUser.uid + imageData.uri.split("/").pop();

  try {
    const result = await cloudStorage
      .ref()
      .child(path + imageName)
      .put(blob);

    var photoDownloadURLRef = cloudStorage.ref(result.metadata.fullPath);
    const photoDownloadURL = await photoDownloadURLRef.getDownloadURL();
    console.log("Here is the download url", photoDownloadURL);
    return { status: true, downloadUri: photoDownloadURL };
  } catch (err) {
    console.log(
      "Error in uploading iamge to server IMAGE FUNCTIONS",
      err.message
    );
    return { status: false, downloadUri: null };
  }
}

/**
 *
 * @param {Function} optionalFunc
 * pass an optional function to run after the image has been picked successfully
 * opens image picjer native app
 */
export async function pickImage() {
  if (Platform.OS === "web") {
    alert("Device not supported.");
    return { status: false, result: null };
  }
  console.log("Not on web");
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need camera roll permissions to make this work!");
    return { status: false, result: null };
  }
  // console.log("Permission granted");
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
    });
    // console.log("Here is image result", result);
    if (result.cancelled) {
      return { status: false, result: null };
    }
    return { status: true, result };
  } catch (err) {
    console.log(err.message);
    return { status: false, result: null };
  }
}
