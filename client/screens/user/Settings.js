import React, { useState, useReducer, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { stylesModal } from "../../components/UI/MyModal";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Button,
  Image,
  TouchableNativeFeedback,
  Alert,
  TextInput,
  ToastAndroid,
} from "react-native";
import Input from "../../components/UI/Input";
export const USD = "USD";
export const EUR = "EUR";
export const RON = "RON";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { centered, cardContainer } from "../../constants/Styles";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";
import HeaderButton from "../../components/UI/HeaderButton";
import { LinearGradient } from "expo-linear-gradient";
import Card from "../../components/UI/Card";
const CHANGE_PASSWORD = "CHANGE_PASSWORD";
const CHANGE_MAIL = "CHANGE_MAIL";
const CONFIRM_PASSWORD = "CONFIRM_PASSWORD";
const CONFIRM_MAIL = "CONFIRM_MAIL";
const RESET_INPUT_UPDATE = "RESET_INPUT_UPDATE";
export const confirmReducer = (state, action) => {
  if (action.type === CHANGE_PASSWORD) {

    return {
      ...state,
      modalStages: {
        ...state.modalStages,
        changeMailModal: false,
        confirmMailModal: false,
        confirmPasswordModal: false,
        changePasswordModal: true,
      },
    };
  }
  if (action.type === CHANGE_MAIL) {
    return {
      ...state,
      modalStages: {
        ...state.modalStages,
        changePasswordModal: false,
        confirmMailModal: false,
        confirmPasswordModal: false,
        changeMailModal: true,
      },
    };
  }
  if (action.type === CONFIRM_PASSWORD) {
    return {
      ...state,
      modalStages: {
        ...state.modalStages,
        changePasswordModal: false,
        changeMailModal: false,
        confirmMailModal: false,
        confirmPasswordModal: true,
      },
    };
  }
  if (action.type === CONFIRM_MAIL) {
    return {
      ...state,
      modalStages: {
        ...state.modalStages,
        changePasswordModal: false,
        changeMailModal: false,

        confirmPasswordModal: false,
        confirmMailModal: true,
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
export default function Settings() {
  const dispatch = useDispatch();
  const [visibleModal, setVisibleModal] = useState(false);
  const [verifCode, setVerifCode] = useState("");
  const [error, setError] = useState("");
  const currentMail = useSelector((state) => state.deepProfile.email);

  const [confirmState, dispatchConfirmState] = useReducer(confirmReducer, {
    modalStages: {
      changePasswordModal: false,
      changeMailModal: false,
      confirmPasswordModal: false,
      confirmMailModal: false,
    },
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
  });

  useEffect(() => {
    if (error) {

      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);
  const changePasswordHandler = async () => {


    setError(null);
    try {
      await authActions.sendMail(currentMail);
      setVisibleModal(true);
      dispatchConfirmState({ type: CONFIRM_PASSWORD });
    } catch (err) {
      setError(err.message);
    }
  };
  const changeMailHandler = async () => {

    setError(null);

    try {

      await authActions.sendMail(currentMail);
      setVisibleModal(true);
      dispatchConfirmState({ type: CONFIRM_MAIL });
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmPasswordHandler = async () => {
    let action;

    let validMail = await authActions.verifyMail(currentMail, verifCode);

    if (!validMail) setError("Wrong token id");
    try {

      action = authActions.changePassword(confirmState.inputValues.password);


      setError(null);

      await dispatch(action);
      ToastAndroid.show("Password changed successfully !", ToastAndroid.SHORT);
    } catch (err) {
      setError(err.message);
    }
  };
  const changeCurrency = () => {
    Alert.alert("Switch currency!", "Which currency do you want to use?", [
      {
        text: "RON",
        onPress: () => {
          dispatch({ type: RON });
        },
      },
      {
        text: "$",
        onPress: () => {
          dispatch({ type: USD });
        },
      },

      {
        text: "€",
        onPress: () => {
          dispatch({ type: EUR });
        },
      },
    ]);
  };
  const confirmMailHandler = async () => {
    let action;

    let validMail = await authActions.verifyMail(currentMail, verifCode);
    console.log(validMail);
    if (!validMail) setError("Wrong token id");
    try {

      action = authActions.changeMail(confirmState.inputValues.email);


      setError(null);

      await dispatch(action);
      ToastAndroid.show("Mail changed successfully !", ToastAndroid.SHORT);
    } catch (err) {}
  };
  const changePassword = () => {
    setVisibleModal(true);
    dispatchConfirmState({ type: CHANGE_PASSWORD });
  };
  const changeMail = () => {
    setVisibleModal(true);

    dispatchConfirmState({ type: CHANGE_MAIL });

  };

  const inputChangeHandler = useCallback(
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

  return (
    <LinearGradient colors={["#F0FFFF", "#6495ED"]} style={centered}>
      <Card style={cardContainer}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              width: "95%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              height: "55%",
              backgroundColor: "#87CEFA",
              borderRadius: 40,
              opacity: 0.7,
              paddingVertical: 30,
            }}
          >
            <View style={styles.boxStyle}>
              <TouchableNativeFeedback
                onPress={() => {
                  changeCurrency();
                }}
                // background={TouchableNativeFeedback.Ripple("#000000", true)}
              >
                <View style={styles.boxStyleS}>
                  <Text style={styles.boxTextStyle}>Change currency</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.boxStyle}>
              <TouchableNativeFeedback
                onPress={() => {
                  changeMail();
                }}
              >
                <View style={styles.boxStyleS}>
                  <Text style={styles.boxTextStyle}>Change email</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.boxStyle}>
              <TouchableNativeFeedback
                onPress={() => {
                  changePassword();
                }}
              >
                <View style={styles.boxStyleS}>
                  <Text style={styles.boxTextStyle}>Change password</Text>
                </View>
              </TouchableNativeFeedback>
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
                  {confirmState.modalStages.changePasswordModal && (
                    <Text>Please enter your new password'</Text>
                  )}

                  {confirmState.modalStages.changeMailModal && (
                    <Text>Please enter your new e-mail</Text>
                  )}
                  {(confirmState.modalStages.confirmPasswordModal ||
                    confirmState.modalStages.confirmMailModal) && (
                    <Text>Please enter your code sent via e-mail</Text>
                  )}
                </Text>
                {!(
                  confirmState.modalStages.confirmPasswordModal ||
                  confirmState.modalStages.confirmMailModal
                ) && (
                  <View style={stylesModal.textContainer}>
                    <Input
                      style={stylesModal.input}
                      placeholder=""
                      id={
                        (confirmState.modalStages.changeMailModal && "email") ||
                        (confirmState.modalStages.changePasswordModal &&
                          "password")
                      }

                      password={confirmState.modalStages.changePasswordModal}

                      secureTextEntry={
                        confirmState.modalStages.changePasswordModal
                      }
                      label={
                        (confirmState.modalStages.changeMailModal &&
                          "Enter your new email") ||
                        (confirmState.modalStages.changePasswordModal &&
                          "Enter your new password")
                      }
                      keyboardType="default"
                      required
                      minLength={5}
                      autoCapitalize="none"
                      errorText="Please enter a valid value."
                      onInputChange={inputChangeHandler}
                    />
                  </View>
                )}
                {(confirmState.modalStages.confirmPasswordModal ||
                  confirmState.modalStages.confirmMailModal) && (
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
                )}
                <View style={stylesModal.confirmButton}>
                  <TouchableNativeFeedback
                    onPress={() => {
                      if (confirmState.modalStages.changePasswordModal)
                        changePasswordHandler();
                      else if (confirmState.modalStages.changeMailModal)
                        changeMailHandler();
                      else if (confirmState.modalStages.confirmPasswordModal) {
                        confirmPasswordHandler();
                        setVisibleModal(false);
                      } else if (confirmState.modalStages.confirmMailModal) {
                        confirmMailHandler();
                        setVisibleModal(false);
                      }
                    }}
                  >
                    <Text style={{ fontSize: 25, color: "white" }}>
                      {((confirmState.modalStages.changePasswordModal ||
                        confirmState.modalStages.changeMailModal) &&
                        "OK") ||
                        ((confirmState.modalStages.confirmMailModal ||
                          confirmState.modalStages.confirmPasswordModal) &&
                          "Confirm")}
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
          </View>
        </View>
      </Card>
    </LinearGradient>
  );
}
export const screenOptions = (navData) => {
  return {
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};
const styles = StyleSheet.create({
  boxTextStyle: {
    fontSize: 25,
    color: "white",
    fontFamily: "open-sans-bold",
  },
  boxStyle: {
    overflow: "hidden",
    width: "95%",
    maxHeight: 80,
    flex: 1,
    borderRadius: 40,
    marginVertical: 10,
  },
  boxStyleS: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 35,
  },
});
