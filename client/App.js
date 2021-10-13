import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { navigationRef } from "./NavigationService";
import ReduxThunk from "redux-thunk";

import mockFinanceDataReducer from "./store/reducers/mockFinanceData";

import accountsReducer from "./store/reducers/accounts";
import notesReducer from "./store/reducers/notes";
import transactionsReducer from "./store/reducers/transactions";
import currencyReducer from "./store/reducers/currency";
import investmentsReducer from "./store/reducers/investments";
import deepProfileReducer from "./store/reducers/deepProfile";

import newsReducer from "./store/reducers/news";
import AppNavigator from "./navigation/AppNavigator";
import authReducer from "./store/reducers/auth";

import * as Firebase from "firebase";
import { firebaseConfig } from "./env";
import { init } from "./helpers/db";
import PushNotification from "react-native-push-notification";

init()
  .then(() => {
    console.log("Initialized database");
  })
  .catch((err) => {
    console.log("Initializing db failed.");
    console.log(err);
  });
if (Firebase.apps.length === 0) {
  Firebase.initializeApp(firebaseConfig);
  PushNotification.localNotification({ ignoreInForeground: false });
  PushNotification.configure({
    onNotification: function (notification) {
      setTimeout(() => {
        if (store.getState().auth.token) {
          navigationRef.current?.navigate("Portfolio", {
            screen: "DoResearch",
            params: {
              screen: "SignedNewsWebView",
              params: {
                url: notification.data.url,
                title: notification.data.title,
                company: notification.data.company,
                addNews: true,
              },
            },
          });
        } else {
          navigationRef.current?.navigate("UnsignedNewsWebView", {
            url: notification.data.url,
            title: notification.data.title,
            company: notification.data.company,
            addNews: false,
          });
        }
      }, 1500);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    show_in_background: true,
    requestPermissions: true,
  });
}


// Firebase.auth().onAuthStateChanged((user) => {
//   if (user != null) {
//     console.log("We are authenticated now!");
//   }
// });

const rootReducer = combineReducers({
  investments: investmentsReducer,
  mockFinanceData: mockFinanceDataReducer,
  auth: authReducer,
  news: newsReducer,
  deepProfile: deepProfileReducer,
  accounts: accountsReducer,
  notes: notesReducer,

  currency: currencyReducer,
  transactions: transactionsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onError={() => {}}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
