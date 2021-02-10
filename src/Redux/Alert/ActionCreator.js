import * as ActionTypes from "./ActionTypes";

/**
 *
 * @param {String} head
 * @param {String} subHead
 * @param {Function} action
 * sub head and action are optional
 */
export const showAlert = (head, subHead = "", action = () => {}) => (
  dispatch
) => {
  // console.log("Showing alert");
  dispatch({
    type: ActionTypes.SHOW_ALERT,
    payload: { head, subHead, action },
  });
};

export const hideAlert = () => (dispatch) => {
  dispatch({ type: ActionTypes.HIDE_ALERT });
};

/**
 *
 * @param {String} head
 * @param {String} subHead
 * @param {Function} actionOne
 * @param {String} actionOneText
 * @param {Function} actionTwo
 * @param {String} actionTwoText
 * all parameters are compulsary
 */
export const show3BtnAlert = (
  head,
  subHead = "",
  actionOne,
  actionOneText,
  actionTwo,
  actionTwoText
) => (dispatch) => {
  console.log("Showing alert");
  dispatch({
    type: ActionTypes.SHOW_THREE_BTN_ALERT,
    payload: {
      head,
      subHead,
      actionOne,
      actionTwo,
      actionOneText,
      actionTwoText,
    },
  });
};

export const hide3BtnAlert = () => (dispatch) => {
  dispatch({ type: ActionTypes.HIDE_THREE_BTN_ALERT });
};
