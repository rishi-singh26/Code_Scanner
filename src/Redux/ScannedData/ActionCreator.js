import * as ActionTypes from "./ActionTypes";

export const addScannedData = (data) => (dispatch) => {
  // console.log("Addin in ACTION");
  dispatch(addData(data))
}

const addData = (data) => ({
  type: ActionTypes.ADD_DATA,
  payload: data,
})

export const removeScannedData = (index) => (dispatch) => {
  dispatch(removeData(index))
}

const removeData = (index) => ({
  type: ActionTypes.DELETE_DATA,
  payload: index,
})