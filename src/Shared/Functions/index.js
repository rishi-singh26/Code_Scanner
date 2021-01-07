import Toast from "react-native-simple-toast";

export function validateEmail(email) {
  const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email !== "" && emailRe.test(String(email).toLowerCase())) return true;
  else return false;
}

export function toast(message) {
  Toast.show(message);
}
