import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { auth } from "../../../Constants/Api";
import { useSelector } from "react-redux";

export default function ProfileCard(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const { navigateToEdit } = props;

  return (
    <View style={[styles.headerCard, { backgroundColor: colors.backOne }]}>
      <View>
        {auth?.currentUser?.displayName ? (
          <Text style={styles.displayNameTxt}>
            {auth.currentUser.displayName}
          </Text>
        ) : (
          <Text
            onPress={navigateToEdit}
            style={[styles.displayNameTxt, { color: colors.primaryColor }]}
          >
            Update profile
          </Text>
        )}
        <Text style={styles.emailTxt}>
          {auth?.currentUser?.email || "Display name"}
        </Text>
      </View>
      {auth?.currentUser?.photoURL ? (
        <TouchableOpacity
          onPress={() => console.log("jhjh")}
          style={{ borderRadius: 20 }}
        >
          <Image
            source={{ uri: auth.currentUser.photoURL }}
            width={60}
            height={60}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={navigateToEdit}
          style={[
            styles.imageEditIconStyle,
            { backgroundColor: colors.backThree },
          ]}
        >
          <Feather name="edit-2" size={18} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 20,
    marginTop: 10,
  },
  displayNameTxt: {
    fontSize: 22,
    fontWeight: "700",
  },
  emailTxt: {
    fontSize: 17,
    fontWeight: "700",
    color: "#777",
    marginTop: 10,
  },
  imageEditIconStyle: {
    padding: 20,
    borderRadius: 40,
  },
});
