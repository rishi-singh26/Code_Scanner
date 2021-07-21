import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";

export default function TimePickerModel(props) {
  const { style, setValue } = props;
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const [time, setTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const selectedTime = () => {
    const hour = time.getHours();
    const minute = time.getMinutes();

    return `${
      hour > 12
        ? hour - 12 < 10
          ? `0${hour - 12}`
          : hour - 12
        : hour < 10
        ? `0${hour}`
        : hour
    }:${minute < 10 ? `0${minute}` : minute} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const onChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
    setValue(currentTime);
  };

  const showTimepickerModal = () => setShowTimePicker(true);

  return (
    <View>
      <TouchableOpacity
        onPress={showTimepickerModal}
        style={[
          style,
          { backgroundColor: colors.backTwo, paddingVertical: 15 },
        ]}
      >
        {time ? (
          <Text style={{ color: colors.textOne }}>{selectedTime()}</Text>
        ) : (
          <Text style={{ color: colors.textOne }}>Tap to select time</Text>
        )}
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={time ? time : new Date()}
          mode={"time"}
          is24Hour={false}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timePickerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 10,
  },
});
