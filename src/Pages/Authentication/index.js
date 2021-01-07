import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Login from "./Components/Login";
import Signup from "./Components/SignUp";
import ResetPassword from "./Components/ResetPass";
import { SCREEN_WIDTH, primaryColor } from "../../Shared/Styles/index";
// import SegmentedControl from "@react-native-community/segmented-control";
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
  // local state
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);

  const scrollRef = useRef();

  const scrollUsingIndex = (index) => {
    setSelectedSegmentIndex(index);
    if (index === 0) {
      scrollAuthPage(scrollRef, 0);
    } else if (index === 1) {
      scrollAuthPage(scrollRef, SCREEN_WIDTH);
    } else if (index === 2) {
      scrollAuthPage(scrollRef, SCREEN_WIDTH * 2);
    } else {
      return;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 30 }}>
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
        {/* <View style={{ marginHorizontal: 30 }}>
          <SegmentedControl
            values={["Login", "Sign Up", "Reset password"]}
            selectedIndex={selectedSegmentIndex}
            onChange={(event) => {
              scrollUsingIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            // enabled={true}
            tintColor={primaryColor}
            backgroundColor={"#f2f2f2"}
            fontStyle={{ color: "#333", fontSize: 15, fontWeight: "700" }}
            activeFontStyle={{ color: "#fff", fontSize: 15, fontWeight: "700" }}
            style={{ height: 50 }}
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activityIndicatorStyle: {
    position: "absolute",
    alignSelf: "center",
    top: 250,
    zIndex: 1000,
  },
});
