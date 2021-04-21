import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth, firestore } from "../../Constants/Api";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import { sortArrayOfObjs } from "../../Shared/Functions";
import { Feather, Ionicons } from "@expo/vector-icons";
import CustomActivityIndicator from "../../Shared/Components/CustomActivityIndicator";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { showAlert } from "../../Redux/Alert/ActionCreator";
import { deleteFuelLog } from "../../Redux/FuelLog/ActionCreator";
import Collapsible from "../../Components/Accordian/Collapsable";

export default function FuelLog(props) {
  const theme = useSelector((state) => state.theme);
  const [isFuelLogLoading, setIsFuelLogLoading] = useState(false);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [statsHidden, setStatsHidden] = useState(true);
  const dispatch = useDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const { colors } = theme;

  const getFuelLog = () => {
    // console.log(auth.currentUser);
    if (!auth.currentUser) {
      dispatch(showSnack("You are not logged in!"));
      return;
    }
    setIsFuelLogLoading(true);
    firestore
      .collection("fuelLogs")
      .where("userId", "==", auth.currentUser.uid)
      // .endAt(5)
      .onSnapshot(
        (resp) => {
          let fuelLogs = [];
          resp.forEach((fuelLog) => {
            const data = fuelLog.data();
            const _id = fuelLog.id;
            fuelLogs.push({ _id, ...data });
          });
          const sortedFuelLogs = sortArrayOfObjs([...fuelLogs], "creationDate");
          setFuelLogs(sortedFuelLogs);
          setIsFuelLogLoading(false);
          // console.log(sortedScannedCodes.length);
        },
        (err) => {
          setIsFuelLogLoading(false);
          console.log("Erron in getting fuel log data\n", err.message);
        }
      );
  };

  const addLog = () => {
    props.navigation.navigate("AddFuelLog", { isEditing: false });
  };

  const openScannerOptionsSheet = (log) => {
    const options = ["Edit", "Delete", "Cancel"];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 2;
    const containerStyle = { backgroundColor: colors.backTwo };
    const textStyle = { color: colors.textOne };
    const icons = [
      <Feather name={"edit"} size={20} color={colors.textOne} />,
      <Feather name={"trash"} size={20} color={colors.textOne} />,
      <Feather name={"x"} size={20} color={colors.primaryErrColor} />,
    ];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
        containerStyle,
        textStyle,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          props.navigation.navigate("AddFuelLog", {
            isEditing: true,
            data: log,
          });
          return;
        }
        if (buttonIndex === 1) {
          dispatch(
            showAlert(
              "Do you want to delete this log?",
              "This action is permanent and can not be reverted!",
              () => dispatch(deleteFuelLog(log._id))
            )
          );
          return;
        }
      }
    );
  };

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingVertical: 14, paddingHorizontal: 30 }}
            onPress={() => setStatsHidden(!statsHidden)}
          >
            <Ionicons name="stats-chart" size={21} color={colors.textOne} />
          </TouchableOpacity>
        );
      },
    });
  };

  const calculateStats = () => {
    if (fuelLogs.length > 0) {
      //   total fuel is the total amount of fuel bought
      let totalFuel = 0;
      //   total cost is the total money spent on fuel
      let totalCost = 0;
      //   milage is the average number of kilometers per litel of fuel
      let totalKilometes = fuelLogs[0].odometerReading;
      fuelLogs.map((item, index) => {
        index === 0 ? null : totalFuel += parseFloat(item.fuelVolume);
        // console.log(parseFloat(item.fuelVolume));
        totalCost += item.fuelCost;
      });
      const milage = (totalKilometes / totalFuel).toFixed(3);
      return { totalCost, totalFuel, milage };
    }
    return { totalCost: 0, totalFuel: 0, milage: 0 };
  };

  useEffect(() => {
    setHeaderOptions();
  }, [statsHidden]);

  useEffect(() => {
    getFuelLog();
  }, []);
  const { totalCost, totalFuel, milage } = calculateStats();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backTwo }}>
      {isFuelLogLoading && <CustomActivityIndicator />}
      <Collapsible collapsed={statsHidden}>
        <View
          style={[styles.statsContainer, { backgroundColor: colors.backOne }]}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.logMainDataTxt, { color: colors.textOne }]}>
              {totalFuel} Lt
            </Text>
            <Text style={[styles.logMainDataTxt, { color: colors.textOne }]}>
              Total Fuel
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.logMainDataTxt, { color: colors.textOne }]}>
              {milage} Km/Lt
            </Text>
            <Text style={[styles.logMainDataTxt, { color: colors.textOne }]}>
              Average
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.logMainDataTxt, { color: colors.textOne }]}>
              {totalCost.toFixed(2)} ₹
            </Text>
            <Text style={[styles.logMainDataTxt, { color: colors.textOne }]}>
              Total Cost
            </Text>
          </View>
        </View>
      </Collapsible>
      <FlatList
        data={fuelLogs}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View style={{ marginVertical: 30, marginHorizontal: 40 }}>
            <Text
              style={{
                fontSize: 22,
                color: colors.textThree,
                alignSelf: "center",
              }}
            >
              You have not created any logs yet.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const dateInMillis = item.date.seconds * 1000;
          var date = new Date(dateInMillis).toDateString();
          // var date = new Date(dateInMillis).toDateString() + ' at ' + new Date(dateInMillis).toLocaleTimeString()
          return (
            <View
              style={[styles.logContainer, { backgroundColor: colors.backOne }]}
            >
              {/* <Text>{JSON.stringify(item, null, 2)}</Text> */}
              <View style={styles.dateContainer}>
                {/* log date */}
                <Text style={[styles.dateTxt, { color: colors.textOne }]}>
                  {date}
                </Text>
                <TouchableOpacity
                  onPress={() => openScannerOptionsSheet(item)}
                  style={{ padding: 10 }}
                >
                  <Feather
                    name="more-vertical"
                    color={colors.textOne}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              {/* log header data */}
              <View
                style={[
                  styles.logMainData,
                  { backgroundColor: colors.backTwo },
                ]}
              >
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={[styles.logMainDataTxt, { color: colors.textOne }]}
                  >
                    {item.fuelVolume} Lt
                  </Text>
                  <Text
                    style={[styles.logMainDataTxt, { color: colors.textOne }]}
                  >
                    Volume
                  </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={[styles.logMainDataTxt, { color: colors.textOne }]}
                  >
                    {item.unitPrice} ₹/Lt
                  </Text>
                  <Text
                    style={[styles.logMainDataTxt, { color: colors.textOne }]}
                  >
                    Unit Price
                  </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={[styles.logMainDataTxt, { color: colors.textOne }]}
                  >
                    {item.fuelCost} ₹
                  </Text>
                  <Text
                    style={[styles.logMainDataTxt, { color: colors.textOne }]}
                  >
                    Cost
                  </Text>
                </View>
              </View>
              <Text
                style={[styles.odometerReadingTxt, { color: colors.textOne }]}
              >
                OdoMeter reading : {item.odometerReading} KM
              </Text>
              <Text style={[styles.description, { color: colors.textOne }]}>
                {item.desc}
              </Text>
            </View>
          );
        }}
      />
      <TouchableOpacity
        style={[styles.addLogBtn, { backgroundColor: colors.primaryColor }]}
        onPress={addLog}
      >
        <Feather name="plus" size={23} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addLogBtn: {
    padding: 15,
    borderRadius: 30,
    elevation: 2,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  logContainer: {
    padding: 10,
    marginVertical: 5,
  },
  logMainData: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 6,
  },
  logMainDataTxt: {
    fontSize: 18,
    fontWeight: "700",
    paddingVertical: 2,
  },
  dateTxt: {
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  odometerReadingTxt: {
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  description: {
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  statsContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15
  },
});
