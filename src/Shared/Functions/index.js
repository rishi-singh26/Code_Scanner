import Toast from "react-native-simple-toast";
import { Alert, Clipboard, Platform } from "react-native";
import * as Contacts from "expo-contacts";
import * as ImagePicker from "expo-image-picker";

export function validateEmail(email) {
  // this is also an option for email regx
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRe.test(String(email).toLowerCase());
}

// Validated whatsapp text links for indian phone numbers ie starting with 91
export function validateWaLinkForINNum(link) {
  const regex = /https:\/\/wa\.me\/91(?:\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$)/;
  return regex.test(String(link).toLowerCase());
}

export function validateUrl(value) {
  const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  return urlRegex.test(value);
}

export function toast(message) {
  Toast.show(message, Toast.SHORT);
}

export function customAlert(message, text, onOkPress, cancelable = true) {
  Alert.alert(
    message,
    text,
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => onOkPress(),
        style: "default",
      },
    ],
    { cancelable: cancelable }
  );
}

export function sortArrayOfObjs(array, sortingKey) {
  const sortedArray = [...array];

  sortedArray.sort((a, b) =>
    a[sortingKey] < b[sortingKey] ? 1 : b[sortingKey] < a[sortingKey] ? -1 : 0
  );

  // console.log("Here is the sorted array", sortedArray);

  return sortedArray;
}

export function copyToClipboard(data) {
  Clipboard.setString(data.scannedData.data);
  toast("Copied to clipboard.");
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
  const isContact = string.includes("BEGIN:VCARD");
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

export async function pickImage(optionalFunc = () => {}) {
  if (Platform.OS === "web") {
    alert("Device not supported.");
    return;
  }
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need camera roll permissions to make this work!");
    return;
  }
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    // console.log(result);
    optionalFunc();
    return result;
  } catch (err) {
    console.log(err.message);
  }
}
