import { uploadImageToServer } from "../../../../Shared/Components/ImagePicker/Functions";
import { uploadPdfToServer } from "../../../../Shared/Components/PDFPicker/Functions";
import {
  getUserPlace,
  validateEmail,
  validateUrl,
} from "../../../../Shared/Functions";

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

export async function getCallingCodeAndFlag(loggerData) {
  if (hasPhoneNumber(loggerData).status) {
    // console.log("Phone number input present");
    const { results, status, message } = await getUserPlace();
    if (!status) {
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
  return { status: false, data: null };
}

/**
 *
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
 *
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
 *
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
