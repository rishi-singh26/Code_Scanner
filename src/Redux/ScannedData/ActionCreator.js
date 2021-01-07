import * as ActionTypes from "./ActionTypes";
import { auth, firestore } from "../../Constants/Api";

export const addScannedData = (data) => (dispatch) => {
  // console.log("Addin in ACTION");
  if (!auth.currentUser) {
    return;
  }
  firestore
    .collection("scannedCodes")
    .add(data)
    .then((resp) => {
      dispatch(addData(data));
      dispatch(getScannedData());
    })
    .catch((err) => {
      console.log("Erron in adding One Data\n", err.message);
    });
};

const addData = (data) => ({
  type: ActionTypes.ADD_DATA,
  payload: data,
});

export const removeScannedData = (index, dataId) => (dispatch) => {
  if (!auth.currentUser) {
    return;
  }
  firestore
    .collection("scannedCodes")
    .doc(dataId)
    .update({ isDeleted: true, deletionDate: new Date() })
    .then((resp) => {
      dispatch(removeData(index));
      dispatch(getScannedData());
    })
    .catch((err) => {
      console.log("Erron in deleting One Data\n", err.message);
    });
};

const removeData = (index) => ({
  type: ActionTypes.DELETE_DATA,
  payload: index,
});

export const getScannedData = () => (dispatch) => {
  if (!auth.currentUser) {
    return;
  }
  console.log("Getting all data");
  firestore
    .collection("scannedCodes")
    .where("isDeleted", "==", false)
    .get()
    .then((resp) => {
      let scannedCodes = [];
      resp.forEach((codeData) => {
        const data = codeData.data();
        const _id = codeData.id;
        scannedCodes.push({ _id, ...data });
      });
      dispatch(addAllData(scannedCodes));
    })
    .catch((err) => {
      console.log("Erron in getting all Data\n", err.message);
    });
};

const addAllData = (allData) => ({
  type: ActionTypes.GET_ALL_DATA,
  payload: allData,
});
