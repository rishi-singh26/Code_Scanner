import { uploadImageToServer } from "../../../../Shared/Components/ImagePicker/Functions";
import { uploadPdfToServer } from "../../../../Shared/Components/PDFPicker/Functions";
import {
  getUserPlace,
  validateEmail,
  validateUrl,
} from "../../../../Shared/Functions";

/**
 * checks the all the fields have some input in them
 * it does not validate that data
 * @param {Array} logData
 * @returns Object {isFilled, string}
 */
export function hasFilledData(logData) {
  let notFilledIndices = [];
  let errString = "Fill data and try again";
  logData.map((it, i) => {
    if (!it?.dataValue) {
      notFilledIndices.push(i);
      errString += `\nYou have not filled ${it.dataName}.`;
    }
  });
  // console.log(notFilledIndices);
  return { isFilled: notFilledIndices.length == 0, string: errString };
}

/**
 * checks if log has phonenumber input
 * @param {Array} logDataArr
 * @returns Boolean
 */
export function hasPhoneNumber(logDataArr) {
  let hasPhoneNumberInp = false;
  let phoneNumberIndicies = [];
  for (let i = 0; i < logDataArr.length; i++) {
    if (logDataArr[i].dataId == 9) {
      hasPhoneNumberInp = true;
      phoneNumberIndicies.push(i);
    }
  }
  return { status: hasPhoneNumberInp, indicies: phoneNumberIndicies };
}

/**
 * checlk if log data has email,
 * returns true if no email is present,
 * returns true if emails are present and are valid,
 * returns false if emails are present and are not valid.
 * @param {Array} logDataArr
 * @returns Boolean
 */
export function hasValidEmails(logDataArr) {
  let hasEmailInp = false;
  let emailIndicies = [];
  for (let i = 0; i < logDataArr.length; i++) {
    if (logDataArr[i].dataId == 3) {
      hasEmailInp = true;
      emailIndicies.push(i);
    }
  }
  if (!hasEmailInp) return true;
  let invalidEmailIndicies = [];
  emailIndicies.map((item) => {
    if (!validateEmail(logDataArr[item].dataValue))
      invalidEmailIndicies.push(item);
  });
  return invalidEmailIndicies.length == 0;
}

/**
 * checlk if log data has url,
 * returns true if no url is present,
 * returns true if urls are present and are valid,
 * returns false if urls are present and are not valid.
 * @param {Array} logDataArr
 * @returns Boolean
 */
export function hasValidUrls(logDataArr) {
  let hasUrlInp = false;
  let urlIndicies = [];
  for (let i = 0; i < logDataArr.length; i++) {
    if (logDataArr[i].dataId == 0) {
      hasUrlInp = true;
      urlIndicies.push(i);
    }
  }
  if (!hasUrlInp) return true;
  let invalidUrlIndicies = [];
  urlIndicies.map((item) => {
    if (!validateUrl(logDataArr[item].dataValue)) invalidUrlIndicies.push(item);
  });
  return invalidUrlIndicies.length == 0;
}

/**
 * takes the logdata array and checks if phonenumbers are present
 * if numbers are present then it checks if they are valid
 * ie. their lenght is 10 or not
 * @param {Array} logData
 * @returns Object {incorrectContactIndex, status}
 */
export function hasValidPhoneNumbers(logData) {
  const { status: contactPresenceStatus, indicies } = hasPhoneNumber(logData);
  if (contactPresenceStatus) {
    let areNumbersCorrect = true;
    let incorrectPhoneNumberIndex = -1;
    for (let i = 0; i < indicies.length; i++) {
      if (logData[indicies[i]].dataValue.phoneNumber.length != 10) {
        areNumbersCorrect = false;
        incorrectPhoneNumberIndex = indicies[i];
        break;
      }
    }
    return {
      status: areNumbersCorrect,
      incorrectContactIndex: incorrectPhoneNumberIndex,
    };
  }
  return { status: true };
}

/**
 * Takes the logdata array as input and checks if it has the contact number input
 * if present then gets users calling cooe ie.91 for India and country flag from their location
 * @param {Array} loggerData
 * @returns
 */
export async function getCallingCodeAndFlag(loggerData) {
  if (hasPhoneNumber(loggerData).status) {
    // console.log("Phone number input present");
    const { results, status, message } = await getUserPlace();
    if (!status) {
      console.log("Error in getting calling code and flag", message);
      return { status: false, data: null };
    }
    return {
      status: true,
      data: {
        code: results[0].annotations.callingcode,
        flag: results[0].annotations.flag,
      },
    };
  }
  return { status: true, data: null };
}

/**
 * returns the index of images and pdfs in the logger data array
 * @param {Array} logData
 * @returns Object {imageIndices, pdfIndices}
 */
export function imageAndPdfIndices(logData) {
  const data = { imageIndices: [], pdfIndices: [] };
  for (let i = 0; i < logData.length; i++) {
    if (logData[i].dataId == 7) data.imageIndices.push(i);
    if (logData[i].dataId == 8) data.pdfIndices.push(i);
  }
  // console.log(data);
  return data;
}

/**
 * takes indecies of images in the logdata array and the logdata array as input and uploads the images to server.
 * @param {Array} dataIndicesWithImg
 * @param {Array} logData
 * @returns - { status: boolean, data: Array }
 */
export async function uploadImages(dataIndicesWithImg, logData) {
  try {
    let downloadUris = [];
    for (let i = 0; i < dataIndicesWithImg.length; i++) {
      // checking if data is present
      if (!logData[dataIndicesWithImg[i]].dataValue)
        return { status: false, data: null };

      // uploading image
      const { status, downloadUri } = await uploadImageToServer(
        logData[dataIndicesWithImg[i]].dataValue,
        "scanner/logs/images/"
      );
      // checking is image was uploaded successfylly
      if (!status) return { status: false, data: null };
      // adding download url to the array to be returned
      downloadUris.push(dataIndicesWithImg[i] + "#" + downloadUri);
    }
    return { status: true, data: downloadUris };
  } catch (err) {
    console.log("Error in uploading images, Custom log functions", err.message);
    return { status: false, data: null };
  }
}

/**
 * takes indecies of pdfs in the logdata array and the logdata array as input and uploads the images to server.
 * @param {Array} dataIdcicesWithPdf
 * @param {Array} logData
 * @returns - { status: boolean, data: Array }
 */
export async function uploadPdfs(dataIdcicesWithPdf, logData) {
  try {
    let downloadUris = [];
    for (let i = 0; i < dataIdcicesWithPdf.length; i++) {
      // checking if data is present
      if (!logData[dataIdcicesWithPdf[i]].dataValue)
        return { status: false, data: null };

      // uploading pdf
      const { status, downloadUri } = await uploadPdfToServer(
        logData[dataIdcicesWithPdf[i]].dataValue,
        "scanner/logs/pdfs/"
      );
      // checking is pdf was uploaded successfylly
      if (!status) return { status: false, data: null };
      // adding download url to the array to be returned
      downloadUris.push(dataIdcicesWithPdf[i] + "#" + downloadUri);
    }
    return { status: true, data: downloadUris };
  } catch (err) {
    console.log("Error in uploading pdfs, Custom log functions", err.message);
    return { status: false, data: null };
  }
}

/**
 * Taked a date object and returns time string with AM and PM
 * @param {Date} time
 * @returns String
 */
export function getTimeFromDateObj(time) {
  const hour = time.getHours();
  const minute = time.getMinutes();

  return `${
    hour > 12
      ? hour - 12 < 10
        ? `0${hour - 12}`
        : hour - 12
      : hour < 10
      ? `0${hour}`
      : hour
  }:${minute < 10 ? `0${minute}` : minute} ${hour >= 12 ? "PM" : "AM"}`;
}
