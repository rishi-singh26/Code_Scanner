import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import Dilogue from "./Dilogue";

export default function Prompt({
  title,
  text,
  setText,
  onOkPress,
  onCancelPress,
  visible,
  hotBtnText,
  placeholderTxt,
}) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const [errText, setErrText] = useState("");

  return (
    <Dilogue
      transparentBackColor={"#0008"}
      dilogueVisible={visible}
      closeDilogue={onCancelPress}
      dilogueBackground={colors.backOne}
      cancellable={true}
    >
      <Text style={[styles.headTxt, { color: colors.textOne }]}>{title}</Text>
      <TextInput
        placeholder={placeholderTxt}
        placeholderTextColor={colors.textTwo}
        style={[
          styles.textInput,
          { backgroundColor: colors.backTwo, color: colors.textOne },
        ]}
        value={text}
        onChangeText={(text) => setText(text)}
      />
      {errText.length > 0 ? (
        <Text style={[styles.errTxt, { color: colors.primaryErrColor }]}>
          {errText}
        </Text>
      ) : null}
      <View style={styles.buttonsView}>
        <TouchableOpacity style={{ padding: 15 }} onPress={onCancelPress}>
          <Text style={[styles.btnTxt, { color: colors.textOne }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 15 }} onPress={onOkPress}>
          <Text style={[styles.btnTxt, { color: colors.primaryColor }]}>
            {hotBtnText}
          </Text>
        </TouchableOpacity>
      </View>
    </Dilogue>
  );
}

const styles = StyleSheet.create({
  headTxt: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 5,
    marginLeft: 5,
  },
  subHeadTxt: { fontSize: 16, marginVertical: 10, marginLeft: 5 },
  errTxt: { fontSize: 14, marginBottom: 10, marginLeft: 10 },
  buttonsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    alignItems: "center",
  },
  btnTxt: { fontSize: 16, fontWeight: "700" },
  textInput: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
  },
});
