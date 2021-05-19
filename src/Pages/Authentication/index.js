import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView, View, ScrollView, BackHandler } from "react-native";
import Login from "./Components/Login";
import Signup from "./Components/SignUp";
import ResetPassword from "./Components/ResetPass";
import { SCREEN_WIDTH } from "../../Shared/Styles/index";
import { useSelector } from "react-redux";
import CustomActivityIndicator from "../../Shared/Components/CustomActivityIndicator";

function scrollAuthPage(scrollRef, scrollValue) {
  scrollRef.current.scrollTo({
    animated: true,
    y: 0,
    x: scrollValue,
    duration: 1000,
  });
}

export default function Authentication(props) {
  // global state
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  // local state
  const [screenIndex, setScreenIndex] = useState(0); // 0 means login screen, 1 means forgot password screen and 2 means signup screen. It is used for backHandler. Using this we always know which screen is the user on

  const scrollRef = useRef();

  useEffect(() => {
    const backAction = () => {
      if (screenIndex === 1 || screenIndex === 2) {
        scrollAuthPage(scrollRef, 0);
        setScreenIndex(0);
      } else BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [screenIndex]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.backOne, paddingTop: 30 }}
    >
      {auth.isLoading ? <CustomActivityIndicator /> : null}
      <ScrollView contentContainerStyle={{ justifyContent: "space-between" }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={{ flex: 1 }}
        >
          <View style={{ width: SCREEN_WIDTH }}>
            <Login
              onSignupPress={() => {
                scrollAuthPage(scrollRef, SCREEN_WIDTH);
                setScreenIndex(2);
              }}
              onForgotPassPress={() => {
                scrollAuthPage(scrollRef, SCREEN_WIDTH * 2);
                setScreenIndex(1);
              }}
            />
          </View>
          <View style={{ width: SCREEN_WIDTH }}>
            <Signup
              onBackPress={() => {
                scrollAuthPage(scrollRef, 0);
                setScreenIndex(0);
              }}
            />
          </View>
          <View style={{ width: SCREEN_WIDTH }}>
            <ResetPassword
              onBackPress={() => {
                scrollAuthPage(scrollRef, 0);
                setScreenIndex(0);
              }}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
