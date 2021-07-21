import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";

export default function DatePickerModel(props) {
  const { setValue, style } = props;
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setValue(currentDate);
  };

  const showDatepickerModal = () => setShowDatePicker(true);

  return (
    <View>
      <TouchableOpacity
        onPress={showDatepickerModal}
        style={[
          style,
          { backgroundColor: colors.backTwo, paddingVertical: 15 },
        ]}
      >
        {date ? (
          <Text style={{ color: colors.textOne }}>{date.toDateString()}</Text>
        ) : (
          <Text style={{ color: colors.textOne }}>Tap to select date</Text>
        )}
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date ? date : new Date()}
          mode={"date"}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  datePickerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 10,
  },
});
