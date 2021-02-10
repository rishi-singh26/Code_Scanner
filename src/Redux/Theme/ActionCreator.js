import * as ActionTypes from "./ActionTypes";

export const changeToDark = () => (dispatch) => {
  dispatch({ type: ActionTypes.SWITCH_TO_DARK });
};

export const changeToLight = () => (dispatch) => {
  dispatch({ type: ActionTypes.SWITCH_TO_LIGHT });
};
