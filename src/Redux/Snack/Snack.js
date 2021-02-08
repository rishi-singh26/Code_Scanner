import * as ActionTypes from "./ActionTypes";

export const Snack = (
  state = {
    message: "",
    isVisible: false,
    actionFunc: null,
    actionTxt: "",
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.SHOW_SNACK:
      return {
        ...state,
        message: action.payload.message,
        actionTxt: action.payload.actionTxt,
        actionFunc: action.payload.action,
        isVisible: true,
      };
    case ActionTypes.HIDE_SNACK:
      return {
        ...state,
        message: "",
        actionTxt: "",
        actionFunc: null,
        isVisible: false,
      };
    default:
      return state;
  }
};
