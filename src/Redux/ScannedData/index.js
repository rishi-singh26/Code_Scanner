import * as ActionTypes from "./ActionTypes";

export const ScannedData = (
  state = {
    isLoading: false,
    errMess: null,
    data: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.GET_ALL_DATA:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };

    case ActionTypes.ADD_DATA:
      return {
        ...state,
        isLoading: true,
      };

    case ActionTypes.DELETE_DATA:
      return {
        ...state,
        isLoading: true,
      };

    default:
      return state;
  }
};
