import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth, firestore } from "../../Constants/Api";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import CollapsibleSearchBar from "../../Shared/Components/CollapsibleSearchBar";
import {
  convertFirebaseDateToDate,
  createFuelLogger,
  sortArrayOfObjs,
} from "../../Shared/Functions";
import LogTile from "./Components/LogTile";
import CustomActivityIndicator from "../../Shared/Components/CustomActivityIndicator";
import { FAB } from "react-native-paper";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import Prompt from "../../Shared/Components/Prompt";

export default function Loggers(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const dispatch = useDispatch();

  const [searchKey, setSearchKey] = useState("");
  const [logs, setLogs] = useState([]);
  const [areLogsLoading, setAreLogsLoading] = useState(true);
  const [fuelLoggerName, setFuelLoggerName] = useState("");
  const [fuelLoggerNamePromptVisible, setFuelLoggerNamePromptVisible] =
    useState(false);

  // Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();

  const snack = (message) => {
    dispatch(showSnack(message));
  };

  const getLoggers = () => {
    // console.log(auth.currentUser);
    if (!auth.currentUser) {
      dispatch(showSnack("You are not logged in!"));
      return;
    }
    setAreLogsLoading(true);
    firestore
      .collection("loggers")
      .where("userId", "==", auth.currentUser.uid)
      .onSnapshot(
        (resp) => {
          let logs = [];
          resp.forEach((log) => {
            const data = log.data();
            const _id = log.id;
            logs.push({ _id, ...data });
          });
          const sortedLogs = sortArrayOfObjs([...logs], "creationDate");
          setLogs(sortedLogs);
          setAreLogsLoading(false);
          // console.log(sortedScannedCodes.length);
        },
        (err) => {
          setAreLogsLoading(false);
          dispatch(showSnack("Error in getting logs!, please try again."));
          console.log("Erron in getting fuel log data\n", err.message);
        }
      );
  };

  const openUnlockedNoteActions = () => {
    const options = ["Fuel logger", "Custom logger", "Cancel"];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 2;
    const containerStyle = { backgroundColor: colors.backTwo };
    const textStyle = { color: colors.textOne };
    const icons = [
      <Ionicons name={"bonfire-outline"} size={20} color={colors.textOne} />,
      <Ionicons name={"settings-outline"} size={20} color={colors.textOne} />,
      <Ionicons
        name={"close-outline"}
        size={20}
        color={colors.primaryErrColor}
      />,
    ];
    const message = `Select logger type`;
    const messageTextStyle = {
      fontSize: 17,
      fontWeight: "700",
      color: colors.textOne,
    };

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
        containerStyle,
        textStyle,
        message,
        messageTextStyle,
      },
      async (buttonIndex) => {
        if (buttonIndex == 0) {
          // createFuelLogger(
          //   () => snack("Authentication error, logout and login again"),
          //   () => snack("Logger created successfully"),
          //   () => snack("Error in creating logger, please try again"),
          //   "New fuel Logger"
          // );
          setFuelLoggerNamePromptVisible(true);
          return;
        }
        if (buttonIndex == 1) {
          props.navigation.navigate("CreateLogger");
          return;
        }
      }
    );
  };

  const handleLogPress = (log) => {
    if (log.loggerTypeId == 1) {
      props.navigation.navigate("FuelLog", { data: log });
      return;
    }
    if (log.loggerTypeId == 0) {
      props.navigation.navigate("LogsList", { data: log });
    }
  };

  const cancelFuelLoggerPrompt = () => {
    setFuelLoggerName("");
    setFuelLoggerNamePromptVisible(false);
  };

  const createLoggerPress = () => {
    createFuelLogger(
      () => snack("Authentication error, logout and login again"),
      () => snack("Logger created successfully"),
      () => snack("Error in creating logger, please try again"),
      fuelLoggerName
    );
    setFuelLoggerNamePromptVisible(false);
    setFuelLoggerName("");
  };

  useEffect(() => {
    getLoggers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backOne }}>
      {/* Search bar */}
      <CollapsibleSearchBar
        onTextChange={(text) => setSearchKey(text)}
        onXPress={() => setSearchKey("")}
        searchKey={searchKey}
      />
      {/* Loading indicator */}
      {areLogsLoading && <CustomActivityIndicator />}
      {/* Log list */}
      <FlatList
        data={logs}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item, index }) => {
          return (
            <LogTile
              tileText={item.title}
              titleSubText={convertFirebaseDateToDate(
                item.creationDate
              ).toDateString()}
              rightIcon={"more-vertical"}
              style={{ marginTop: 2 }}
              onPress={() => handleLogPress(item)}
              rightIconColor={colors.textOne}
              onRightIconPress={() => dispatch(showSnack("hola options"))}
            />
          );
        }}
      />
      {/* FAB */}
      <FAB
        style={[styles.fab, { backgroundColor: colors.primaryColor }]}
        icon="plus"
        onPress={openUnlockedNoteActions}
      />
      <Prompt
        title={"Enter fuel logger name"}
        text={fuelLoggerName}
        setText={setFuelLoggerName}
        onOkPress={createLoggerPress}
        onCancelPress={cancelFuelLoggerPrompt}
        visible={fuelLoggerNamePromptVisible}
        hotBtnText={"Create logger"}
        placeholderTxt={"Logger name"}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
