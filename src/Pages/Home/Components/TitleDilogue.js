import React, { useState } from "react";
import {
  TextInput,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Dilogue from "../../../Shared/Components/Dilogue";
import { primaryColor } from "../../../Shared/Styles";
import { useDispatch } from "react-redux";
import { editTitle } from "../../../Redux/ScannedData/ActionCreator";

export default function TitleDilogue(props) {
  const [title, setTitle] = useState(props?.selectedData?.title || "");
  const dispatch = useDispatch();

  const editThisTitle = (selectedData, titel) => {
    // console.log({ selectedData, titel });
    dispatch(editTitle(titel, selectedData._id));
    props.closeDilogue();
    setTitle("");
  };

  return (
    <Dilogue
      cancellable
      dilogueVisible={props.isVisible}
      closeDilogue={() => {
        props.closeDilogue();
        setTitle("");
      }}
      dilogueBackground={"#fff"}
    >
      <TextInput
        placeholder={"Enter title"}
        style={styles.textInput}
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <View style={styles.bottomBtns}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            props.closeDilogue();
            setTitle("");
          }}
        >
          <Text style={[styles.btnTxt, { color: "#000" }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => editThisTitle(props.selectedData, title)}
        >
          <Text style={[styles.btnTxt, { color: primaryColor }]}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Dilogue>
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 20,
  },
  bottomBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  btn: { paddingHorizontal: 20, paddingVertical: 10 },
  btnTxt: { fontSize: 16, fontWeight: "700" },
});
