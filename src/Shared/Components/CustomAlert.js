import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { hideAlert } from "../../Redux/Alert/ActionCreator";
import Dilogue from "./Dilogue";

export default function CustomAlert({ isVisible }) {
  const theme = useSelector((state) => state.theme);
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  const { colors } = theme;
  return (
    <Dilogue
      dilogueVisible={isVisible}
      dilogueBackground={colors.backTwo}
      transparentBackColor={"#0004"}
      cancellable={false}
      closeDilogue={() => {
        dispatch(hideAlert());
      }}
    >
      <Text style={[styles.header, { color: colors.textOne }]}>
        {alert.head}
      </Text>
      <Text style={[styles.subHead, { color: colors.textOne }]}>
        {alert.subHead}
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
          onPress={() => dispatch(hideAlert())}
          style={styles.actionBtn}
        >
          <Text
            style={{ color: colors.textOne, fontSize: 16, fontWeight: "700" }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            alert.actionFunc();
            dispatch(hideAlert());
          }}
        >
          <Text
            style={{ color: colors.textOne, fontSize: 16, fontWeight: "700" }}
          >
            OK
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
