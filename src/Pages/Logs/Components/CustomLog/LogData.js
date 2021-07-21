import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { FAB } from "react-native-paper";
import { auth, firestore } from "../../../../Constants/Api";
import { sortArrayOfObjs } from "../../../../Shared/Functions";
import { showSnack } from "../../../../Redux/Snack/ActionCreator";

export default function LogData(props) {
  const { data: loggerData } = props.route.params;
  console.log("logger id", loggerData._id);

  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const dispatch = useDispatch();

  const [logs, setLogs] = useState([]);

  const dataTypes = [
    "URL", // 0
    "Text", // 2
    "Number", // 3
    "Email", // 4
    "Date", // 5
    "Location", // 6
  ];

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      title: loggerData.title,
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingVertical: 14, paddingHorizontal: 30 }}
            // onPress={() => setStatsHidden(!statsHidden)}
          >
            <Ionicons
              name={"ios-information-circle-outline"}
              size={23}
              color={colors.textOne}
            />
          </TouchableOpacity>
        );
      },
    });
  };

  const getLogs = () => {
    // console.log(auth.currentUser);
    if (!auth.currentUser) {
      dispatch(showSnack("You are not logged in!"));
      return;
    }
    // setAreLogsLoading(true);
    firestore
      .collection("logs")
      .where("userId", "==", auth.currentUser.uid)
      .where("loggerId", "==", loggerData._id)
      .onSnapshot(
        (resp) => {
          let logs = [];
          resp.forEach((log) => {
            const data = log.data();
            const _id = log.id;
            logs.push({ _id, ...data });
          });
          const sortedLogs = sortArrayOfObjs([...logs], "createdOn");
          setLogs(sortedLogs);
          // setAreLogsLoading(false);
          // console.log(sortedScannedCodes.length);
        },
        (err) => {
          // setAreLogsLoading(false);
          dispatch(showSnack("Error in getting logs!, please try again."));
          console.log("Erron in getting fuel log data\n", err.message);
        }
      );
  };

  useEffect(() => {
    setHeaderOptions();
    getLogs();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                backgroundColor: colors.backOne,
                paddingHorizontal: 15,
                paddingVertical: 10,
                marginTop: 5,
              }}
            >
              <Text style={{ fontSize: 17 }}>{item.title}</Text>
            </View>
          );
        }}
      />
      {/* FAB */}
      <FAB
        style={[styles.fab, { backgroundColor: colors.primaryColor }]}
        icon="plus"
        onPress={() => props.navigation.navigate("AddLog", { loggerData })}
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
