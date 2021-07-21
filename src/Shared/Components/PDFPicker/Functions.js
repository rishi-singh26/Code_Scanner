import { auth, cloudStorage, firestore } from "../../../Constants/Api";
import * as DocumentPicker from "expo-document-picker";

/**
 *
 * @param {Function} optionalFunc
 * @returns {Object} - { status, result }
 */
export async function pickDocuments(optionalFunc = () => {}) {
  try {
    let result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      type: "application/pdf",
    });
    // console.log(result);
    if (result.type === "cancel") {
      return { status: false, result: null };
    }
    optionalFunc();
    return { status: true, result };
  } catch (err) {
    console.log("Error in picking document on FUNCTIONS", err.message);
    return { status: false, result: null };
  }
}

/**
 * Uploads one pdf to firebase storage.
 * @param {Object} file
 * @param {String} path - cloud storage path where pdf is to be stored
 * @returns {Object} {status: Boolean, downloadUri: URL}
 * file must be like the default object returned by expo document picker
 * {
      "name": Strin,
      "size": number,
      "type": "String",
      "uri": "image uri in local file system",
    }
 */
export async function uploadPdfToServer(file, path) {
  console.log("Uploading selected pdf...");
  const reference = cloudStorage.ref(
    `${path}${file.name}${auth.currentUser.uid}`
  );
  const response = await fetch(file.uri);
  const blob = await response.blob();

  try {
    const result = await reference.put(blob);
    const pdfDownloadURL = await reference.getDownloadURL();
    console.log("Here is the PDF download url", pdfDownloadURL);
    return { status: true, downloadUri: pdfDownloadURL };
  } catch (err) {
    console.log("Error in uploading pdf to server PDF FUNCTIONS", err.message);
    return { status: false, downloadUri: null };
  }
}
