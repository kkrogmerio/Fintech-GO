import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,

} from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  TouchableNativeFeedback,
  Alert,
  Modal,

} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import { horizontalLine } from "../../constants/Styles";
import { stylesModal } from "../../components/UI/MyModal";
import * as authActions from "../../store/actions/auth";

const LOGIN_INPUT_UPDATE = "LOGIN_INPUT_UPDATE";
const RESET_INPUT_UPDATE = "RESET_INPUT_UPDATE";
const RECOVER_PASSWORD = "RECOVER_PASSWORD";
const FORGET_PASSWORD = "FORGET_PASSWORD";

const formReducer = (state, action) => {
  if (action.type === LOGIN_INPUT_UPDATE) {
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
const confirmReducer = (state, action) => {
  if (action.type === RECOVER_PASSWORD) {

    return {
      ...state,
      modalStages: {
        ...state.modalStages,
        recoverModal: false,
        closeModal: true,
      },
    };
  }
  if (action.type === FORGET_PASSWORD) {
    return {
      ...state,
      modalStages: {
        ...state.modalStages,
        recoverModal: true,
      },
    };
  }
  if (action.type === RESET_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };

    return {
      ...state,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};
const LoginScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState();
  const [visibleModal, setVisibleModal] = useState(false);
  const dispatch = useDispatch();
  const [confirmState, dispatchConfirmState] = useReducer(confirmReducer, {
    modalStages: {
      recoverModal: false,

      closeModal: false,
    },
    inputValues: {
      email: "",
    },
    inputValidities: {
      email: false,
    },
  });



  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);
  useEffect(() => {
    return () => {
      setError(false);
      setIsLoading(false);
    };
  });
  const fbLogin = async () => {
    setError(null);
    setFbLoading(true);
    try {
      await dispatch(authActions.fbLogin());
    } catch (err) {
      setError(err.message);
      setFbLoading(false);
    }
  };
  const forgotPassword = () => {
    setVisibleModal(true);
    dispatchConfirmState({ type: FORGET_PASSWORD });
  };

  const googleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {

      await dispatch(authActions.googleLogin());

    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setGoogleLoading(false);
    }
  };
  const authHandler = async () => {
    let action;

    action = authActions.login(
      formState.inputValues.email,
      formState.inputValues.password
    );

    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: LOGIN_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );
  const inputChangePasswordHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {

      dispatchConfirmState({
        type: RESET_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchConfirmState]
  );

  const recoverHandler = async () => {
    setError(null);

    try {
      await authActions.recoverPassword(confirmState.inputValues.email);

      dispatchConfirmState({ type: RECOVER_PASSWORD });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen}>
      <LinearGradient colors={["#F0FFFF", "#6495ED"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
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
            <View style={styles.buttonLoginContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <TouchableNativeFeedback
                  style={styles.login}
                  color={Colors.primary}
                  onPress={authHandler}
                >
                  <View style={styles.loginText}>
                    <Text style={{ fontSize: 25, color: "white" }}>Login</Text>
                  </View>
                </TouchableNativeFeedback>
              )}
            </View>
            <TouchableNativeFeedback
              style={styles.login}
              onPress={forgotPassword}
            >
              <Text style={styles.forgotPassword}>Forget your password?</Text>
            </TouchableNativeFeedback>
            <View style={styles.buttonContainer}>
              {fbLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title="Sign in with Facebook"
                  color={Colors.facebook}
                  onPress={fbLogin}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              {googleLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title="Sign in with Google"
                  color={Colors.google}
                  onPress={googleLogin}
                />
              )}
            </View>

            <View>
              <View style={{ flexDirection: "row" }}>
                <View style={horizontalLine} />
                <Text
                  style={{
                    alignSelf: "center",
                    paddingHorizontal: 5,
                    fontSize: 15,
                  }}
                >
                  Or create a new account
                </Text>
                <View style={horizontalLine} />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Sign Up"
                color={Colors.accent}
                onPress={() => {
                  props.navigation.navigate("Register");
                }}
              />
            </View>
            <Modal
              visible={visibleModal}
              transparent={true}
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
                  {confirmState.modalStages.recoverModal && (
                    <Text>Please enter your email address'</Text>
                  )}

                  {confirmState.modalStages.closeModal && (
                    <Text>
                      Check your mail and follow the instructions for recovering
                      your password'
                    </Text>
                  )}
                </Text>
                <View style={stylesModal.textContainer}>
                  {!confirmState.modalStages.closeModal && (
                    <Input
                      style={stylesModal.input}
                      placeholder="                                 "
                      id={"email"}
                      email

                      label={"Enter your email"}
                      keyboardType="default"
                      required
                      minLength={5}
                      autoCapitalize="none"
                      errorText="Please enter a valid value."
                      onInputChange={inputChangePasswordHandler}
                    />
                  )}
                </View>
                <View style={stylesModal.confirmButton}>
                  <TouchableNativeFeedback
                    onPress={() => {
                      if (confirmState.modalStages.recoverModal)
                        recoverHandler();
                      else setVisibleModal(false);
                    }}
                  >
                    <Text style={{ fontSize: 25, color: "white" }}>
                      {(confirmState.modalStages.recoverModal && "Confirm") ||
                        (confirmState.modalStages.closeModal && "OK")}
                    </Text>
                  </TouchableNativeFeedback>

                </View>
                <View style={{ position: "absolute", top: 0, right: 0 }}>
                  <Button
                    style={{ opacity: 0.93 }}
                    title="Close pop-up"
                    onPress={() => {
                      setVisibleModal(false);
                    }}
                  ></Button>
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
  lineStyle: {
    borderWidth: 0.5,
    borderColor: "black",
    margin: 10,
  },

  betweenSections: {
    borderBottomWidth: 1,
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
  login: {
    marginTop: 140,
  },
  authContainer: {
    width: "85%",
    height: "70%",
    maxWidth: 400,
    maxHeight: 600,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  buttonLoginContainer: {
    marginTop: 10,
    width: 140,
    marginLeft: 100,
  },
  forgotPassword: {
    color: "blue",
    position: "relative",
    marginLeft: 150,
    marginTop: 10,
  },
  loginText: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 100,
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: Colors.primary,
    borderRadius: 10,
  },
});

export default LoginScreen;
