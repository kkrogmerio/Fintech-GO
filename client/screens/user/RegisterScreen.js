import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
  TextInput,
} from "react-native";
import { stylesModal } from "../../components/UI/MyModal";

import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const RegisterScreen = (props) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [verifCode, setVerifCode] = useState("");
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
      name: "",
    },
    inputValidities: {
      email: false,
      password: false,
      name: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);
  useEffect(() => {}, [dispatch]);
  const registerHandler = async () => {

    setError(null);
    setIsLoading(true);
    try {
      await authActions.sendMail(formState.inputValues.email, true);
      setVisibleModal(true);

    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const confirmHandler = async () => {
    let action;

    let validMail = await authActions.verifyMail(
      formState.inputValues.email,
      verifCode
    );

    if (!validMail) setError("Wrong token id");
    else {
      try {

        action = authActions.signup(
          formState.inputValues.email,
          formState.inputValues.password,
          formState.inputValues.name,
          null,
          null
        );

        setError(null);
        setIsLoading(true);

        await dispatch(action);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView style={styles.screen}>
      <LinearGradient colors={["#F0FFFF", "#6495ED"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="name"
              label="Full name"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="words"
              errorText="Please enter your full name."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />

            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title="Register"
                  color={Colors.primary}
                  onPress={registerHandler}
                />
              )}
            </View>

            <View style={styles.betweenSections}>
              <Text style={{ fontSize: 15 }}>
                If you have already an account , please login
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Login"
                color={Colors.accent}
                onPress={() => {
                  props.navigation.navigate("Login");
                }}
              />
            </View>
            <Modal
              visible={visibleModal}
              onDismiss={() => {
                setVisibleModal(false);
              }}
              style={{
                margin: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={stylesModal.modalContainer}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Please enter the code received via email to verify your
                  account
                </Text>
                <View style={stylesModal.textContainer}>
                  <TextInput
                    style={stylesModal.input}
                    placeholder="Verification code"
                    id="verifCode"
                    label="Verification code"
                    keyboardType="default"
                    required
                    minLength={5}
                    autoCapitalize="none"
                    errorText="Please enter a valid verification code."
                    onChangeText={(text) => {
                      setVerifCode(text);
                    }}
                  />
                </View>
                <View style={styles.confirmButton}>
                  <Button
                    title="Confirm verification code "
                    onPress={confirmHandler}
                  />
                </View>
                <View style={{ position: "absolute", top: 0, right: 0 }}>
                  <Button
                    style={{ opacity: 0.93 }}
                    title="Close pop-up"
                    onPress={() => {
                      setVisibleModal(false);
                    }}
                  />
                </View>
              </View>
            </Modal>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = {
  headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  confirmButton: {
    borderRadius: 10,
  },
  input: {
    height: 40,
    width: Dimensions.get("window").width * 0.95,
    borderWidth: 1,
    backgroundColor: "white",
  },
  betweenSections: {
    alignItems: "center",
    marginVertical: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    position: "absolute",
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    width: 300,
    height: 300,
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 500,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default RegisterScreen;
