import { createStore, combineReducers, applyMiddleware } from "redux";
import { ScannedData } from "./ScannedData/index";
import { Auth } from "./Auth/Auth";
import { Snack } from "./Snack/Snack";
import { Theme } from "./Theme/Theame";
import { Alert } from "./Alert/Alert";
import { FuelLogs } from "./FuelLog/FuelLog";
import { UseAppLock } from "./AppLock/AppLock";
import { UsePassPageLock } from "./PassPageLock/PassPageLock";
import { Uris } from "./LocalURIs/URIs";

import thunk from "redux-thunk";
import logger from "redux-logger";

import { persistStore, persistCombineReducers } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ConfigureStore = () => {
  const config = {
    key: "root",
    storage: AsyncStorage,
    debug: true,
    blacklist: ["snack", "alert", "uris"],
  };
  const store = createStore(
    persistCombineReducers(config, {
      scannedData: ScannedData,
      auth: Auth,
      snack: Snack,
      theme: Theme,
      alert: Alert,
      fuelLogs: FuelLogs,
      useAppLock: UseAppLock,
      usePassPageLock: UsePassPageLock,
      uris: Uris,
    }),
    applyMiddleware(thunk)
  );

  const persistor = persistStore(store);

  return { persistor, store };
};
