import React, { Component } from "react";
import { Snackbar } from "react-native-paper";

export default class CustomSnack extends Component {
  constructor(props) {
    super(props);
    this.title = props.title;
    this.onActionBtnPress = props?.onActionBtnPress || this.hide;
    this.state = {
      visible: false,
    };
  }

  show = () => {
    this.setState({ visible: true });
  };
  hide = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    return (
      <Snackbar
        visible={visible}
        onDismiss={() => {
          console.log("Snack dismissed automatically");
        }}
        action={{
          label: "Okay",
          onPress: () => {
            this.onActionBtnPress();
          },
        }}
      >
        Hey there! I'm a Snackbar.
      </Snackbar>
    );
  }
}
