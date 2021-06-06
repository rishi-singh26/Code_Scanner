import * as ActionTypes from "./ActionTypes";

export const Alert = (
  state = {
    head: "",
    subHead: "",
    isVisible: false,
    actionFunc: () => {},
    threeBtnHead: "", // header text for three button alert
    threeBtnSubHead: "", // sub header text  for three button alert
    actionOne: () => {}, // neutral action function for three button alert
    actionTwo: () => {}, // positive action function for three button alert
    actionThree: () => {}, // another action button for three button alert
    actionOneText: "", // neutral action btn text for three button alert
    actionTwoText: "", // positive action btn text for three button alert
    actionThreeText: "", // another action button text for three button alert
    is3BtnAlertVisible: false, // visiblity toggel for three button alert
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

    case ActionTypes.SHOW_THREE_BTN_ALERT:
      return {
        ...state,
        threeBtnHead: action.payload.head,
        threeBtnSubHead: action.payload.subHead,
        actionOne: action.payload.actionOne,
        actionTwo: action.payload.actionTwo,
        actionThree: action.payload.actionThree,
        actionOneText: action.payload.actionOneText,
        actionTwoText: action.payload.actionTwoText,
        actionThreeText: action.payload.actionThreeText,
        is3BtnAlertVisible: true,
      };

    case ActionTypes.HIDE_THREE_BTN_ALERT:
      return {
        ...state,
        threeBtnHead: "",
        threeBtnSubHead: "",
        actionOne: null,
        actionTwo: null,
        actionThree: null,
        actionOneText: "",
        actionTwoText: "",
        actionThreeText: "",
        is3BtnAlertVisible: false,
      };
    default:
      return state;
  }
};
