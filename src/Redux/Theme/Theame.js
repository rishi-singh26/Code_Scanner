import * as ActionTypes from "./ActionTypes";

// const {
//   primaryColor,
//   primaryLightColor,
//   primaryErrColor,
//   primarySuperFadedColor,
//   backOne,
//   backTwo,
//   backThree,
//   backFour,
//   transparentBackOne,
//   textOne,
//   textTwo,
//   textThree,
//   textFour,
//   borderColor,
// }

// const lightMode = {
//   primaryColor: "#3071ff",
//   primaryLightColor: "#5c8bf2",
//   primaryErrColor: "#f25246",
//   primarySuperFadedColor: "#95b5fc",
//   secondaryColor: "",
//   thirdColor: "",
//   backOne: "#fff",
//   transparentBackOne: "#fffd",
//   backTwo: "#ddd",
//   backThree: "#f9f9f9",
//   textOne: "#000",
//   textTwo: "#777",
//   textThree: "#fff",
//   borderColor: "#efefef",
// };

// const darkMode = {
//   primaryColor: "#3071ff",
//   primaryLightColor: "#5c8bf2",
//   primaryErrColor: "#f25246",
//   primarySuperFadedColor: "#95b5fc",
//   secondaryColor: "",
//   thirdColor: "",
//   // backOne: "#060606",
//   backOne: "#2c2f3d",
//   transparentBackOne: "#000a",
//   backTwo: "#323545",
//   // backThree: "#222",
//   backThree: "#262a36",
//   textOne: "#ddd",
//   textTwo: "#aaa",
//   textThree: "#000",
//   borderColor: "#444",
// };

const lightMode = {
  primaryColor: "#3B73FF",
  primaryLightColor: "#5c8bf2",
  primaryErrColor: "#f25246",
  primarySuperFadedColor: "#95b5fc",
  secondaryColor: "",
  thirdColor: "",
  backOne: "#fff",
  backTwo: "#f2f2f2",
  backThree: "#cfcfcf",
  backFour: "#666",
  backFive: "#000",
  transparentBackOne: "#fffd",
  textOne: "#333",
  textTwo: "#555",
  textThree: "#777",
  textFour: "#fff",
  borderColor: "#efefef",
};

const darkMode = {
  primaryColor: "#3B73FF",
  primaryLightColor: "#5c8bf2",
  primaryErrColor: "#f25246",
  primarySuperFadedColor: "#95b5fc",
  secondaryColor: "",
  thirdColor: "",
  backOne: "#2c2f3d",
  backTwo: "#323545",
  backThree: "#3b3e52",
  backFour: "#888",
  backFive: "#fff",
  transparentBackOne: "#0005",
  textOne: "#ccc",
  textTwo: "#999",
  textThree: "#777",
  textFour: "#000",
  borderColor: "#555",
};

export const Theme = (state = { colors: lightMode, mode: true }, action) => {
  switch (action.type) {
    case ActionTypes.SWITCH_TO_DARK:
      return {
        ...state,
        colors: darkMode,
        mode: false,
      };

    case ActionTypes.SWITCH_TO_LIGHT:
      return {
        ...state,
        colors: lightMode,
        mode: true,
      };

    case ActionTypes.TOGGEL_THEME:
      return {
        ...state,
        colors: state.mode ? darkMode : lightMode,
        mode: !state.mode,
      };

    // case ActionTypes.LOGOUT_SUCCESS:
    //   return { colors: lightMode, mode: true };

    default:
      return state;
  }
};
