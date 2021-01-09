import React from "react";
import { Modal, StyleSheet, Pressable } from "react-native";

export default function Dilogue(props) {
  return (
    <Modal
      transparent
      animated
      animationType={"fade"}
      visible={props.dilogueVisible}
      onRequestClose={() => {
        props.cancellable ? props.closeDilogue() : null;
      }}
    >
      <Pressable
        onPress={() => {
          props.cancellable ? props.closeDilogue() : null;
        }}
        style={[
          styles.transparentView,
          {
            backgroundColor: props.transparentBackColor
              ? props.transparentBackColor
              : "#0003",
          },
        ]}
      >
        <Pressable
          onPress={() => {}}
          style={[
            styles.container,
            { backgroundColor: props.dilogueBackground },
          ]}
        >
          {props.children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  transparentView: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    // backgroundColor: "#0003",
  },
  container: {
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 20,
  },
});
