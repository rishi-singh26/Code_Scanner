import * as ActionTypes from "./ActionTypes";

export const showSnack = (message, actionTxt = "OKAY", action = () => {}) => (
  dispatch
) => {
  console.log("Showing snack");
  dispatch({
    type: ActionTypes.SHOW_SNACK,
    payload: { message, actionTxt, action },
  });
};

export const hideSnack = () => (dispatch) => {
  dispatch({ type: ActionTypes.HIDE_SNACK });
};
