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
import RenameImgDilogue from "./Components/RenameImgDilogue";

export default function Images(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const [images, setImages] = useState([]);
  const [imageName, setImageName] = useState("");
  const [renameImgDilogVisible, setRenameImgDilogVisible] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

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
        true, // should upload image url to database
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
    const options = ["Delete", "Copy url", "Share", "Rename", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 4;
    const containerStyle = { backgroundColor: colors.backTwo };
    const textStyle = { color: colors.textOne };
    const icons = [
      <Feather name={"trash"} size={19} color={colors.primaryErrColor} />,
      <Feather name={"copy"} size={20} color={colors.textOne} />,
      <Feather name={"share"} size={20} color={colors.textOne} />,
      <Feather name={"edit"} size={19} color={colors.textOne} />,
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
        if (buttonIndex == 3) {
          setRenameImgDilogVisible(true);
          setSelectedImg(image);
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
          console.log("Received query snapshot of size", imageSnapshot.length);
        })
        .catch((err) => {
          console.log(err.message);
          dispatch(showSnack("Couldn't load images"));
        });
    }
  };

  const editImage = (data, docId) => {
    console.log("Editing Image");
    firestore
      .collection("scannerImages")
      .doc(docId)
      .update(data)
      .then(() => {
        dispatch(showSnack("Renaming successfull, now updating"));
        getImages();
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    setHeaderOptions();
    getImages();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      <RenderImage
        images={images}
        onPress={(imgData) =>
          props.navigation.navigate("ImageViewer", {
            imgData,
            removeImage: null,
          })
        }
        onLongPress={(image) => openImageOptions(image)}
      />
      <RenameImgDilogue
        title={"Rename Image"}
        visible={renameImgDilogVisible}
        imgName={imageName}
        setImgName={(name) => setImageName(name)}
        onOkPress={() => {
          dispatch(showSnack("Renaming image."));
          setRenameImgDilogVisible(false);
          setImageName("");
          // console.log({ pdfName: pdfName }, selectedPdf._id);
          editImage({ imageName: imageName }, selectedImg._id);
        }}
        onCancelPress={() => {
          setRenameImgDilogVisible(false);
          setImageName("");
        }}
      />
    </SafeAreaView>
  );
}
