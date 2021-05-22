import React from "react";
import { SafeAreaView, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "../../Redux/Alert/ActionCreator";
import { toggleAppLock } from "../../Redux/AppLock/ActionCreator";
import { logoutUser } from "../../Redux/Auth/ActionCreator";
import { togglePassPageLock } from "../../Redux/PassPageLock/ActionCreator";
import { removeDataOnLogout } from "../../Redux/ScannedData/ActionCreator";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import { changeToDark, changeToLight } from "../../Redux/Theme/ActionCreator";
import { localAuth } from "../../Shared/Functions";
import ListTile from "./Components/ListTile";
import ProfileCard from "./Components/ProfileCard";

export default function Settings(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const useAppLock = useSelector((state) => state.useAppLock);
  const usePassPageLock = useSelector((state) => state.usePassPageLock);
  const dispatch = useDispatch();

  const navigateToEdit = () => {
    props.navigation.navigate("EditProfile");
  };

  const appLockHandler = async () => {
    if (useAppLock) {
      const iseLocalAuthDone = await localAuth();
      iseLocalAuthDone
        ? dispatch(toggleAppLock(false))
        : dispatch(showSnack("Authentication required!"));
    } else {
      dispatch(toggleAppLock(true));
    }
  };

  const passPageLockHandler = async () => {
    if (usePassPageLock) {
      const iseLocalAuthDone = await localAuth();
      iseLocalAuthDone
        ? dispatch(togglePassPageLock(false))
        : dispatch(showSnack("Authentication required!"));
    } else {
      dispatch(togglePassPageLock(true));
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      <ProfileCard
        navigateToEdit={navigateToEdit}
        imageViewerFunc={(imgData) => {
          props.navigation.navigate("ImageViewer", {
            imgData,
            removeImage: null,
          });
        }}
      />
      <ListTile
        tileText={theme.mode ? "Enable dark mode" : "Disable dark mode"}
        rightIcon={theme.mode ? "sun" : "moon"}
        style={{ marginTop: 10 }}
        onPress={() =>
          theme.mode ? dispatch(changeToDark()) : dispatch(changeToLight())
        }
      />
      <ListTile
        tileText={useAppLock ? "Disable app lock" : "Enable app lock"}
        rightIcon={useAppLock ? "lock" : "unlock"}
        style={{ marginTop: 1 }}
        onPress={() => appLockHandler()}
        rightIconColor={useAppLock ? null : colors.primaryErrColor}
      />
      <ListTile
        tileText={
          usePassPageLock
            ? "Disable password page lock"
            : "Enable password page lock"
        }
        rightIcon={usePassPageLock ? "lock" : "unlock"}
        style={{ marginTop: 1 }}
        onPress={() => passPageLockHandler()}
        rightIconColor={usePassPageLock ? null : colors.primaryErrColor}
      />
      <ListTile
        tileText={"Change password"}
        rightIcon={"chevron-right"}
        style={{ marginTop: 10 }}
        onPress={() => props.navigation.navigate("ChangePasswd")}
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
