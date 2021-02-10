import { Alert } from "react-native";

export function LogoutAlert(onOkPress) {
  Alert.alert(
    `Do you want to logout?`,
    ``,
    [
      {
        text: "No",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: `Yes`,
        onPress: () => {
          onOkPress();
        },
        style: "default",
      },
    ],
    { cancelable: false }
  );
}
