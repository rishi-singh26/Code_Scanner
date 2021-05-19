import * as ActionTypes from "./ActionTypes";

/**
 * if toggle is true then appLock will turn on and vice versa
 * @param {Boolean} toggle
 * @returns
 */
export const toggleAppLock = (toggle) => (dispatch) => {
  toggle ? dispatch(startAppLock()) : dispatch(stopAppLock());
};

const startAppLock = () => ({
  type: ActionTypes.START_APP_LOCK,
});

const stopAppLock = () => ({
  type: ActionTypes.STOP_APP_LOCK,
});
