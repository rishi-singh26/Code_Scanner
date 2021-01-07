import React from 'react';
import {StatusBar} from "react-native"
import Home from '../Pages/Home/index';
import Scanner from "../Pages/Scanner/index"
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen options={{ headerShown: false }} name="Scanner" component={Scanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
