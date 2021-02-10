import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, Linking } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { auth, firestore } from "../../Constants/Api";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import {
  copyToClipboard,
  pickDocuments,
  uploadPdfToServer,
} from "../../Shared/Functions";
import RenderPdfTile from "./Components/RenderPdfTile";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function Pdfs(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const dispatch = useDispatch();
  const [pdfs, setPdfs] = useState([]);
  const { showActionSheetWithOptions } = useActionSheet();

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingVertical: 14, paddingHorizontal: 30 }}
            onPress={uploadPdf}
            // onLongPress={() => props.navigation.navigate("UploadImages")}
            // delayLongPress={10000}
          >
            <Feather name="paperclip" color={colors.textOne} size={23} />
          </TouchableOpacity>
        );
      },
    });
  };

  const uploadPdf = async () => {
    const { status, result } = await pickDocuments();
    if (status) {
      await uploadPdfToServer(result, auth.currentUser.uid, (mess) =>
        dispatch(showSnack(mess))
      ).then(() => {
        getPdfs();
      });
    }
  };

  const getPdfs = () => {
    console.log("getting pdfs");
    firestore
      .collection("scannedPdfs")
      .where("isDeleted", "==", false)
      .get()
      .then((pdfs) => {
        let pdfSnapShot = [];
        pdfs.docs.map((item) => {
          const _id = item.id;
          const data = item.data();
          pdfSnapShot.push({ _id, ...data });
        });
        setPdfs(pdfSnapShot);
        console.log("Received query snapshot of size", pdfSnapShot.length);
      })
      .catch((err) => {
        console.log(err.message);
        dispatch(showSnack("Couldn't load pdfs"));
      });
  };

  const openPdfOptions = (pdf) => {
    const options = ["Copy url", "Download", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;
    const containerStyle = { backgroundColor: colors.backTwo };
    const textStyle = { color: colors.textOne };
    const message = "Cant open pdf files, will work in future updates.";
    const icons = [
      <Feather name={"copy"} size={20} color={colors.textOne} />,
      <Feather name={"download"} size={20} color={colors.textOne} />,
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
        message,
      },
      async (buttonIndex) => {
        if (buttonIndex == 0) {
          copyToClipboard(pdf.pdf);
          dispatch(showSnack("Copied to clipboard"));
          return;
        }
        if (buttonIndex == 1) {
          Linking.canOpenURL(pdf.pdf) ? Linking.openURL(pdf.pdf) : null;
          return;
        }
      }
    );
  };

  useEffect(() => {
    setHeaderOptions();
    getPdfs();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      <RenderPdfTile pdfs={pdfs} onPress={(pdf) => openPdfOptions(pdf)} />
    </SafeAreaView>
  );
}
