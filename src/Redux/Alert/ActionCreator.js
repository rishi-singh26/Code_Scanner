import * as ActionTypes from "./ActionTypes";

/**
 *
 * @param {String} head
 * @param {String} subHead - optional
 * @param {Function} action - optional
 */
export const showAlert =
  (head, subHead = "", action = () => {}) =>
  (dispatch) => {
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
 * @param {Function} actionThree - Optional
 * @param {String} actionThreeText - Optional
 *
 * all parameters are compulsary except actionThree and actionThreeText
 */
export const show3BtnAlert =
  (
    head,
    subHead = "",
    actionOne,
    actionOneText,
    actionTwo,
    actionTwoText,
    actionThree = () => {},
    actionThreeText = "Cancel"
  ) =>
  (dispatch) => {
    // console.log("Showing alert");
    dispatch({
      type: ActionTypes.SHOW_THREE_BTN_ALERT,
      payload: {
        head,
        subHead,
        actionOne,
        actionTwo,
        actionThree,
        actionOneText,
        actionTwoText,
        actionThreeText,
      },
    });
  };

export const hide3BtnAlert = () => (dispatch) => {
  dispatch({ type: ActionTypes.HIDE_THREE_BTN_ALERT });
};
