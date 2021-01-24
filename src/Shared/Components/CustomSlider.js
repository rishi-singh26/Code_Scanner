import React from "react";
import { primaryColor } from "../../Shared/Styles";
import Slider from "@react-native-community/slider";

export default function CustomSlider({ changeValue, value, maxVal = 280 }) {
  return (
    <Slider
      style={{ height: 15 }}
      minimumValue={180}
      maximumValue={maxVal}
      minimumTrackTintColor={primaryColor}
      maximumTrackTintColor="#000000"
      thumbTintColor={primaryColor}
      onValueChange={(event) => {
        changeValue(Math.floor(event));
      }}
      // value={value}
    />
  );
}
