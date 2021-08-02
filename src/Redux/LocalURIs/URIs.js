import * as ActionTypes from "./ActionTypes";

// [
//   {
//     uri: "file/uri/in/local/storege",
//     id: "fileu_unique_id",
//   },
// ];

export const Uris = (
  state = {
    errMess: null,
    pdfURIs: [],
    imageURIs: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_PDF_URI:
      return {
        ...state,
        pdfURIs: [...state.pdfURIs, action.payload],
      };

    case ActionTypes.ADD_IMAGE_URI:
      return {
        ...state,
        imageURIs: [...state.imageURIs, action.payload],
      };

    default:
      return state;
  }
};
