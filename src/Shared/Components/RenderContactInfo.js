import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Linking,
} from "react-native";
import { addToContacts, getDataObj } from "../Functions/index";
import { Feather } from "@expo/vector-icons";
import { primaryColor } from "../Styles";

function IconBtn({
  iconName,
  backColor,
  iconColor,
  size,
  iconSize = 17,
  containerPadding = 10,
  onPress = () => {},
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderRadius: Math.ceil(size / 2) + 5,
        padding: containerPadding,
        backgroundColor: backColor,
      }}
    >
      <Feather name={iconName} color={iconColor} size={iconSize} />
    </TouchableOpacity>
  );
}

export default function RenderContactInfo({ data }) {
  const [contactInfo, setContactInfo] = useState(getDataObj(data));
  // console.log(contactInfo);
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        {contactInfo?.fullName?.name ? (
          <Text style={styles.name}>{contactInfo.fullName.name}</Text>
        ) : null}
        {/* <Text>{data}</Text> */}
        {contactInfo?.organisation?.org ? (
          <Text style={styles.organisation}>
            {contactInfo.organisation.org}
          </Text>
        ) : null}
        {contactInfo?.title?.title ? (
          <Text>{contactInfo.title.title}</Text>
        ) : null}
        {contactInfo.phoneNumbers.map((item, index) => {
          return (
            <Text key={index} style={styles.phoneNumber}>
              {item.phoneNumber}
            </Text>
          );
        })}
        {contactInfo.emails.map((item, index) => {
          return <Text key={index}>{item}</Text>;
        })}
        {contactInfo.urls.map((item, index) => {
          return <Text key={index}>{item.url}</Text>;
        })}
      </View>
      <View style={styles.actionBtnsView}>
        <IconBtn
          iconColor={"#fff"}
          iconName="plus"
          size={46}
          backColor={primaryColor}
          onPress={() => addToContacts(data)}
        />
        {contactInfo.phoneNumbers.length > 0 ? (
          <>
            <IconBtn
              iconColor={"#fff"}
              iconName="message-circle"
              size={46}
              backColor={primaryColor}
              onPress={() => {
                const PHONE_NUMBER = contactInfo.phoneNumbers[0].phoneNumber;
                const URL = `sms:${PHONE_NUMBER}`;
                Linking.canOpenURL(URL) ? Linking.openURL(URL) : null;
              }}
            />
            <IconBtn
              iconColor={"#fff"}
              iconName="phone"
              size={46}
              backColor={primaryColor}
              onPress={() => {
                const PHONE_NUMBER = contactInfo.phoneNumbers[0].phoneNumber;
                var URL =
                  Platform.OS === "android"
                    ? `tel:${PHONE_NUMBER}`
                    : `telprompt:${PHONE_NUMBER}`;
                Linking.canOpenURL(URL) ? Linking.openURL(URL) : null;
              }}
            />
            <IconBtn
              iconColor={"#fff"}
              iconName="smartphone"
              size={46}
              backColor={primaryColor}
              onPress={() => {
                const PHONE_NUMBER = contactInfo.phoneNumbers[0].phoneNumber;
                var URL = `https://wa.me/${PHONE_NUMBER}`;
                Linking.canOpenURL(URL) ? Linking.openURL(URL) : null;
              }}
            />
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f7f7",
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    // alignItems: "center",
  },
  name: {
    fontSize: 25,
    fontWeight: "700",
    color: "#333",
  },
  organisation: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    marginTop: 3,
  },
  actionBtnsView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 1,
    marginTop: 20,
  },
});
