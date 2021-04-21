import { auth, firestore } from "../../Constants/Api";
import { sortArrayOfObjs } from "../../Shared/Functions";
import { showSnack } from "../Snack/ActionCreator";
import * as ActionTypes from "./ActionTypes";

// sets the state to loading
const fuelLogLoading = () => ({
  type: ActionTypes.FUEL_LOG_LOADING,
});

// sets error state if an error occurs
const fuelLogErr = (message) => ({
  type: ActionTypes.FUEL_LOG_ERR,
  payload: message,
});

// sets the new data to state after fetching from cloud.
const fuelLogSuccess = (log) => ({
  type: ActionTypes.FUEL_LOG_SUCCESS,
  payload: log,
});

export const getFuelLog = () => (dispatch) => {
  dispatch(fuelLogLoading());
  if (!auth.currentUser) {
    dispatch(fuelLogErr("You are not authorized to perform this action"));
    return;
  }
  firestore
    .collection("fuelLogs")
    .where("userId", "==", auth.currentUser.uid)
    .get()
    .then((resp) => {
      let fuelLogs = [];
      resp.forEach((fuelLog) => {
        const data = fuelLog.data();
        const _id = fuelLog.id;
        fuelLogs.push({ _id, ...data });
      });
      const sortedFuelLogs = sortArrayOfObjs([...fuelLogs], "creationDate");
      dispatch(fuelLogSuccess(sortedFuelLogs));
    })
    .catch((err) => {
      console.log("Erron in getting fuel Logs ACTION CREATOR\n", err.message);
    });
};

export const addFuelLog = (newLog) => (dispatch) => {
  if (!auth.currentUser) {
    dispatch(fuelLogErr("You are not authorized to perform this action"));
    return;
  }
  firestore
    .collection("fuelLogs")
    .add(newLog)
    .then(() => {
      dispatch(showSnack("Log added successfully."));
    })
    .catch((err) => {
      dispatch(fuelLogErr(err.message));
      dispatch(showSnack("Error in adding new log, please try again."));
      console.log("Error in adding new fuel log ACTION CREATOR", err.message);
    });
};

export const deleteFuelLog = (logId) => (dispatch) => {
  if (!auth.currentUser) {
    dispatch(fuelLogErr("You are not authorized to perform this action"));
    return;
  }
  firestore
    .collection("fuelLogs")
    .doc(logId)
    .delete()
    .then(() => {
      dispatch(showSnack("Log deleted."));
    })
    .catch((err) => {
      dispatch(showSnack("Could not delete log, please try again!"));
      console.log("Err in deleting fuel log ACTION CREATOR", err.message);
    });
};

export const editFuelLog = (logId, updatedLog) => (dispatch) => {
  if (!auth.currentUser) {
    dispatch(fuelLogErr("You are not authorized to perform this action"));
    return;
  }
  firestore
    .collection("fuelLogs")
    .doc(logId)
    .update(updatedLog)
    .then(() => {
      dispatch(showSnack("Log edited successfully."));
    })
    .catch((err) => {
      dispatch(showSnack("Could not edit log, please try again!"));
      console.log("Err in editing fuel log ACTION CREATOR", err.message);
    });
};
