import * as ActionTypes from "./ActionTypes";

export const FuelLogs = (
  state = {
    isLoading: false,
    errMess: null,
    data: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.FUEL_LOG_ERR:
      return {
        ...state,
        errMess: action.payload,
        isLoading: false,
      };

    case ActionTypes.FUEL_LOG_LOADING:
      return {
        ...state,
        isLoading: true,
        errMess: null,
      };

    case ActionTypes.FUEL_LOG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        data: action.payload,
      };
    default:
      return state;
  }
};
