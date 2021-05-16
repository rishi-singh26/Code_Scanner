import React from "react";
import { SafeAreaView, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "../../Redux/Alert/ActionCreator";
import { logoutUser } from "../../Redux/Auth/ActionCreator";
import { removeDataOnLogout } from "../../Redux/ScannedData/ActionCreator";
import { changeToDark, changeToLight } from "../../Redux/Theme/ActionCreator";
import ListTile from "./Components/ListTile";
import ProfileCard from "./Components/ProfileCard";

export default function Settings(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const dispatch = useDispatch();

  const navigateToEdit = () => {
    props.navigation.navigate("EditProfile");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      <ProfileCard navigateToEdit={navigateToEdit} />
      <ListTile
        tileText={theme.mode ? "Enable dark mode" : "Disable dark mode"}
        rightIcon={theme.mode ? "moon" : "sun"}
        style={{ marginTop: 10 }}
        onPress={() =>
          theme.mode ? dispatch(changeToDark()) : dispatch(changeToLight())
        }
      />
      <ListTile
        style={{ marginTop: 1 }}
        tileText={"Log-out"}
        rightIcon={"log-out"}
        rightIconColor={colors.primaryErrColor}
        onPress={() => {
          dispatch(
            showAlert("Alert", "Do you want to logout?", () => {
              dispatch(logoutUser());
              dispatch(removeDataOnLogout());
            })
          );
        }}
      />
    </SafeAreaView>
  );
}
