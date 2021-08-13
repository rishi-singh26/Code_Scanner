import React from "react";

import Home from "../Pages/Home/index";
import Scanner from "../Pages/Scanner/index";
import ScannerCamera from "../Pages/Scanner/ScannerCamera";
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
import Settings from "../Pages/Settings/index";
import EditProfile from "../Pages/Settings/Components/EditProfile";
import ChangePasswd from "../Pages/Settings/Components/ChangePasswd";
import Loggers from "../Pages/Logs";
import CreateLogger from "../Pages/Logs/Components/CreateLogger";
import LogsList from "../Pages/Logs/Components/CustomLog/LogsList";
import LogDetail from "../Pages/Logs/Components/CustomLog/LogDetail";
import AddLog from "../Pages/Logs/Components/CustomLog/AddLog";
import WebViewPage from "../Pages/WebView/index";

import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function SatckNavigator({ auth, contactsApiStatus, theme }) {
  const { colors } = theme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { fontWeight: "700" },
        headerStyle: { backgroundColor: colors.backTwo },
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
          {contactsApiStatus ? (
            <Stack.Screen
              options={{ title: "Contacts" }}
              name="ContactSharing"
              component={Contacts}
            />
          ) : null}
          <Stack.Screen name="Scanner" component={Scanner} />
          <Stack.Screen
            name="ScannerCamera"
            component={ScannerCamera}
            options={{ headerShown: false }}
          />
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
          <Stack.Screen name="FuelLog" component={FuelLog} />
          <Stack.Screen
            name="AddFuelLog"
            options={{ title: "Add fuel log" }}
            component={AddFuelLog}
          />
          <Stack.Screen
            name="Settings"
            options={{ title: "Settings" }}
            component={Settings}
          />
          <Stack.Screen
            name="EditProfile"
            options={{ title: "Edit profile" }}
            component={EditProfile}
          />
          <Stack.Screen
            name="ChangePasswd"
            options={{ title: "Change password" }}
            component={ChangePasswd}
          />
          <Stack.Screen
            name="Loggers"
            options={{ title: "Logger" }}
            component={Loggers}
          />
          <Stack.Screen name="LogsList" component={LogsList} />
          <Stack.Screen name="LogDetail" component={LogDetail} />
          <Stack.Screen
            name="CreateLogger"
            options={{ title: "Create Logger" }}
            component={CreateLogger}
          />
          <Stack.Screen
            name="AddLog"
            options={{ title: "Add log" }}
            component={AddLog}
          />
          <Stack.Screen
            name="WebViewPage"
            options={{ title: "" }}
            component={WebViewPage}
          />
        </>
      ) : (
        <Stack.Screen
          options={{ headerShown: false }}
          name="Authentication"
          component={Authentication}
        />
      )}
    </Stack.Navigator>
  );
}
