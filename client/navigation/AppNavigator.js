import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator, FinanceNavigator } from "./FinanceNavigator";
import StartupScreen from "../screens/StartupScreen";
import { navigationRef } from "../NavigationService";
const AppNavigator = (props) => {

  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAL = useSelector((state) => !!state.auth.didTryAutoLogin);

  return (
    <NavigationContainer ref={navigationRef}>
      {isAuth && <FinanceNavigator />}
      {!isAuth && didTryAL && <AuthNavigator />}
      {!isAuth && !didTryAL && <StartupScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
