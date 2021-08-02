import * as ActionTypes from "./ActionTypes";

export const addPdfUri = (data) => (dispatch) => {
  dispatch({ type: ActionTypes.ADD_PDF_URI, payload: data });
};

export const addImageUri = (data) => (dispatch) => {
  dispatch({ type: ActionTypes.ADD_IMAGE_URI, payload: data });
};
