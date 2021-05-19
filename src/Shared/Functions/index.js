import { Platform } from "react-native";
import * as Contacts from "expo-contacts";
import * as ImagePicker from "expo-image-picker";
import Clipboard from "expo-clipboard";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { auth, cloudStorage, firestore } from "../../Constants/Api";
import * as DocumentPicker from "expo-document-picker";
import CryptoJS from "react-native-crypto-js";
import * as LocalAuthentication from "expo-local-authentication";

export function validateEmail(email) {
  // this is also an option for email regx
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const emailRe =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRe.test(String(email).toLowerCase());
}

// Validated whatsapp text links for indian phone numbers ie starting with 91
export function validateWaLinkForINNum(link) {
  const regex =
    /https:\/\/wa\.me\/91(?:\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$)/;
  return regex.test(String(link).toLowerCase());
}

export function validateUrl(value) {
  const urlRegex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  return urlRegex.test(value);
}

export function sortArrayOfObjs(array, sortingKey) {
  const sortedArray = [...array];

  sortedArray.length > 1
    ? sortedArray.sort((a, b) =>
        a[sortingKey] < b[sortingKey]
          ? 1
          : b[sortingKey] < a[sortingKey]
          ? -1
          : 0
      )
    : null;

  // console.log("Here is the sorted array", sortedArray);

  return sortedArray;
}

export async function copyToClipboard(data) {
  try {
    Clipboard.setString(data);
    return true;
  } catch (error) {
    console.log("Error in copying to clipboard FUNCTIONS", error.message);
    return false;
  }
}

export function createQRString(data) {
  const name = data.firstName;
  const fullName = data.name;
  let phoneNumbers = "";
  let emails = "";
  // \n TEL;TYPE=CELL:+916362056288
  data.phoneNumbers
    ? data.phoneNumbers.map((item) => {
        phoneNumbers += `\nTEL;TYPE=CELL:${item.number}`;
      })
    : null;
  data.emails
    ? data.emails.map((item) => {
        emails += `\nEMAIL;TYPE=HOME:${item.email}`;
      })
    : null;
  const string = `BEGIN:VCARD\nVERSION:3.0\nN:;${name};;;\nFN:${fullName}${phoneNumbers}\n${emails}\nEND:VCARD`;
  // console.log(string);
  return string;
}

export async function isContactsApiAvailable() {
  const isAvailable = await Contacts.isAvailableAsync();
  return isAvailable;
}

export function isContactInfo(string) {
  const isContact = string ? string.includes("BEGIN:VCARD") : false;
  return isContact;
}

export async function addToContacts(data) {
  try {
    if (isContactsApiAvailable()) {
      // console.log(data);
      const contactData = {
        [Contacts.Fields.FirstName]: "Bird",
        [Contacts.Fields.LastName]: "Man",
        [Contacts.Fields.Company]: "Young Money",
        [Contacts.Fields.PhoneNumbers]: [
          {
            number: "(123) 456-7890",
            isPrimary: true,
            digits: "1234567890",
            countryCode: "IN",
            id: "1",
            label: "main",
          },
        ],
        [Contacts.Fields.Emails]: [
          {
            email: "test@gmail.com",
            isPrimary: true,
            id: "2",
            label: "main",
          },
        ],
      };
      const contactId = await Contacts.addContactAsync(contactData);
    }
  } catch (error) {
    console.log(error.message);
    alert("Contact was not added!");
  }
}

export function searchScannedDataTitle(data, searchKey) {
  var finalArr = [];
  data.map((item) => {
    if (item.title) {
      searchKey.toUpperCase().includes(item.title.toUpperCase()) ||
      item.title.toUpperCase().includes(searchKey.toUpperCase())
        ? finalArr.push(item)
        : null;
    }
  });

  return finalArr;
}

export function searchContacts(data, searchKey) {
  const finalArr = [];
  data.map((item) => {
    if (item.name) {
      searchKey.toUpperCase().includes(item.name.toUpperCase()) ||
      item.name.toUpperCase().includes(searchKey.toUpperCase())
        ? finalArr.push(item)
        : null;
    }
  });
  return finalArr;
}

export function getDataObj(data) {
  // gets contact details from text scanned from a contact QR code.
  const dataObj = {
    phoneNumbers: [],
    emails: [],
    urls: [],
  };
  let lines = data.split("\n");
  // split the text into array of strings
  for (var line of lines) {
    // for each string
    var typeAndValue = line.split(":;", 2);
    for (var x of typeAndValue) {
      if (x.includes("TEL;TYPE=CELL")) {
        dataObj.phoneNumbers.push({
          phoneNumber: x.split(":").pop().trim(),
          type: "Home",
          data: x,
        });
      }
      if (x.includes("TEL;TYPE=WORK")) {
        dataObj.phoneNumbers.push({
          phoneNumber: x.split(":").pop().trim(),
          type: "Work",
          data: x,
        });
      }
      if (x.includes("EMAIL;TYPE=HOME")) {
        dataObj.emails.push({
          email: x.split(":").pop().trim(),
          type: "Home",
          data: x,
        });
      }
      if (x.includes("EMAIL;TYPE=INTERNET")) {
        dataObj.emails.push({
          email: x.split(":").pop().trim(),
          type: "Internet",
          data: x,
        });
      }
      if (x.includes("EMAIL;TYPE=HOME,INTERNET")) {
        dataObj.emails.push({
          email: x.split(":").pop().trim(),
          type: "Home & Internet",
          data: x,
        });
      }
      if (x.includes("FN")) {
        dataObj.fullName = {
          name: x.split(":").pop().trim(),
          type: "Full name",
          data: x,
        };
      }
      if (
        x.includes("N:") &&
        !x.includes("FN") &&
        !x.includes("BEGIN") &&
        !x.includes("VERSION")
      ) {
        const nameArr = x.split(":")[1].split(";");
        console.log("Here is the names arr", nameArr);
        dataObj.nameComponents = {
          lastName: nameArr[0],
          firstName: nameArr[1],
          title: nameArr[3],
          type: "Name Components",
          data: x,
        };
      }
      if (x.includes("URL")) {
        dataObj.urls.push = {
          url: x.split(":").pop().trim(),
          type: "Url",
          data: x,
        };
      }
      if (x.includes("TITLE")) {
        dataObj.title = {
          title: x.split(":").pop().trim(),
          type: "Title",
          data: x,
        };
      }
      if (x.includes("ORG")) {
        dataObj.organisation = {
          org: x.split(":").pop().trim(),
          type: "Organisation",
          data: x,
        };
      }
    }
  }
  return dataObj;
}

/**
 *
 * @param {Function} optionalFunc
 * pass an optional function to run after the image has been picked successfully
 * opens image picjer native app
 */
export async function pickImage(optionalFunc = () => {}) {
  if (Platform.OS === "web") {
    alert("Device not supported.");
    return { status: false, result: null };
  }
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need camera roll permissions to make this work!");
    return { status: false, result: null };
  }
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 0.5,
    });
    // console.log(result);
    optionalFunc();
    return { status: true, result };
  } catch (err) {
    console.log(err.message);
    return { status: false, result: null };
  }
}

/**
 *
 * @param {String} scannedData
 * creates a pdf of the string being passed and opens the share sheet for sharing that pdf
 * returns an object with status and uri of the pdf
 */
export async function shareScannedDataPdf(scannedData) {
  // console.log(scannedData);
  try {
    const pdf = await Print.printToFileAsync({
      html: scannedData,
      base64: true,
    });
    // console.log(pdf.uri);
    return { status: true, pdfUri: pdf.uri };
  } catch (error) {
    console.log(error.message);
    return { status: false, pdfUri: null };
  }
}

/**
 *
 * @param {string} uri
 * pass uri of an image or pdf and it will open the native sharing sheet
 */
export async function shareThings(uri) {
  console.log("sharing uri ", uri);
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      alert("Oops!! Sharing is not supported on your device.");
      return;
    }
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 *
 * @param {Object} imageData
 * @param {String} userId
 * @param {Function} optionalFunc
 * image data must be like
 * { image: "image uri", name: "image name" }
 * uploads one image to firebase storage. The image data provided must be an Object then uploads that url to firestore to be used in the app returns an object { status, downloadUri }
 */
export async function uploadImageToServer(
  imageData,
  userId,
  optionalFunc = () => {}
) {
  console.log("Starting upload");
  const response = await fetch(imageData.image);
  const blob = await response.blob();

  try {
    const result = await cloudStorage
      .ref()
      .child("scanner/images/" + imageData.name)
      .put(blob);

    var photoDownloadURLRef = cloudStorage.ref(result.metadata.fullPath);
    const photoDownloadURL = await photoDownloadURLRef.getDownloadURL();
    console.log(
      "Here is the download url",
      photoDownloadURL,
      "\nUploading to firestore"
    );
    await uploadImageUrl(
      {
        uploadDate: new Date(),
        userId,
        image: photoDownloadURL,
        imageName: imageData.name,
        isDeleted: false,
      },
      optionalFunc
    );
    return { status: true, downloadUri: photoDownloadURL };
  } catch (err) {
    console.log("Error in uploading iamge to server FUNCTIONS", err.message);
    return { status: false, downloadUri: null };
  }
}

export async function uploadImageUrl(imageData, optionalFunc) {
  await firestore
    .collection("scannerImages")
    .add(imageData)
    .then(() => {
      optionalFunc();
      return true;
    })
    .catch((err) => {
      console.log(err.message);
      return false;
    });
}

/**
 *
 * @param {String} docId
 * @param {Function} optionalFunc
 */
export async function deleteImage(image, optionalFunc = () => {}) {
  await cloudStorage
    .ref()
    .child("scanner/images/" + image.imageName)
    .delete()
    .then(() => {
      firestore
        .collection("scannerImages")
        .doc(image._id)
        .delete()
        .then(() => {
          optionalFunc("Deleted");
        })
        .catch((err) => {
          console.log(err.message);
          optionalFunc("Not deleted");
        });
    });
}

export async function pickDocuments(optionalFunc = () => {}) {
  try {
    let result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      type: "application/pdf",
    });
    console.log(result);
    if (result.type === "cancel") {
      return { status: false, pdfData: null };
    }
    optionalFunc();
    return { status: true, result };
  } catch (err) {
    console.log("Error in picking document on FUNCTIONS", err.message);
    return { status: false, result: null };
  }
}

export async function uploadPdfToServer(file, userId, optionalFunc = () => {}) {
  optionalFunc("Uploading selected pdf...");
  console.log("Uploading selected pdf...");
  const reference = cloudStorage.ref(`scanner/pdfs/${file.name}`);
  const response = await fetch(file.uri);
  const blob = await response.blob();

  const result = await reference.put(blob);

  const pdfDownloadURL = await reference.getDownloadURL();

  console.log(
    "Here is the PDF download url",
    pdfDownloadURL,
    "\nUploading to firestore"
  );
  firestore
    .collection("scannedPdfs")
    .add({
      uploadDate: new Date(),
      userId,
      pdfName: file.name,
      pdf: pdfDownloadURL,
      isDeleted: false,
    })
    .then(() => {
      console.log("Upload success");
      optionalFunc("Pdf uploaded");
    })
    .catch((err) => {
      console.log("Err in uploading pdf", err.message);
      optionalFunc("Pdf NOT uploaded!!!");
    });
}

/**
 *
 * @param {String} text
 * @param {String} password
 * pass in the text and the encryption key
 */
export async function encryptText(text, password) {
  try {
    const encryptedData = await CryptoJS.AES.encrypt(text, password).toString();
    return { status: true, data: encryptedData };
  } catch (error) {
    return { status: false, data: null };
  }
}

/**
 *
 * @param {String} text
 * @param {String} password
 * pass in the text and the decryption key
 */
export async function decryptText(text, password) {
  try {
    let bytes = await CryptoJS.AES.decrypt(text, password);
    const decryptedData = await bytes.toString(CryptoJS.enc.Utf8);
    return { status: true, data: decryptedData };
  } catch (error) {
    return { status: false, data: null };
  }
}

/**
 * returns a boolean ie true or false after local authentication
 */
export async function localAuth() {
  if (
    (await LocalAuthentication.isEnrolledAsync()) &&
    (await LocalAuthentication.isEnrolledAsync())
  ) {
    try {
      const authData = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authentication required",
        fallbackLabel: "Use passcode",
        cancelLabel: "Cancel",
      });
      return authData.success;
    } catch (err) {
      console.log("Error in local auth FUNCTIONS", err.message);
      return false;
    }
  } else {
    return true;
  }
}

/**
 *
 * @param {Array} passwordsArray
 * An array of objects, [{ email:, password, description }]
 * @param {String} encryptionKey
 * The password used to encrypt the passwords
 * Returns an array of objects in which email password and description is encrypted
 */
export async function encryptPasswords(passwordsArray, encryptionKey) {
  try {
    let error = false;
    const encryptedPassowordsArr = [];
    for (var i = 0; i < passwordsArray.length; i++) {
      const { email, password, description } = passwordsArray[i];
      const { status: emailEncryptionStat, data: encryptedEmail } =
        await encryptText(email, encryptionKey);
      const { status: passEncryptionStatus, data: encryptedPassword } =
        await encryptText(password, encryptionKey);
      const { status: descEncryptionStatus, data: enctyptedDesc } =
        await encryptText(description, encryptionKey);
      if (
        !emailEncryptionStat ||
        !passEncryptionStatus ||
        !descEncryptionStatus
      ) {
        error = true;
      }
      encryptedPassowordsArr.push({
        email: encryptedEmail,
        password: encryptedPassword,
        description: enctyptedDesc,
      });
    }
    if (error) {
      return { status: false, data: null };
    }
    return { status: true, data: encryptedPassowordsArr };
  } catch (err) {
    console.log("Error in ENCRYPTING passwords on FUNCTIONS\n", err.message);
    return { status: false, data: null };
  }
}

/**
 *
 * @param {Array} passwordsArray
 * An array of objects, [{ email, password, description }]
 * @param {String} decryptionKey
 * The password used to decrypt the passwords
 * Returns an array of objects in which email password and description is decrypted
 */
export async function decryptPasswords(passwordsArray, decryptionKey) {
  try {
    let error = false;
    const decryptedPassowordsArr = [];
    for (var i = 0; i < passwordsArray.length; i++) {
      const { email, password, description } = passwordsArray[i];
      const { status: emailDecryptionStat, data: decryptedEmail } =
        await decryptText(email, decryptionKey);
      const { status: passDecryptionStatus, data: decryptedPassword } =
        await decryptText(password, decryptionKey);
      const { status: descDecryptionStatus, data: dectyptedDesc } =
        await decryptText(description, decryptionKey);
      if (
        !emailDecryptionStat ||
        !passDecryptionStatus ||
        !descDecryptionStatus
      ) {
        error = true;
      }
      decryptedPassowordsArr.push({
        email: decryptedEmail,
        password: decryptedPassword,
        description: dectyptedDesc,
      });
    }
    if (error) {
      return { status: false, data: null };
    }
    return { status: true, data: decryptedPassowordsArr };
  } catch (err) {
    console.log("Error in DECRYPTING passwords on FUNCTIONS\n", err.message);
    return { status: false, data: null };
  }
}
