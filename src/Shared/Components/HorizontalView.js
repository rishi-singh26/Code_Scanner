import React from "react";
import { View } from "react-native";
import { ViewPropTypes } from "../Config";

export default function HorizontalView({ style, children }) {
  return (
    <View style={[{ flexDirection: "row", justifyContent: "center" }, style]}>
      {children}
    </View>
  );
}

HorizontalView.propTypes = {
  style: ViewPropTypes.style,
};
