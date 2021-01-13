import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Accordion from "../../Components/Accordian/Accordian";
import { FontAwesome } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "../../Shared/Styles";

export default function ScannedDataDetail(props) {
  const { scannedData } = props.route.params;
  const [activeSections, setActiveSections] = useState([]);
  // console.log(scannedData);

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingHorizontal: 20, paddingVertical: 12 }}
            onPress={() => {
              activeSections.length > 0
                ? setActiveSections([])
                : setActiveSections([0]);
            }}
          >
            <FontAwesome name="qrcode" size={23} color={"black"} />
            {/* <Feather name="share" size={23} color="black" /> */}
          </TouchableOpacity>
        );
      },
    });
  };

  useEffect(() => {
    setHeaderOptions();
  }, [activeSections]);

  const _renderContent = (qrValue) => {
    return (
      <View style={styles.qrView}>
        <QRCode value={qrValue} size={280} backgroundColor="#f2f2f2" />
      </View>
    );
  };

  const _updateSections = (activeSections) => {
    console.log(activeSections);
    setActiveSections(activeSections);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Accordion
          sections={[1]}
          activeSections={activeSections}
          renderHeader={() => null}
          renderContent={() => _renderContent(scannedData?.text || "Empty")}
          onChange={_updateSections}
        />
        <Text
          onPress={() => {
            scannedData?.title ? null : setShowTitleTextBox(true);
          }}
          style={styles.title}
        >
          {scannedData?.title || "No title"}
        </Text>
        <Text style={styles.text}>{scannedData?.text || ""}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: "#666",
  },
  title: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  textInputView: {
    padding: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: "700",
    backgroundColor: "#f2f2f2",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  qrView: {
    backgroundColor: "#fff",
    height: SCREEN_WIDTH - 20,
    // width: SCREEN_WIDTH - 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
});
