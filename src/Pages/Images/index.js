import React, { useEffect, useState } from "react";
import { Linking, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { auth, firestore } from "../../Constants/Api";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import {
  copyToClipboard,
  deleteImage,
  pickImage,
  shareThings,
  uploadImageToServer,
} from "../../Shared/Functions";
import RenderImage from "./Components/RenderImage";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Feather } from "@expo/vector-icons";
import { showAlert } from "../../Redux/Alert/ActionCreator";

export default function Images(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const [images, setImages] = useState([]);

  const dispatch = useDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const uploadImage = async () => {
    const { status, result } = await pickImage();
    if (status && !result.cancelled) {
      dispatch(showSnack("Uploading image..."));
      await uploadImageToServer(
        {
          image: result.uri,
          name: result.uri.split("/").pop(),
        },
        auth.currentUser.uid,
        () => {
          dispatch(showSnack("Image uploaded"));
          getImages();
        }
      )
        .then((resp) => {
          console.log("resp of server upload", resp);
        })
        .catch((err) => console.log(err.message));
    } else dispatch(showSnack("Oops!! Image not selected. Please try again"));
  };

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingVertical: 14, paddingHorizontal: 30 }}
            onPress={uploadImage}
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
    const options = ["Delete", "Copy url", "Share", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 3;
    const containerStyle = { backgroundColor: colors.backTwo };
    const textStyle = { color: colors.textOne };
    const icons = [
      <Feather name={"trash"} size={20} color={colors.textOne} />,
      <Feather name={"copy"} size={20} color={colors.textOne} />,
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
          copyToClipboard(image.image);
          dispatch(showSnack("Copied to clipboard"));
          return;
        }
        if (buttonIndex == 2) {
          Linking.canOpenURL(image.image) ? Linking.openURL(image.image) : null;
          // shareThings(image.image);
          // const pdfuri = await shareScannedDataPdf(
          //   `<h3>${data.title}</h3><p>${data.scannedData.data}</p>`
          // );
          // pdfuri.status ? shareThings(pdfuri.pdfUri) : null;
          return;
        }
      }
    );
  };

  const getImages = () => {
    console.log("Getting images");
    if (auth.currentUser) {
      firestore
        .collection("scannerImages")
        .where("isDeleted", "==", false)
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
          console.log("Received query snapshot of size", imageSnapshot.length);
        })
        .catch((err) => {
          console.log(err.message);
          dispatch(showSnack("Couldn't load images"));
        });
    }
  };

  useEffect(() => {
    setHeaderOptions();
    getImages();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      <RenderImage
        images={images}
        onPress={(source) =>
          props.navigation.navigate("ImageViewer", {
            source,
            removeImage: null,
          })
        }
        onLongPress={(image) => openImageOptions(image)}
      />
    </SafeAreaView>
  );
}
