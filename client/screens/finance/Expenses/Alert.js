import React, { useState, useReducer, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { stylesModal } from "../../../components/UI/MyModal";
import { FontAwesome } from "@expo/vector-icons";
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Modal,
  Button,
  TouchableNativeFeedback,
  Alert,

} from "react-native";


import { centered, cardContainer } from "../../../constants/Styles";
import { useDispatch } from "react-redux";
import {
  updateSpendingLimits,
  fetchProfile,
  getLimitExpensesPrediction,
} from "../../../store/actions/profile";
import Input from "../../../components/UI/Input";
import { LinearGradient } from "expo-linear-gradient";
import Card from "../../../components/UI/Card";

import Colors from "../../../constants/Colors";

const CHANGE_LIMIT = "CHANGE_LIMIT";
const SPENDING_LIMITS = "SPENDING_LIMITS";
const SPENDING_ML_LIMITS = "SPENDING_ML_LIMITS";
const CONFIRM_SPENDING_LIMITS = "CONFIRM_SPENDING_LIMITS";

const alertReducer = (state, action) => {
  if (action.type === SPENDING_LIMITS) {
    return {
      ...state,
      modalStages: {
        ...state.modalStages,
        alertModal: true,
        alertMlModal: false,
      },
    };
  }
  if (action.type === SPENDING_ML_LIMITS) {
    return {
      ...state,
      modalStages: {
        ...state.modalStages,
        alertModal: false,
        alertMlModal: true,
      },
    };
  }
  if (action.type === CONFIRM_SPENDING_LIMITS) {
    return {
      ...state,
      modalStages: {
        ...state.modalStages,
        alertModal: false,
        alertMlModal: false,
        confirmModal: true,
      },
    };
  }
  if (action.type === CHANGE_LIMIT) {
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
export default function AlertLimit(props) {
  const [error, setError] = useState(false);

  let currentLimit = useSelector((state) => state.deepProfile.spendingLimits);
  const [alertState, dispatchAlertState] = useReducer(alertReducer, {
    modalStages: {
      alertModal: false,
      alertMlModal: false,
      confirmModal: false,
    },
    inputValues: {
      limitation: "",
    },
    inputValidities: {
      limitation: false,
    },
  });
  const dispatch = useDispatch();
  const [waitPrediction, setWaitPrediction] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const inputChangeLimitHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchAlertState({
        type: CHANGE_LIMIT,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchAlertState]
  );

  const setMlAlertModal = () => {
    setVisibleModal(true);
    dispatchAlertState({ type: SPENDING_ML_LIMITS });
  };
  const closeModalHandler = () => {
    setVisibleModal(false);
  };
  const setAlertModal = () => {
    setVisibleModal(true);
    dispatchAlertState({ type: SPENDING_LIMITS });
  };
  const alertMlHandler = async () => {
    setError(null);
    setWaitPrediction(true);
    try {
      await dispatch(getLimitExpensesPrediction());
    } catch (err) {
      closeModalHandler();
      setWaitPrediction(false);
      setError(err.message);
    }
    closeModalHandler();
    setWaitPrediction(false);
  };
  const alertHandler = async () => {
    setError(null);
    try {
      await dispatch(updateSpendingLimits(alertState.inputValues.limitation));
    } catch (err) {
      closeModalHandler();
      setError(err.message);
    }
    closeModalHandler();
  };


  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  const currency = useSelector((state) => state.currency);
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
            <View style={styles.currentLimit}>
              <Text style={styles.boxTextStyle}>
                Current spending limitation: {currentLimit / currency.rate}{" "}
                {currency.currency}
              </Text>
            </View>
            <View style={styles.boxStyle}>
              <TouchableNativeFeedback
                onPress={() => {
                  setMlAlertModal();
                }}
              >
                <View style={styles.boxStyleS}>
                  <Text style={styles.boxTextStyle}>Default limitation</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.boxStyle}>
              <TouchableNativeFeedback
                onPress={() => {
                  setAlertModal();
                }}
              >
                <View style={styles.boxStyleS}>
                  <Text style={styles.boxTextStyle}>Add your limitation</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </Card>
      <Modal
        visible={visibleModal}
        onDismiss={() => {
          // dispatchConfirmState({type:FORGET_PASSWORD})
          closeModalHandler();
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
            {alertState.modalStages.alertModal && (
              <Text>Please enter your daily spending limits:</Text>
            )}

            {alertState.modalStages.confirmModal && (
              <Text>The limitation alert has been set successfully</Text>
            )}
            {alertState.modalStages.alertMlModal && (
              <Text>
                The limitation alert has been set successfully according to our
                AI algorithm
              </Text>
            )}
          </Text>
          <View style={stylesModal.textContainer}>
            {alertState.modalStages.alertModal && (
              <Input
                style={stylesModal.input}
                placeholder="                                 "
                id={"limitation"}
                label={"Enter your spending limits"}
                keyboardType="default"
                required
                minLength={3}
                autoCapitalize="none"
                errorText="Please enter a minimum value of 100."
                onInputChange={inputChangeLimitHandler}
              />
            )}
          </View>
          {!waitPrediction && (
            <View style={stylesModal.confirmButton}>
              <TouchableNativeFeedback
                onPress={() => {
                  if (alertState.modalStages.alertModal) alertHandler();
                  else if (alertState.modalStages.alertMlModal) {
                    alertMlHandler();
                  } else closeModalHandler();
                }}
              >
                <Text style={{ fontSize: 25, color: "white" }}>
                  {((alertState.modalStages.alertModal ||
                    alertState.modalStages.alertMlModal) &&
                    "Confirm") ||
                    (alertState.modalStages.confirmModal && "OK")}
                </Text>
              </TouchableNativeFeedback>
            </View>
          )}
          {waitPrediction && (
            <ActivityIndicator size="small" color={Colors.primary} />
          )}
          <View style={{ position: "absolute", top: 0, right: 0 }}>
            <Button
              style={{ opacity: 0.93 }}
              title="Close pop-up"
              onPress={() => {
                closeModalHandler();
              }}
            ></Button>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  boxTextStyle: {
    fontSize: 25,
    color: "white",
    fontFamily: "open-sans-bold",
    textAlign: "center",
  },
  boxStyle: {
    overflow: "hidden",
    width: "95%",
    maxHeight: 80,
    flex: 1,
    borderRadius: 40,
    marginVertical: 20,
  },
  currentLimit: {
    marginBottom: 10,
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
