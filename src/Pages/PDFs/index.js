import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { auth, firestore } from "../../Constants/Api";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import {
  deletePdf,
  openFile,
  pickDocuments,
  saveToDevice,
  shareThings,
  uploadPdfToServer,
} from "../../Shared/Functions";
import RenderPdfTile from "./Components/RenderPdfTile";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { showAlert } from "../../Redux/Alert/ActionCreator";
import Prompt from "../../Shared/Components/Prompt";
import CustomActivityIndicator from "../../Shared/Components/CustomActivityIndicator";
import { addPdfUri } from "../../Redux/LocalURIs/ActionCreator";

export default function Pdfs(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const localURIs = useSelector((state) => state.uris);
  const dispatch = useDispatch();
  const [pdfs, setPdfs] = useState([]);
  const [pdfName, setPdfName] = useState("");
  const [namePdfDilogueVisible, setNamePdfDilogueVisible] = useState(false);
  const [uploadablePDFData, setuploadablePDFData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showActionSheetWithOptions } = useActionSheet();

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingVertical: 14, paddingHorizontal: 30 }}
            onPress={getUploadablePDF}
            // onLongPress={() => props.navigation.navigate("UploadImages")}
            // delayLongPress={10000}
          >
            <Feather name="paperclip" color={colors.textOne} size={23} />
          </TouchableOpacity>
        );
      },
    });
  };

  const getUploadablePDF = async () => {
    const { status, result } = await pickDocuments();
    // console.log({ status, result });
    if (status) {
      setuploadablePDFData(result);
      setNamePdfDilogueVisible(true);
      setPdfName(result.name.split(".")[0]);
    } else dispatch(showSnack("Oops!! PDF not selected. Please try again"));
  };

  const uploadPdf = async () => {
    try {
      if (pdfName.length < 1) {
        dispatch(showSnack("Enter PDF name"));
        return;
      }
      dispatch(showSnack("Uploading PDF..."));
      const pdfData = { ...uploadablePDFData };
      pdfData.name = pdfName + ".pdf";
      // console.log(pdfData);
      setNamePdfDilogueVisible(false);
      await uploadPdfToServer(pdfData, auth.currentUser.uid, (mess) =>
        dispatch(showSnack(mess))
      ).then(() => {
        getPdfs();
      });
      setPdfName("");
      setuploadablePDFData(null);
    } catch (error) {}
  };

  const getPdfs = () => {
    // console.log("getting pdfs");
    if (!auth.currentUser) {
      dispatch(showSnack("Couldn't load pdfs, Authentication error"));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    firestore
      .collection("scannedPdfs")
      // .where("isDeleted", "==", false)
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
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
        dispatch(showSnack("Couldn't load pdfs"));
      });
  };

  const openPdfOptions = (pdf) => {
    const options = ["Delete", "Share", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;
    const containerStyle = { backgroundColor: colors.backTwo };
    const textStyle = { color: colors.textOne };
    const message = pdf.pdfName;
    const messageTextStyle = { color: colors.textOne, fontSize: 16 };
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
          openORSharePDF(pdf, 2);
          return;
        }
      }
    );
  };

  const openORSharePDF = async (pdfData, openOrShare = 0) => {
    try {
      setIsLoading(true);
      // check if this uri is present in global state (ie. in localUris.pdfURIs array)
      let indexOfLocalURI = localURIs.pdfURIs.findIndex(
        (x) => x.id === pdfData._id
      );
      // present
      if (indexOfLocalURI >= 0) {
        // check if we want to view the image or share the image
        if (openOrShare === 1) {
          // view
          openFile(localURIs.pdfURIs[indexOfLocalURI].uri)
            ? null
            : dispatch(
                showSnack("Opps!! Error while opening PDF, please try again.")
              );
          setIsLoading(false);
        } else if (openOrShare === 2) {
          // share
          shareThings(localURIs.pdfURIs[indexOfLocalURI].uri)
            ? null
            : dispatch(
                showSnack("Opps!! Error while sharing PDF, please try again.")
              );
          setIsLoading(false);
        }
      }
      // not present
      else {
        // console.log("not present");
        // save to device
        const { status, localUri } = await saveToDevice(
          pdfData.pdf,
          pdfData.pdfName
        );
        // check save status
        if (!status) {
          dispatch(
            showSnack("Opps!! Error while opening PDF, please try again.")
          );
          setIsLoading(false);
          return;
        }
        // add uri to global store for reuse
        dispatch(addPdfUri({ id: pdfData._id, uri: localUri.uri }));
        // check if we want to view the image or share the image
        if (openOrShare === 1) {
          // view
          openFile(localUri.uri)
            ? null
            : dispatch(
                showSnack("Opps!! Error while opening image, please try again.")
              );
        } else if (openOrShare === 2) {
          // share
          shareThings(localUri.uri)
            ? null
            : dispatch(
                showSnack("Opps!! Error while sharing PDF, please try again.")
              );
        }
      }
      setIsLoading(false);
    } catch (err) {
      dispatch(showSnack("Opps!! Error while opening PDF." + err.message));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setHeaderOptions();
    getPdfs();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      {isLoading && <CustomActivityIndicator />}
      <RenderPdfTile
        pdfs={pdfs}
        onLongPress={(pdf) => openPdfOptions(pdf)}
        onPress={(pdfData) => openORSharePDF(pdfData, 1)}
      />
      <Prompt
        title={"Enter PDF name"}
        text={pdfName}
        setText={(txt) => setPdfName(txt)}
        onCancelPress={() => {
          setNamePdfDilogueVisible(false);
          setPdfName("");
          setuploadablePDFData(null);
        }}
        onOkPress={() => uploadPdf()}
        visible={namePdfDilogueVisible}
        hotBtnText={"Upload PDF"}
        placeholderTxt={"PDF name (without extension)"}
      />
    </SafeAreaView>
  );
}
