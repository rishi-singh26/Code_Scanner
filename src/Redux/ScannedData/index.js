import * as ActionTypes from './ActionTypes';

export const ScannedData = (
  state = {
    isLoading: false,
    errMess: null,
    data: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_DATA:
    console.log("Addin in REDUCER", [action.payload, ...state.data]);
      return {
        ...state,
        data: [action.payload, ...state.data],
      };

    case ActionTypes.DELETE_DATA:
      var currentData = [...state.data];
      currentData.splice(action.payload, 1);

      console.log(currentData, "After deleting");

      return {
        ...state,
        data: currentData,
      };

    default:
      return state;
  }
};
