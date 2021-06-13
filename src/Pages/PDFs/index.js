import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, Linking } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { auth, firestore } from "../../Constants/Api";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import {
  copyToClipboard,
  deletePdf,
  pickDocuments,
  uploadPdfToServer,
} from "../../Shared/Functions";
import RenderPdfTile from "./Components/RenderPdfTile";
import { useActionSheet } from "@expo/react-native-action-sheet";
import RenamePdfDilogue from "./Components/RenamePdfDilogue";
import { showAlert } from "../../Redux/Alert/ActionCreator";

export default function Pdfs(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const dispatch = useDispatch();
  const [pdfs, setPdfs] = useState([]);
  const [pdfName, setPdfName] = useState("");
  const [renamePdfDilogueVisible, setRenamePdfDilogueVisible] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
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
      .where("userId", "==", auth.currentUser.uid)
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
    const options = ["Delete", "Copy url", "Download", "Rename", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 4;
    const containerStyle = { backgroundColor: colors.backTwo };
    const textStyle = { color: colors.textOne };
    const message = `Cant open pdf files, will work in future updates.\n${pdf.pdfName}`;
    const messageTextStyle = { color: colors.textOne, fontSize: 16 };
    const icons = [
      <Feather name={"trash"} size={19} color={colors.primaryErrColor} />,
      <Feather name={"copy"} size={20} color={colors.textOne} />,
      <Feather name={"download"} size={20} color={colors.textOne} />,
      <Feather name={"edit"} size={20} color={colors.textOne} />,
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
        messageTextStyle,
      },
      async (buttonIndex) => {
        if (buttonIndex == 0) {
          dispatch(
            showAlert(
              "Do you want to delete this pdf?",
              "It can not be recovered later!",
              () => {
                dispatch(showSnack("Deleting pdf..."));
                deletePdf(pdf, (message) => {
                  dispatch(showSnack(message));
                  getPdfs();
                });
              }
            )
          );
          return;
        }
        if (buttonIndex == 1) {
          copyToClipboard(pdf.pdf);
          dispatch(showSnack("Copied to clipboard"));
          return;
        }
        if (buttonIndex == 2) {
          Linking.canOpenURL(pdf.pdf) ? Linking.openURL(pdf.pdf) : null;
          return;
        }
        if (buttonIndex == 3) {
          setSelectedPdf(pdf);
          setRenamePdfDilogueVisible(true);
          return;
        }
      }
    );
  };

  const editPdf = (data, docId) => {
    console.log("Editing pdf");
    if (auth.currentUser) {
      firestore
        .collection("scannedPdfs")
        .doc(docId)
        .update(data)
        .then(() => {
          dispatch(showSnack("Renaming successfull, now updating"));
          getPdfs();
        })
        .catch((err) => console.log(err.message));
    }
  };

  useEffect(() => {
    setHeaderOptions();
    getPdfs();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      <RenderPdfTile pdfs={pdfs} onPress={(pdf) => openPdfOptions(pdf)} />
      <RenamePdfDilogue
        title={"Rename PDF"}
        pdfName={pdfName}
        setPdfName={(name) => setPdfName(name)}
        visible={renamePdfDilogueVisible}
        onOkPress={() => {
          dispatch(showSnack("Renaming pdf."));
          setRenamePdfDilogueVisible(false);
          setPdfName("");
          // console.log({ pdfName: pdfName }, selectedPdf._id);
          editPdf({ pdfName: pdfName }, selectedPdf._id);
        }}
        onCancelPress={() => {
          setRenamePdfDilogueVisible(false);
          setPdfName("");
        }}
      />
    </SafeAreaView>
  );
}
