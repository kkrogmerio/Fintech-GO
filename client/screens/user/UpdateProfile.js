import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "@react-native-community/datetimepicker";
import HeaderButton from "../../components/UI/HeaderButton";
import * as profileActions from "../../store/actions/profile";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

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

const UpdateProfile = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const editProfile = useSelector((state) => state.deepProfile);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      salary: editProfile.salary,
      birthday: editProfile.birthday ? editProfile.birthday : null,
    },
    inputValidities: {
      salary: true,
      birthday: true,
    },
    formIsValid: true,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        profileActions.updateProfile(
          formState.inputValues.salary,
          formState.inputValues.birthday
        )
      );

      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, formState]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
            }
            onPress={submitHandler}
          />
        </HeaderButtons>
      ),
    });
  }, [submitHandler]);
  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const dateChangeHandler = (date) => {
    setVisibleCalendar(false);
    console.log(moment(date.nativeEvent.timestamp).format("MMMM-Do-YYYY"));
    inputChangeHandler(
      "birthday",
      moment(date.nativeEvent.timestamp).format("MMMM-Do-YYYY"),
      true
    );
  };
  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      console.log(inputValue);
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <View style={styles.form}>
        <Input
          id="salary"
          label="Salary"
          errorText="Please enter a valid salary!"
          keyboardType="decimal-pad"
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          required
          min={1000}
        />
        <Text style={styles.label}>Birthday:</Text>
        <View>
          <View style={{ overflow: "hidden", width: "100%" }}>
            <TouchableWithoutFeedback
              onPress={() => {
                setVisibleCalendar(true);
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <AntDesign name="calendar" size={46} color={Colors.primary} />
                <View
                  style={{
                    padding: 5,
                    borderWidth: 2,
                    borderColor: Colors.primary,
                  }}
                >
                  {editProfile.birthday != null && (
                    <Text style={{ fontSize: 20 }}>
                      {formState.inputValues.birthday}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {visibleCalendar && (
            <DatePicker
              value={new Date()}
              onChange={dateChangeHandler}
              maximumDate={new Date()}
              mode="date"
              display="calendar"
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = (navData) => {

  return {
    headerTitle: "Edit profile",
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 18,
    marginBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UpdateProfile;
