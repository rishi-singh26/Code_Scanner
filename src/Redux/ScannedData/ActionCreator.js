import * as ActionTypes from "./ActionTypes";
import { auth, firestore } from "../../Constants/Api";
import { sortArrayOfObjs, toast } from "../../Shared/Functions";

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
    // .update({ isDeleted: true, deletionDate: new Date() })
    .delete()
    .then((resp) => {
      dispatch(removeData(index));
      dispatch(getScannedData());
      toast("Deleted");
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
    // .orderBy("creationDate", "asc")
    .where("userId", "==", auth.currentUser.uid)
    .get()
    .then((resp) => {
      let scannedCodes = [];
      resp.forEach((codeData) => {
        const data = codeData.data();
        const _id = codeData.id;
        scannedCodes.push({ _id, ...data });
      });
      const sortedScannedCodes = sortArrayOfObjs(
        [...scannedCodes],
        "creationDate"
      );
      dispatch(addAllData(sortedScannedCodes));
    })
    .catch((err) => {
      console.log("Erron in getting all Data\n", err.message);
    });
};

const addAllData = (allData) => ({
  type: ActionTypes.GET_ALL_DATA,
  payload: allData,
});

export const editTitle = (title, dataId) => (dispatch) => {
  if (!auth.currentUser) {
    return;
  }
  dispatch(editData());
  firestore
    .collection("scannedCodes")
    .doc(dataId)
    .update({ title: title })
    .then((resp) => {
      dispatch(getScannedData());
      toast("Edited");
    })
    .catch((err) => {
      console.log("Erron in editing One data title\n", err.message);
    });
};

const editData = (index) => ({ type: ActionTypes.EDIT_DATA });
