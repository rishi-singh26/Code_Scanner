import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, TouchableOpacity, Text } from "react-native";
import { useSelector } from "react-redux";

export default function Scanner(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backOne }}>
      <Text>Scanner</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
