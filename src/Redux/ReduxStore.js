import { createStore, combineReducers, applyMiddleware } from "redux";
import { ScannedData } from "./ScannedData/index";

import thunk from "redux-thunk";
import logger from "redux-logger";

import { persistStore, persistCombineReducers } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

export const ConfigureStore = () => {
  const config = {
    key: "root",
    storage: AsyncStorage,
    debug: true,
    blacklist: [],
  };
  const store = createStore(
    persistCombineReducers(config, {
      scannedData: ScannedData
    }),
    applyMiddleware(thunk)
  );

  const persistor = persistStore(store);

  return { persistor, store };
};
