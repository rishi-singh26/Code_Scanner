import React, { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { auth, firestore } from "../../Constants/Api";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import {
  deleteImage,
  openFile,
  pickImage,
  saveToDevice,
  shareThings,
  uploadImageToServer,
} from "../../Shared/Functions";
import RenderImage from "./Components/RenderImage";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Feather } from "@expo/vector-icons";
import { showAlert } from "../../Redux/Alert/ActionCreator";
import Prompt from "../../Shared/Components/Prompt";
import CustomActivityIndicator from "../../Shared/Components/CustomActivityIndicator";
import { addImageUri } from "../../Redux/LocalURIs/ActionCreator";

export default function Images(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const localUris = useSelector((state) => state.uris);
  const [images, setImages] = useState([]);
  const [imageName, setImageName] = useState("");
  const [showImageNamePrompt, setShowImageNamePrompt] = useState(false);
  const [uploadingImgData, setuploadingImgData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const pickImgToBeUploaded = async () => {
    const { status, result } = await pickImage();
    if (status && !result.cancelled) {
      setuploadingImgData(result);
      setShowImageNamePrompt(true);
    } else dispatch(showSnack("Oops!! Image not selected. Please try again"));
  };

  const uploadImage = async () => {
    try {
      if (imageName.length < 1) {
        dispatch(showSnack("Enter image name"));
        return;
      }
      dispatch(showSnack("Uploading image..."));
      const extension = uploadingImgData.uri.split("/").pop().split(".").pop();
      console.log(extension);
      setShowImageNamePrompt(false);
      const resp = await uploadImageToServer(
        {
          image: uploadingImgData.uri,
          name: imageName + "." + extension,
        },
        true, // should upload image url to database
        auth.currentUser.uid,
        () => {
          dispatch(showSnack("Image uploaded"));
          getImages();
        }
      );
      setImageName("");
      setuploadingImgData(null);
      // console.log(resp);
    } catch (err) {
      console.log(err.message);
      dispatch(showSnack("Error while uploading image", err.message));
    }
  };

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingVertical: 14, paddingHorizontal: 30 }}
            onPress={pickImgToBeUploaded}
            onLongPress={() => props.navigation.navigate("UploadImages")}
            delayLongPress={10000}
          >
            <Feather name="paperclip" color={colors.textOne} size={23} />
          </TouchableOpacity>
        );
      },
    });
  };

  const openImageOptions = (image) => {
    const options = ["Delete", "Share", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;
    const containerStyle = { backgroundColor: colors.backTwo };
    const textStyle = { color: colors.textOne };
    const icons = [
      <Feather name={"trash"} size={19} color={colors.primaryErrColor} />,
      <Feather name={"share"} size={20} color={colors.textOne} />,
      <Feather name={"x"} size={20} color={colors.textOne} />,
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
        containerStyle,
        textStyle,
      },
      async (buttonIndex) => {
        if (buttonIndex == 0) {
          dispatch(
            showAlert(
              "Do you want to delete this image?",
              "It can not be recovered later!",
              () => {
                deleteImage(image, (message) => {
                  dispatch(showSnack(message));
                  getImages();
                });
              }
            )
          );
          return;
        }
        if (buttonIndex == 1) {
          openORShareImage(image, 2);
          return;
        }
      }
    );
  };

  const getImages = () => {
    console.log("Getting images");
    setIsLoading(true);
    if (auth.currentUser) {
      firestore
        .collection("scannerImages")
        // .where("isDeleted", "==", false)
        .where("userId", "==", auth.currentUser.uid)
        // .orderBy("uploadDate", "asc")
        .limit(100)
        .get()
        .then((images) => {
          let imageSnapshot = [];
          images.docs.map((item) => {
            const _id = item.id;
            const data = item.data();
            imageSnapshot.push({ _id, ...data });
          });
          setImages(imageSnapshot);
          // console.log("Received query snapshot of size", imageSnapshot.length);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          dispatch(showSnack("Error while loading image", err.message));
          setIsLoading(false);
        });
    }
    setIsLoading(false);
  };

  const openORShareImage = async (imageData, openOrShare = 0) => {
    try {
      setIsLoading(true);
      // check if this uri is present in global state (ie. in localUris.imageURIs array)
      let indexOfLocalURI = localUris.imageURIs.findIndex(
        (x) => x.id === imageData._id
      );
      // present
      if (indexOfLocalURI >= 0) {
        // check if we want to view the image or share the image
        if (openOrShare === 1) {
          // view
          openFile(localUris.imageURIs[indexOfLocalURI].uri)
            ? null
            : dispatch(
                showSnack("Opps!! Error while opening image, please try again.")
              );
          setIsLoading(false);
        } else if (openOrShare === 2) {
          // share
          shareThings(localUris.imageURIs[indexOfLocalURI].uri)
            ? null
            : dispatch(
                showSnack("Opps!! Error while sharing image, please try again.")
              );
          setIsLoading(false);
        }
      }
      // not present
      else {
        // console.log("not present");
        // save to device
        const { status, localUri } = await saveToDevice(
          imageData.image,
          imageData.imageName
        );
        // check save status
        if (!status) {
          dispatch(
            showSnack("Opps!! Error while opening image, please try again.")
          );
          setIsLoading(false);
          return;
        }
        // add uri to global store for reuse
        dispatch(addImageUri({ id: imageData._id, uri: localUri.uri }));
        // check if we want to view the image or share the image
        if (openOrShare === 1) {
          // view
          openFile(localUri.uri)
            ? null
            : dispatch(
                showSnack("Opps!! Error while opening image, please try again.")
              );
          setIsLoading(false);
        } else if (openOrShare === 2) {
          // share
          shareThings(localUri.uri)
            ? null
            : dispatch(
                showSnack("Opps!! Error while sharing image, please try again.")
              );
          setIsLoading(false);
        }
      }
      setIsLoading(false);
    } catch (err) {
      dispatch(showSnack("Opps!! Error while opening image." + err.message));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setHeaderOptions();
    getImages();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      {isLoading && <CustomActivityIndicator />}
      <RenderImage
        images={images}
        onPress={(imgData) => openORShareImage(imgData, 1)}
        onLongPress={(imgData) => openImageOptions(imgData)}
      />
      <Prompt
        title={"Enter image name"}
        text={imageName}
        setText={(txt) => setImageName(txt)}
        onCancelPress={() => {
          setShowImageNamePrompt(false);
          setImageName("");
          setuploadingImgData(null);
        }}
        onOkPress={uploadImage}
        visible={showImageNamePrompt}
        hotBtnText={"Upload Image"}
        placeholderTxt={"Image name (without extension)"}
      />
    </SafeAreaView>
  );
}
