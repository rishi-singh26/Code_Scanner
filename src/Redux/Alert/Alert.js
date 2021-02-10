import * as ActionTypes from "./ActionTypes";

export const Alert = (
  state = {
    head: "",
    subHead: "",
    isVisible: false,
    actionFunc: null,
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.SHOW_ALERT:
      return {
        ...state,
        head: action.payload.head,
        subHead: action.payload.subHead,
        actionFunc: action.payload.action,
        isVisible: true,
      };
    case ActionTypes.HIDE_ALERT:
      return {
        ...state,
        head: "",
        subHead: "",
        actionFunc: null,
        isVisible: false,
      };
    default:
      return state;
  }
};
