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

import { useSelector, useDispatch } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { primaryColor } from "../Shared/Styles";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { isContactsApiAvailable } from "../Shared/Functions";
import { hideSnack } from "../Redux/Snack/ActionCreator";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyBottomTabs() {
  const [APIAvailable, setAPIAvailable] = useState(false);

  const checkContactsAPIAvailablity = async () => {
    setAPIAvailable(isContactsApiAvailable());
  };

  useEffect(() => {
    checkContactsAPIAvailablity();
  }, []);

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: primaryColor,
        keyboardHidesTabBar: true,
        style: { elevation: 0, borderTopColor: "#fff", borderTopWidth: 0 },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return <Feather name={"home"} size={23} color={color} />;
          } else if (route.name === "QrGenerator") {
            return <FontAwesome name={"qrcode"} size={23} color={color} />;
          } else if (route.name === "ContactSharing") {
            return <Feather name={"user"} size={23} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        options={{ title: "QR Generator" }}
        name="QrGenerator"
        component={QrGenerator}
      />
      {APIAvailable ? (
        <Tab.Screen
          options={{ title: "Contacts" }}
          name="ContactSharing"
          component={Contacts}
        />
      ) : null}
    </Tab.Navigator>
  );
}

export default function Navigator() {
  const auth = useSelector((state) => state.auth);
  const snack = useSelector((state) => state.snack);

  const dispatch = useDispatch();

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Stack.Navigator
        screenOptions={{ headerTitleStyle: { fontWeight: "700" } }}
      >
        {auth.isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={MyBottomTabs}
              options={{ headerShown: false }}
            />
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
    </NavigationContainer>
  );
}
