import React, { useRef } from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
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

  const scrollRef = useRef();

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
              }}
              onForgotPassPress={() => {
                scrollAuthPage(scrollRef, SCREEN_WIDTH * 2);
              }}
            />
          </View>
          <View style={{ width: SCREEN_WIDTH }}>
            <Signup
              onBackPress={() => {
                scrollAuthPage(scrollRef, 0);
              }}
            />
          </View>
          <View style={{ width: SCREEN_WIDTH }}>
            <ResetPassword
              onBackPress={() => {
                scrollAuthPage(scrollRef, 0);
              }}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
