import React from "react";
import { StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";

export default function WebViewPage(props) {
  const { uri } = props.route.params;
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  return (
    <WebView
      style={[styles.container, { backgroundColor: colors.backTwo }]}
      source={{ uri: uri }}
      //   renderLoading={<Text>Loading</Text>}
      //   onLoadStart
      //   onLoadProgress
      //   onLoadEnd
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
