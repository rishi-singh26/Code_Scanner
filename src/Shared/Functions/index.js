import { Linking, Platform, Share } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import Clipboard from 'expo-clipboard';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {
  auth,
  cloudStorage,
  firestore,
  geoCoderApi,
} from '../../Constants/Api';
import * as DocumentPicker from 'expo-document-picker';
import CryptoJS from 'react-native-crypto-js';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';

export function validateEmail(email) {
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

export function validateUPIUrl(value) {
  const UPIRegex =
    /^(?:(?:(?:upi?|upi):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  return UPIRegex.test(value);
}

/**
 *
 * @param {Array} array
 * @param {String} sortingKey
 * @returns {Array}
 */
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

/**
 *
 * @param {String} data
 * @returns Boolean
 */
export async function copyToClipboard(data) {
  try {
    Clipboard.setString(data);
    return true;
  } catch (error) {
    console.log('Error in copying to clipboard FUNCTIONS', error.message);
    return false;
  }
}

export function createQRString(data) {
  const name = data.firstName;
  const fullName = data.name;
  let phoneNumbers = '';
  let emails = '';
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
  const isContact = string ? string.includes('BEGIN:VCARD') : false;
  return isContact;
}

export async function addToContacts(data) {
  try {
    if (isContactsApiAvailable()) {
      // console.log(data);
      const contactData = {
        [Contacts.Fields.FirstName]: 'Bird',
        [Contacts.Fields.LastName]: 'Man',
        [Contacts.Fields.Company]: 'Young Money',
        [Contacts.Fields.PhoneNumbers]: [
          {
            number: '(123) 456-7890',
            isPrimary: true,
            digits: '1234567890',
            countryCode: 'IN',
            id: '1',
            label: 'main',
          },
        ],
        [Contacts.Fields.Emails]: [
          {
            email: 'test@gmail.com',
            isPrimary: true,
            id: '2',
            label: 'main',
          },
        ],
      };
      const contactId = await Contacts.addContactAsync(contactData);
    }
  } catch (error) {
    console.log(error.message);
    alert('Contact was not added!');
  }
}

/**
 *
 * @param {Array} data
 * @param {String} searchKey
 * @returns {Array}
 */
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

/**
 *
 * @param {Array} data
 * @param {String} searchKey
 * @returns {Array} Array of passwrds after searching
 */
export function searchPasswords(data, searchKey) {
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

/**
 *
 * @param {Array} data
 * @param {String} searchKey
 * @returns {Array}
 */
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
  let lines = data.split('\n');
  // split the text into array of strings
  for (var line of lines) {
    // for each string
    var typeAndValue = line.split(':;', 2);
    for (var x of typeAndValue) {
      if (x.includes('TEL;TYPE=CELL')) {
        dataObj.phoneNumbers.push({
          phoneNumber: x.split(':').pop().trim(),
          type: 'Home',
          data: x,
        });
      }
      if (x.includes('TEL;TYPE=WORK')) {
        dataObj.phoneNumbers.push({
          phoneNumber: x.split(':').pop().trim(),
          type: 'Work',
          data: x,
        });
      }
      if (x.includes('EMAIL;TYPE=HOME')) {
        dataObj.emails.push({
          email: x.split(':').pop().trim(),
          type: 'Home',
          data: x,
        });
      }
      if (x.includes('EMAIL;TYPE=INTERNET')) {
        dataObj.emails.push({
          email: x.split(':').pop().trim(),
          type: 'Internet',
          data: x,
        });
      }
      if (x.includes('EMAIL;TYPE=HOME,INTERNET')) {
        dataObj.emails.push({
          email: x.split(':').pop().trim(),
          type: 'Home & Internet',
          data: x,
        });
      }
      if (x.includes('FN')) {
        dataObj.fullName = {
          name: x.split(':').pop().trim(),
          type: 'Full name',
          data: x,
        };
      }
      if (
        x.includes('N:') &&
        !x.includes('FN') &&
        !x.includes('BEGIN') &&
        !x.includes('VERSION')
      ) {
        const nameArr = x.split(':')[1].split(';');
        console.log('Here is the names arr', nameArr);
        dataObj.nameComponents = {
          lastName: nameArr[0],
          firstName: nameArr[1],
          title: nameArr[3],
          type: 'Name Components',
          data: x,
        };
      }
      if (x.includes('URL')) {
        dataObj.urls.push = {
          url: x.split(':').pop().trim(),
          type: 'Url',
          data: x,
        };
      }
      if (x.includes('TITLE')) {
        dataObj.title = {
          title: x.split(':').pop().trim(),
          type: 'Title',
          data: x,
        };
      }
      if (x.includes('ORG')) {
        dataObj.organisation = {
          org: x.split(':').pop().trim(),
          type: 'Organisation',
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
export async function pickImage(base64 = false) {
  if (Platform.OS === 'web') {
    alert('Device not supported.');
    return { status: false, result: null };
  }
  console.log('Not on web');
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return { status: false, result: null };
  }
  // console.log("Permission granted");
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
      base64: base64,
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
 * @param {String} uri
 * @returns Boolean
 */
export async function shareThings(uri) {
  // console.log("sharing uri ", uri);
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return false;
    }
    const result = await Sharing.shareAsync(uri);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

/**
 *
 * @param {Object} imageData
 * @param {Boolean} shouldUploadImage
 * @param {String} userId
 * @param {Function} optionalFunc
 * @returns {Object} {status: Boolean, downloadUri: URL}
 * image data must be like
 * { image: "image uri", name: "image name" }
 * uploads one image to firebase storage. The image data provided must be an Object then uploads that url to firestore to be used in the app returns an object { status, downloadUri }
 */
export async function uploadImageToServer(
  imageData,
  shouldUploadImage = true,
  userId = '',
  optionalFunc = () => { }
) {
  // console.log("Starting upload");
  const response = await fetch(imageData.image);
  const blob = await response.blob();

  try {
    const result = await cloudStorage
      .ref()
      .child('scanner/images/' + imageData.name)
      .put(blob);

    var photoDownloadURLRef = cloudStorage.ref(result.metadata.fullPath);
    const photoDownloadURL = await photoDownloadURLRef.getDownloadURL();
    // console.log(
    //   "Here is the download url",
    //   photoDownloadURL,
    //   "\nUploading to firestore"
    // );
    shouldUploadImage
      ? await uploadImageUrl(
        {
          uploadDate: new Date(),
          userId,
          image: photoDownloadURL,
          imageName: imageData.name,
          isDeleted: false,
        },
        optionalFunc
      )
      : null;
    return { status: true, downloadUri: photoDownloadURL };
  } catch (err) {
    console.log(
      'Error in uploading iamge to server FUNCTIONS',
      err.message
    );
    return { status: false, downloadUri: null };
  }
}

export async function uploadImageUrl(imageData, optionalFunc) {
  if (!auth.currentUser) {
    optionalFunc('Authentication error, please logout and login again');
    return;
  }
  await firestore
    .collection('scannerImages')
    .add(imageData)
    .then(() => {
      optionalFunc('Image uploaded successfully');
      return true;
    })
    .catch((err) => {
      optionalFunc(
        'Error while uploading image, please try again\n' + err.message
      );
      console.log(err.message);
      return false;
    });
}

/**
 *
 * @param {Object} image
 * {image: "image uri", imageName: "image name", _id: "image id"}
 * @param {Function} optionalFunc
 */
export async function deleteImage(image, optionalFunc = () => { }) {
  image.isEncrypted // if true then image is encrypted and only base64 string needs to be deleted from cloud firestore
    ? firestore
      .collection('scannerImages')
      .doc(image._id)
      .delete()
      .then(() => {
        optionalFunc('Deleted');
      })
      .catch((err) => {
        console.log(err.message);
        optionalFunc('Not deleted');
      })
    : await cloudStorage
      .ref()
      .child('scanner/images/' + image.imageName)
      .delete()
      .then(() => {
        firestore
          .collection('scannerImages')
          .doc(image._id)
          .delete()
          .then(() => {
            optionalFunc('Deleted');
          })
          .catch((err) => {
            console.log(err.message);
            optionalFunc('Not deleted');
          });
      });
}

/**
 *
 * @param {Object} pdf
 * {}
 * @param {Function} optionalFunc
 */
export async function deletePdf(pdf, optionalFunc = () => { }) {
  await cloudStorage
    .ref()
    .child('scanner/pdfs/' + pdf.pdfName)
    .delete()
    .then(() => {
      firestore
        .collection('scannedPdfs')
        .doc(pdf._id)
        .delete()
        .then(() => {
          optionalFunc('Deleted');
        })
        .catch((err) => {
          console.log(err.message);
          optionalFunc('Not deleted');
        });
    })
    .catch((err) => {
      optionalFunc('Not deleted\n' + err.message);
    });
}

export async function pickDocuments(optionalFunc = () => { }) {
  try {
    let result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      type: 'application/pdf',
    });
    // console.log(result);
    if (result.type === 'cancel') {
      return { status: false, result: null };
    }
    optionalFunc();
    return { status: true, result };
  } catch (err) {
    console.log('Error in picking document on FUNCTIONS', err.message);
    return { status: false, result: null };
  }
}

export async function uploadPdfToServer(file, userId, optionalFunc = () => { }) {
  optionalFunc('Uploading selected pdf...');
  console.log('Uploading selected pdf...');
  const reference = cloudStorage.ref(`scanner/pdfs/${file.name}`);
  const response = await fetch(file.uri);
  const blob = await response.blob();

  const result = await reference.put(blob);

  const pdfDownloadURL = await reference.getDownloadURL();

  console.log(
    'Here is the PDF download url',
    pdfDownloadURL,
    '\nUploading to firestore'
  );
  firestore
    .collection('scannedPdfs')
    .add({
      uploadDate: new Date(),
      userId,
      pdfName: file.name,
      pdf: pdfDownloadURL,
      isDeleted: false,
    })
    .then(() => {
      console.log('Upload success');
      optionalFunc('Pdf uploaded');
    })
    .catch((err) => {
      console.log('Err in uploading pdf', err.message);
      optionalFunc('Pdf NOT uploaded!!!');
    });
}

/**
 *
 * @param {String} text
 * @param {String} password
 * @returns {String} encrypted text
 * pass in the text and the encryption key
 */
export async function encryptText(text, password) {
  try {
    const encryptedData = await CryptoJS.AES.encrypt(
      text,
      password
    ).toString();
    return { status: true, data: encryptedData };
  } catch (error) {
    return { status: false, data: null };
  }
}

/**
 *
 * @param {String} text
 * @param {String} password
 * @returns {String} decrypted text
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
 * @returns {Boolean}
 * returns a boolean ie true or false after local authentication
 */
export async function localAuth() {
  if (
    (await LocalAuthentication.isEnrolledAsync()) &&
    (await LocalAuthentication.isEnrolledAsync())
  ) {
    try {
      const authData = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authentication required',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
      });
      return authData.success;
    } catch (err) {
      console.log('Error in local auth FUNCTIONS', err.message);
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
 * @returns {Array}
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
    console.log(
      'Error in ENCRYPTING passwords on FUNCTIONS\n',
      err.message
    );
    return { status: false, data: null };
  }
}

/**
 *
 * @param {Array} passwordsArray
 * An array of objects, [{ email, password, description }]
 * @param {String} decryptionKey
 * The password used to decrypt the passwords
 * @returns {Array}
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
    console.log(
      'Error in DECRYPTING passwords on FUNCTIONS\n',
      err.message
    );
    return { status: false, data: null };
  }
}

/**
 *
 * @param {FirebaseDate} firebaseDate {seconds, nanoseconds}
 * @returns {Date} - Date object
 */
export function convertFirebaseDateToDate(firebaseDate) {
  // var date = new Date(dateInMillis).toDateString() + ' at ' + new Date(dateInMillis).toLocaleTimeString()
  // get date in miliseconds
  const dateInMillis = firebaseDate.seconds * 1000;
  // create a date with that data
  const date = new Date(dateInMillis);
  return date;
}

/**
 *
 * @param {Function} authErr
 * @param {Function} successFunc
 * @param {Function} errorFunc
 * @param {String} title
 * @returns
 */
export async function createFuelLogger(authErr, successFunc, errorFunc, title) {
  if (!auth.currentUser) {
    authErr();
    return;
  }
  await firestore
    .collection('loggers')
    .add({
      userId: auth.currentUser.uid,
      creationDate: new Date(),
      title,
      loggerType: 'Fuel logger',
      loggerTypeId: 1,
    })
    .then(() => {
      successFunc();
    })
    .catch((err) => {
      errorFunc();
      console.log('Error while creating fuel logger', err.message);
    });
}

/**
 * checks is the enterd text is an integer number and does not contain any alphabetical characters
 * @param {String} text
 * @returns Boolean
 */
export function validateInteger(text) {
  // check if the length of the text is equal to zero
  // if yes then clear the text field ie. set the value to an empty string.
  if (text.length == 0) {
    return true;
  }
  const validator = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
  // checks if the text is an positive integer or a decimal point number.
  // will accept 1, 12, 1.5, +1, +1.5,
  // will not accept -> ., 1..5, 1.2.3, -1
  if (!validator.test(text)) {
    return false;
  }
  return true;
}

/**
 * Gets user location and returns an object
 * @returns {Object} - { location(Object), errmess(String), status(Boolean) }
 */
export async function getLocation() {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // console.log("Permission to access location was denied");
      return {
        location: null,
        errmess: 'Permission denied',
        status: false,
      };
    }
    let location = await Location.getCurrentPositionAsync({});
    // console.log("Here is locatio data", location);
    return { location: location, errmess: null, status: true };
  } catch (err) {
    return { location: null, errmess: err.message, status: false };
  }
}

/**
 * Gets user address from location and returns an object
 * @returns - { results(Array), message(String), status(Boolean) }
 */
export async function getUserPlace() {
  const { status, errmess, location } = await getLocation();
  if (!status) {
    return { status: false, message: errmess };
  }
  const latLong = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  // console.log(latLong);
  const url = geoCoderApi(latLong.latitude, latLong.longitude);

  try {
    const data = await fetch(url);
    const addressData = await data.json();
    const { total_results, results } = addressData;

    return { status: true, results, message: 'Success' };
  } catch (err) {
    const data = { status: false, message: err.message };
    console.log(data);
    return data;
  }
}

/**
 *
 * @param {Object} addressComponents
 * @returns {Object}
 */
export function getAddressComponents(addressComponents) {
  const placeName =
    addressComponents?.city ||
    addressComponents?.town ||
    addressComponents?.village;
  const district = addressComponents?.state_district;
  const road = addressComponents?.road;
  const county = addressComponents?.county;
  const state = addressComponents?.state;
  const state_code = addressComponents?.state_code;
  const country = addressComponents?.country;
  const country_code = addressComponents?.country_code;

  const data = {
    placeName,
    district,
    road,
    county,
    state,
    state_code,
    country,
    country_code,
    status: true,
    message: 'Success',
  };
  return data;
}

/**
 * Returns a google map url string
 * @param {object} coords
 * @returns String
 */
export function getMapUrl(coords) {
  return `http://www.google.com/maps/place/${coords.latitude},${coords.longitude}`;
}

/**
 * Opens a url
 * @param {String} url
 * @returns Boolean
 */
export function openUrl(url) {
  if (Linking.canOpenURL(url)) {
    Linking.openURL(url);
    return true;
  }
  return false;
}

/**
 * Share text using native sharing sheet
 * @param {String} message
 * @returns Boolean
 */
export async function shareText(message) {
  try {
    const result = await Share.share({
      message: message,
      // title: "This is title",
      // url: "https://google.com",
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
      return true;
    } else if (result.action === Share.dismissedAction) {
      return false;
      // dismissed
    }
  } catch (error) {
    return false;
  }
}

/**
 * Ensures a directory exixts
 * @param {String} fileDir
 */
export async function ensureDirExists(fileDir) {
  const dirInfo = await FileSystem.getInfoAsync(fileDir);
  if (!dirInfo.exists) {
    console.log("File directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(fileDir, { intermediates: true });
  }
}

/**
 *
 * @param {String} uri
 * @param {String} fileName
 * @returns Object {status, localUri}
 */
export async function saveToDevice(uri, fileName) {
  // 'http://techslides.com/demos/sample-videos/small.mp4'
  try {
    const fileDir = FileSystem.cacheDirectory + 'scanner/';
    await ensureDirExists(fileDir);
    const localUri = await FileSystem.downloadAsync(
      uri,
      fileDir + fileName
    );
    // console.log("Here is uri after saving", localUri);
    return { status: true, localUri };
  } catch (err) {
    console.log('error in saving image', err);
    return { status: false, localUri: null };
  }
}

/**
 * Opens a file, by taking local uri as input
 * @param {String} uri
 */
export async function openFile(uri) {
  try {
    FileSystem.getContentUriAsync(uri).then((cUri) => {
      console.log(cUri);
      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: cUri,
        flags: 1,
      });
    });
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}
