import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { hide3BtnAlert } from "../../Redux/Alert/ActionCreator";
import Dilogue from "./Dilogue";

export default function ThreeBtnAlert({ isVisible }) {
  const theme = useSelector((state) => state.theme);
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  const { backTwo, textOne } = theme.colors;
  return (
    <Dilogue
      dilogueVisible={isVisible}
      dilogueBackground={backTwo}
      transparentBackColor={"#0004"}
      cancellable={false}
      closeDilogue={() => {
        dispatch(hideAlert());
      }}
    >
      <Text style={[styles.header, { color: textOne }]}>
        {alert.threeBtnHead}
      </Text>
      <Text style={[styles.subHead, { color: textOne }]}>
        {alert.threeBtnSubHead}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            dispatch(hide3BtnAlert());
            alert.actionThree();
          }}
          style={styles.actionBtn}
        >
          <Text style={{ color: textOne, fontSize: 16, fontWeight: "700" }}>
            {alert?.actionThreeText && alert.actionThreeText != ""
              ? alert.actionThreeText
              : "Cancel"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            dispatch(hide3BtnAlert());
            alert.actionOne();
          }}
        >
          <Text style={{ color: textOne, fontSize: 16, fontWeight: "700" }}>
            {alert.actionOneText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            dispatch(hide3BtnAlert());
            alert.actionTwo();
          }}
        >
          <Text style={{ color: textOne, fontSize: 16, fontWeight: "700" }}>
            {alert.actionTwoText}
          </Text>
        </TouchableOpacity>
      </View>
    </Dilogue>
  );
}

const styles = StyleSheet.create({
  actionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    fontSize: 17,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingTop: 7,
  },
  subHead: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 5,
    paddingHorizontal: 10,
  },
});
