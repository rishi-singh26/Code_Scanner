import * as ActionTypes from "./ActionTypes";

export const UsePassPageLock = (state = false, action) => {
  switch (action.type) {
    case ActionTypes.START_PASS_PAGE_LOCK:
      return (state = true);

    case ActionTypes.STOP_PASS_PAGE_LOCK:
      return (state = false);

    default:
      return state;
  }
};
