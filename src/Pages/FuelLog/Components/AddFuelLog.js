import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { showSnack } from "../../../Redux/Snack/ActionCreator";
import { auth } from "../../../Constants/Api";
import { addFuelLog, editFuelLog } from "../../../Redux/FuelLog/ActionCreator";

export default function AddFuelLog(props) {
  const routData = props.route.params;
  const { isEditing } = routData;
  const theme = useSelector((state) => state.theme);
  const [date, setDate] = useState(isEditing ? new Date(routData.data.date.seconds * 1000) :new Date());
  const [show, setShow] = useState(false);
  const [fuelVolume, setFuelVolume] = useState(isEditing ? routData.data.fuelVolume : "");
  const [unitPrice, setUnitPrice] = useState(isEditing ? routData.data.unitPrice : "");
  const [odometerReading, setOdometerReading] = useState(isEditing ? routData.data.odometerReading : "");
  const [desc, setDesc] = useState(isEditing ? routData.data.desc : "");

  const dispatch = useDispatch();

  const { colors } = theme;

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => setShow(true);

  const addOrEditLog = () => {
    // check if these fields are not empty
    if (fuelVolume === "" || unitPrice === "" || odometerReading === "") {
      dispatch(showSnack("FUEL VOLUME, UNIT PRICE and ODOMETER READING are required and can NOT be empty!"));
    }
    const fuelCost = fuelVolume * unitPrice;
    const newLog = {
      fuelVolume,
      unitPrice,
      desc,
      date,
      odometerReading,
      fuelCost,
      creationDate: isEditing ? routData.data.creationDate : new Date(),
      updationDate: isEditing ? new Date() : null,
      userId: isEditing ? routData.data.userId : auth.currentUser.uid,
    }

    // console.log({id: routData.data._id,newLog});
    isEditing ? dispatch(editFuelLog(routData.data._id,newLog)) : dispatch(addFuelLog(newLog));
    props.navigation.goBack();
  };
  

  // checks is the enterd text is an integer number and does not contain any alphabetical characters
  const validateInteger = (text) => {
    // check if the length of the text is equal to zero
    // if yes then clear the text field ie. set the value to an empty string.
    if (text.length == 0) {
      return true;
    }
    const validator = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
    // checks if the text is an positive integer or a decimal point number.
    // will accept 1, 12, 1.5, +1, +1.5,
    // will not accept -> ., 1..5, 1.2.3, -1
    if (!validator.test(text)) {
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backOne }}>
      <TextInput
        placeholder={"Enter fuel volume in letres"}
        placeholderTextColor={colors.textTwo}
        style={[
          styles.textInput,
          { backgroundColor: colors.backTwo, color: colors.textOne },
        ]}
        keyboardType="decimal-pad"
        value={fuelVolume}
        onChangeText={(txt) => {
          if (validateInteger(txt)) setFuelVolume(txt);
        }}
      />
      <TextInput
        placeholder={"Enter the price of one litre of fuel in indian rupees"}
        placeholderTextColor={colors.textTwo}
        style={[
          styles.textInput,
          { backgroundColor: colors.backTwo, color: colors.textOne },
        ]}
        keyboardType="decimal-pad"
        value={unitPrice}
        onChangeText={(txt) => {
          if (validateInteger(txt)) setUnitPrice(txt);
        }}
      />
      <TextInput
        placeholder={"Enter the distance on the odometer"}
        placeholderTextColor={colors.textTwo}
        style={[
          styles.textInput,
          { backgroundColor: colors.backTwo, color: colors.textOne },
        ]}
        keyboardType="decimal-pad"
        value={odometerReading}
        onChangeText={(txt) => {
          if (validateInteger(txt)) setOdometerReading(txt);
        }}
      />
      <TouchableOpacity
        onPress={showDatepicker}
        style={[
          styles.textInput,
          { backgroundColor: colors.backTwo, paddingVertical: 15 },
        ]}
      >
        <Text style={{ color: colors.textOne }}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={"date"}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <TextInput
        placeholderTextColor={colors.textTwo}
        placeholder={"Enter description"}
        style={[styles.textInput, { backgroundColor: colors.backTwo }]}
        style={[
          styles.textInput,
          { backgroundColor: colors.backTwo, color: colors.textOne },
        ]}
        keyboardType="default"
        value={desc}
        onChangeText={(txt) => setDesc(txt)}
      />
      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: colors.primaryColor }]}
        onPress={addOrEditLog}
      >
        <Text style={styles.submitBtnTxt}>{isEditing ? "Edit Log" : "Add Log"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 10,
  },
  submitBtn: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 7,
    margin: 20,
    alignItems: "center",
  },
  submitBtnTxt: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
});
