import React, { useState, useEffect } from 'react';
import Navigator from './src/Navigator/index';
import { Provider } from 'react-redux';
import { ConfigureStore } from './src/Redux/ReduxStore';
import { PersistGate } from 'redux-persist/integration/react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const { persistor, store } = ConfigureStore();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ActionSheetProvider>
          <Navigator />
        </ActionSheetProvider>
      </PersistGate>
    </Provider>
  );
}
