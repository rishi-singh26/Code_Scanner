import * as ActionTypes from "./ActionTypes";

export const showAlert = (head, subHead = "", action = () => {}) => (
  dispatch
) => {
  console.log("Showing alert");
  dispatch({
    type: ActionTypes.SHOW_ALERT,
    payload: { head, subHead, action },
  });
};

export const hideAlert = () => (dispatch) => {
  dispatch({ type: ActionTypes.HIDE_ALERT });
};
