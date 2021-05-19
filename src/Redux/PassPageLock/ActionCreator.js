import * as ActionTypes from "./ActionTypes";

/**
 * if toggle is true then appLock will turn on and vice versa
 * @param {Boolean} toggle
 * @returns
 */
export const togglePassPageLock = (toggle) => (dispatch) => {
  toggle ? dispatch(startPassPageLock()) : dispatch(stopPassPageLock());
};

const startPassPageLock = () => ({
  type: ActionTypes.START_PASS_PAGE_LOCK,
});

const stopPassPageLock = () => ({
  type: ActionTypes.STOP_PASS_PAGE_LOCK,
});
