import React from "react";
// import {
//   createSwitchNavigator,
//   createAppContainer,

// } from 'react-navigation';
// import {createStackNavigator} from 'react-navigation-stack'
// import {
//   createDrawerNavigator,
//   DrawerNavigatorItems,
// } from "react-navigation-drawer";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  Platform,
  SafeAreaView,
  Button,
  View,

  Image,
  Text,
  ActivityIndicator,

} from "react-native";

import LoginScreen, {
  screenOptions as loginOptions,
} from "../screens/user/LoginScreen";
import RegisterScreen, {
  screenOptions as registerOptions,
} from "../screens/user/RegisterScreen";
import AccountOverviewScreen, {
  screenOptions as accountOverviewOptions,
} from "../screens/finance/Accounts/AccountsOverview";

import AddAccountScreen, {
  screenOptions as addAccountOptions,
} from "../screens/finance/Accounts/AddAccount";


import NotesScreen, {
  screenOptions as notesOptions,
} from "../screens/finance/Expenses/Notes";
import NoteDetailsScreen, {
  screenOptions as noteDetailsOptions,
} from "../screens/finance/Expenses/NoteDetails";
import TransactionsScreen, {
  screenOptions as transactionsOptions,
} from "../screens/finance/Expenses/Transactions";
import AlertScreen from "../screens/finance/Expenses/Alert";
import SavingsScreen, {
  screenOptions as savingsOptions,
} from "../screens/finance/Expenses/Savings";
import NewTransactionScreen, {
  screenOptions as newTransactionOptions,
} from "../screens/finance/Expenses/NewTransaction";
import PortfolioOverviewScreen, {
  screenOptions as portfolioOptions,
} from "../screens/finance/Portfolio/PortfolioOverview";

import NewsScreen, {
  screenOptions as newsOptions,
} from "../screens/finance/Portfolio/News";
import NewsWebScreen, {
  screenOptions as newsWebScreenOptions,
} from "../screens/finance/NewsWebView";
import UpdateProfileScreen, {
  screenOptions as updateProfileOptions,
} from "../screens/user/UpdateProfile";
import ProfileScreen, {
  screenOptions as profileOptions,
} from "../screens/user/Profile";
import SettingsScreen, {
  screenOptions as settingsOptions,
} from "../screens/user/Settings";
import HomeScreen, {
  screenOptions as homeOptions,
} from "../screens/finance/Home";
import Colors from "../constants/Colors";
import { drawerStyle, imageProfileStyle, tabStyle } from "../constants/Styles";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../store/actions/auth";
import { fetchProfile, updateProfilePicture } from "../store/actions/profile";
import { ImgPicker } from "./NavigationMethods";
const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};
const AccountStackNavigator = createStackNavigator();
export const AccountNavigator = () => {
  return (
    <AccountStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AccountStackNavigator.Screen
        name="AccountOverview"
        component={AccountOverviewScreen}
        options={accountOverviewOptions}
      />
      <AccountStackNavigator.Screen
        name="AddAccount"
        component={AddAccountScreen}
        options={addAccountOptions}
      />
    </AccountStackNavigator.Navigator>
  );
};
const HomeStackNavigator = createStackNavigator();
export const HomeNavigator = () => {
  return (
    <HomeStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <HomeStackNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={homeOptions}
      />
    </HomeStackNavigator.Navigator>
  );
};
const ProfileStackNavigator = createStackNavigator();
export const ProfileNavigator = () => {
  return (
    <ProfileStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProfileStackNavigator.Screen
        name="Profile"
        component={ProfileScreen}
        options={profileOptions}
      />
      <ProfileStackNavigator.Screen
        name="UpdateProfile"
        component={UpdateProfileScreen}
        options={updateProfileOptions}
      />
    </ProfileStackNavigator.Navigator>
  );
};

const SavingsStackNavigator = createStackNavigator();
export const SavingsNavigator = () => {
  return (
    <SavingsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <SavingsStackNavigator.Screen
        name="Savings"
        component={SavingsScreen}
        options={savingsOptions}
      />
      <SavingsStackNavigator.Screen name="Alert" component={AlertScreen} />

      <SavingsStackNavigator.Screen
        name="NoteDetails"
        component={NoteDetailsScreen}
        options={noteDetailsOptions}
      />
      <SavingsStackNavigator.Screen
        name="Note"
        component={NotesScreen}
        options={notesOptions}
      />
    </SavingsStackNavigator.Navigator>
  );
};
const ResearchStackNavigator = createStackNavigator();
export const ResearchNavigator = () => {
  return (
    <ResearchStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ResearchStackNavigator.Screen
        name="News"
        component={NewsScreen}
        options={newsOptions}
      />
      <ResearchStackNavigator.Screen
        name="SignedNewsWebView"
        component={NewsWebScreen}
        options={newsWebScreenOptions}
      />
    </ResearchStackNavigator.Navigator>
  );
};
const SettingsStackNavigator = createStackNavigator();
export const SettingsNavigator = () => {
  return (
    <SettingsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <SettingsStackNavigator.Screen
        name="Settings"
        component={SettingsScreen}
        options={settingsOptions}
      />
    </SettingsStackNavigator.Navigator>
  );
};
const NewTransactionStackNavigator = createStackNavigator();
export const NewTransactionNavigator = () => {
  return (
    <NewTransactionStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ExpensesStackNavigator.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={transactionsOptions}
      />
      <NewTransactionStackNavigator.Screen
        name="NewTransaction"
        component={NewTransactionScreen}
        options={newTransactionOptions}
      />
    </NewTransactionStackNavigator.Navigator>
  );
};

const ExpensesStackNavigator = createStackNavigator();

const ExpensesTabNavigator = createBottomTabNavigator();
export const ExpensesNavigator = () => {
  return (
    
    <ExpensesTabNavigator.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Transactions") {
            iconName = focused ? "ios-cash" : "ios-cash-outline";
          } else if (route.name === "DoSavings") {
            iconName = focused ? "ios-card" : "ios-card-outline";
          }
          return <Ionicons name={iconName} size={40} color="blue" />;
        },
      })}
      tabBarOptions={{
        style: { backgroundColor: Colors.navigationColor, height: 65 },
        activeTintColor: "black",
        inactiveTintColor: "gray",
      }}
    >
      <ExpensesTabNavigator.Screen
        name="Transactions"
        component={NewTransactionNavigator}
      />
      <ExpensesTabNavigator.Screen
        name="DoSavings"
        component={SavingsNavigator}
      />
    </ExpensesTabNavigator.Navigator>
  );
};
const PortfolioStackNavigator = createStackNavigator();
export const PortfolioOverviewNavigator = () => {
  return (
    <PortfolioStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <PortfolioStackNavigator.Screen
        name="PortfolioOverview"
        component={PortfolioOverviewScreen}
        options={portfolioOptions}
      />
    </PortfolioStackNavigator.Navigator>
  );
};
const PortfolioTabNavigator = createBottomTabNavigator();
export const PortfolioNavigator = () => {
  return (
    <PortfolioTabNavigator.Navigator
      tabBarStyle={tabStyle}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Portfolio") {
            iconName = focused ? "ios-albums" : "ios-albums-outline";
          } else if (route.name === "DoResearch") {
            iconName = focused ? "ios-analytics" : "ios-analytics-outline";
          }

          return <Ionicons name={iconName} size={40} color="blue" />;
        },
      })}
      tabBarOptions={{
        style: { backgroundColor: Colors.navigationColor, height: 65 },
        activeTintColor: "black",
        inactiveTintColor: "gray",
      }}
    >
      <PortfolioTabNavigator.Screen
        name="Portfolio"
        component={PortfolioOverviewNavigator}
      />
      <PortfolioTabNavigator.Screen
        name="DoResearch"
        component={ResearchNavigator}
      />
    </PortfolioTabNavigator.Navigator>
  );
};

const FinanceDrawerNavigator = createDrawerNavigator();
export const FinanceNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);

    dispatch(fetchProfile()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);
  const updateProfilePictureHandler = (image) => {
    dispatch(updateProfilePicture(image.uri));
  };

  let profile = useSelector((state) => state.deepProfile);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <FinanceDrawerNavigator.Navigator
      drawerStyle={drawerStyle}
      drawerContent={(props) => {
        return (
          <View
            style={{
              flex: 1,
              paddingTop: 20,
              opacity: 1,
            }}
          >
            <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 100,
                }}
              >
                <Image
                  style={imageProfileStyle}
                  source={{ uri: profile.profilePic }}
                  accessibilityLabel="label"
                />
                <ImgPicker onImageTaken={updateProfilePictureHandler} />
                <Text style={{ fontSize: 30, fontFamily: "open-sans" }}>
                  {profile.userName}
                </Text>
              </View>
              <View style={{ marginTop: 100 }}>
                <DrawerItemList {...props} />
                <View style={{ marginTop: "5%" }}>
                  <Button
                    title="Logout"
                    color={Colors.primary}
                    onPress={() => {
                      dispatch(authActions.logout());
                    }}
                  />
                </View>
              </View>
            </SafeAreaView>
          </View>
        );
      }}
      drawerContentOptions={{
        activeTintColor: Colors.primary,
        contentContainerStyle: { width: "100%" },
        itemStyle: { marginVertical: 11, marginHorizontal: 8 },
        style: { backgroundColor: "blue" },
      }}
    >
      <FinanceDrawerNavigator.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-home" : "ios-home"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
      <FinanceDrawerNavigator.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-person" : "ios-person"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
      <FinanceDrawerNavigator.Screen
        name="Portfolio"
        component={PortfolioNavigator}
        options={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-folder" : "ios-folder"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />

      <FinanceDrawerNavigator.Screen
        name="Expenses"
        component={ExpensesNavigator}
        options={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />

      <FinanceDrawerNavigator.Screen
        name="Bank Account"
        component={AccountNavigator}
        options={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-card" : "ios-card"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />

      <FinanceDrawerNavigator.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-settings" : "ios-settings"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
    </FinanceDrawerNavigator.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={loginOptions}
      />
      <AuthStackNavigator.Screen
        name="Register"
        component={RegisterScreen}
        options={registerOptions}
      />
      <ResearchStackNavigator.Screen
        name="UnsignedNewsWebView"
        component={NewsWebScreen}
      />
    </AuthStackNavigator.Navigator>
  );
};
