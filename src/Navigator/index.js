import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { Snackbar } from "react-native-paper";
import StackNavigator from "./StackNavigator";
import { useSelector, useDispatch } from "react-redux";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { isContactsApiAvailable } from "../Shared/Functions";
import { hideSnack } from "../Redux/Snack/ActionCreator";
import CustomAlert from "../Shared/Components/CustomAlert";
import ThreeBtnAlert from "../Shared/Components/ThreeBtnAlert";

export default function Navigator() {
  const auth = useSelector((state) => state.auth);
  const snack = useSelector((state) => state.snack);
  const theme = useSelector((state) => state.theme);
  const alert = useSelector((state) => state.alert);
  const { colors, mode } = theme;

  const dispatch = useDispatch();

  const [APIAvailable, setAPIAvailable] = useState(false);

  const checkContactsAPIAvailablity = async () => {
    setAPIAvailable(isContactsApiAvailable());
  };

  useEffect(() => {
    checkContactsAPIAvailablity();
  }, []);

  return (
    <NavigationContainer theme={mode ? DefaultTheme : DarkTheme}>
      <StatusBar
        barStyle={mode ? "dark-content" : "light-content"}
        backgroundColor={colors.backOne}
      />
      <StackNavigator
        auth={auth}
        contactsApiStatus={APIAvailable}
        theme={theme}
      />
      <Snackbar
        visible={snack.isVisible}
        onDismiss={() => dispatch(hideSnack())}
        action={
          snack.actionTxt
            ? {
                label: snack.actionTxt,
                onPress: () => {
                  snack.actionFunc();
                  dispatch(hideSnack());
                },
              }
            : null
        }
        // style={{ backgroundColor: colors.backOne }}
        // theme={mode ? PaperDefaultTheme : PaperDarkTheme}
      >
        {snack.message}
      </Snackbar>
      <CustomAlert isVisible={alert.isVisible} />
      <ThreeBtnAlert isVisible={alert.is3BtnAlertVisible} />
    </NavigationContainer>
  );
}
