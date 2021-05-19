import * as ActionTypes from "./ActionTypes";

export const UseAppLock = (state = true, action) => {
  switch (action.type) {
    case ActionTypes.START_APP_LOCK:
      return (state = true);

    case ActionTypes.STOP_APP_LOCK:
      return (state = false);

    default:
      return state;
  }
};
