import React, { useState, useEffect} from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../../components/UI/HeaderButton";
import * as transactionActions from "../../../store/actions/transactions";
import Input from "../../../components/UI/Input";
import Colors from "../../../constants/Colors";

const NewTransaction = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = async () => {
    if (title === "" || amount === "") {
      console.log(title, amount);
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(transactionActions.addTransaction(title, amount));
      props.navigation.navigate("Transactions");
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

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

  const inputChangeHandler = (inputIdentifier, inputValue, inputValidity) => {
    
    if (inputIdentifier === "title" && inputValidity) {
      setTitle(inputValue);
    } else if (inputIdentifier === "amount" && inputValidity) {
      setAmount(inputValue);
    }
  };

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
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={title}
            initiallyValid={!!title}
            required
          />
          <Input
            id="amount"
            label="Amount (Local Currency):"
            errorText="Please enter the amount of money you spent ineffectively!"
            keyboardType="number-pad"
            onInputChange={inputChangeHandler}
            initialValue={amount}
            initiallyValid={!!amount}
            required
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "Add transaction",
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NewTransaction;
