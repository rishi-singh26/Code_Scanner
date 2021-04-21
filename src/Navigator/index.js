import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { Snackbar } from "react-native-paper";
import Home from "../Pages/Home/index";
import Scanner from "../Pages/Scanner/index";
import Authentication from "../Pages/Authentication/index";
import QrGenerator from "../Pages/Generator/index";
import ScannedDataDetail from "../Pages/ScannedDataDetail/index";
import Contacts from "../Pages/ShareContacts/index";
import ContactQR from "../Pages/ShareContacts/Components/ContactQR";
import Editor from "../Pages/Editor/index";
import Images from "../Pages/Images/index";
import UploadImages from "../Pages/Images/Components/UploadImages";
import ImageViewer from "../Pages/Images/Components/ImageViewer/index";
import Pdfs from "../Pages/PDFs/index";
import Passwords from "../Pages/Passwords/index";
import AddPassword from "../Pages/Passwords/Components/AddPassword";
import ChangePassword from "../Pages/Passwords/Components/ChangePassword";
import FuelLog from "../Pages/FuelLog/index";
import AddFuelLog from "../Pages/FuelLog/Components/AddFuelLog";
// import PdfViewer from "../Pages/PDFs/Components/PDFViewer/index";

import { useSelector, useDispatch } from "react-redux";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { isContactsApiAvailable } from "../Shared/Functions";
import { hideSnack } from "../Redux/Snack/ActionCreator";
import CustomAlert from "../Shared/Components/CustomAlert";
import ThreeBtnAlert from "../Shared/Components/ThreeBtnAlert";

const Stack = createStackNavigator();

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
      <Stack.Navigator
        screenOptions={{
          headerTitleStyle: { fontWeight: "700" },
          headerStyle: { backgroundColor: colors.backOne },
          headerTintColor: colors.textOne,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        {auth.isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              options={{ title: "QR Generator" }}
              name="QrGenerator"
              component={QrGenerator}
            />
            {APIAvailable ? (
              <Stack.Screen
                options={{ title: "Contacts" }}
                name="ContactSharing"
                component={Contacts}
              />
            ) : null}
            <Stack.Screen name="Scanner" component={Scanner} />
            <Stack.Screen
              name="ScannedDataDetail"
              component={ScannedDataDetail}
              options={{ title: "Detail" }}
            />
            <Stack.Screen
              name="ContactQR"
              component={ContactQR}
              options={{ title: "Detail" }}
            />
            <Stack.Screen
              name="Editor"
              component={Editor}
              options={{ title: "Editor" }}
            />
            <Stack.Screen
              name="Images"
              component={Images}
              options={{ title: "Images" }}
            />
            <Stack.Screen
              name="UploadImages"
              component={UploadImages}
              options={{ title: "Upload images" }}
            />
            <Stack.Screen
              name="ImageViewer"
              component={ImageViewer}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              }}
            />
            <Stack.Screen
              name="Pdfs"
              component={Pdfs}
              options={{ title: "Pdfs" }}
            />
            <Stack.Screen
              name="Passwords"
              component={Passwords}
              options={{ title: "Passwords" }}
            />
            <Stack.Screen
              name="AddPassword"
              options={{ title: "Add password" }}
              component={AddPassword}
            />
            <Stack.Screen
              name="ChangePassword"
              options={{ title: "Change password" }}
              component={ChangePassword}
            />
            <Stack.Screen
              name="FuelLog"
              options={{ title: "Fuel logs" }}
              component={FuelLog}
            />
            <Stack.Screen
              name="AddFuelLog"
              options={{ title: "Add fuel log" }}
              component={AddFuelLog}
            />
            {/* <Stack.Screen
              name="PdfViewer"
              component={PdfViewer}
              options={{ title: "Pdf Viewer" }}
            /> */}
          </>
        ) : (
          <Stack.Screen
            options={{ headerShown: false }}
            name="Authentication"
            component={Authentication}
          />
        )}
      </Stack.Navigator>
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
      >
        {snack.message}
      </Snackbar>
      <CustomAlert isVisible={alert.isVisible} />
      <ThreeBtnAlert isVisible={alert.is3BtnAlertVisible} />
    </NavigationContainer>
  );
}
