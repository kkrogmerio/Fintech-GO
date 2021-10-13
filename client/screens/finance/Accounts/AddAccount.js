import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/UI/HeaderButton";
import PlaceBank from "../../../components/finance/BankItem";
import { stylesModal } from "../../../components/UI/MyModal";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Alert,
  FlatList,
  TextInput,
  View,
  Button,
  Text,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import * as accountsActions from "../../../store/actions/accounts";
export default AddAccount = (props) => {
  const banks = useSelector((state) => state.accounts.banks);
  console.log(banks);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(0);
  const [currentBank, setCurrentBank] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [error, setError] = useState();
  const currency = useSelector((state) => state.currency.currency);
  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const confirmHandler = async () => {
    try {
      if (amount < 10000)
        throw new Error(
          "You need to fund at least 10000 if you want to open a new account"
        );
      console.log(currentBank);
      await dispatch(accountsActions.addAccount(currentBank, amount));
      setVisibleModal(false);
      ToastAndroid.show(
        "Bank account opened successfully !",
        ToastAndroid.SHORT
      );
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <View>
      <FlatList
        data={banks}
        keyExtractor={(item) => item}
        renderItem={(itemData) => (
          <PlaceBank
            title={itemData.item}
            onSelect={() => {
              setCurrentBank(itemData.item);
              setVisibleModal(true);
            }}
          ></PlaceBank>
        )}
      />
      <Modal
        visible={visibleModal}
        onDismiss={() => {
          setVisibleModal(false);
        }}
        style={{
          margin: 0,
          flex: 1,
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
            Please enter a minimum of 10000 if you want to open a new account
          </Text>
          <View
            style={{
              ...stylesModal.textContainer,

              justifyContent: "space-between",
            }}
          >
            <TextInput
              style={stylesModal.input}
              placeholder={`10000${currency}`}
              id="amount"
              label={`Deposit an amount of ${currency}`}
              keyboardType="number-pad"
              required
              minLength={5}
              autoCapitalize="none"
              errorText="You need to enter an amount of at least 10000."
              onChangeText={(amount) => {
                setAmount(amount);
              }}
            />
          </View>
          <View style={styles.confirmButton}>
            <Button title="Open the account" onPress={confirmHandler} />
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
  );
};
export const screenOptions = (navData) => {
  return {
    headerTitle: "Add Account",

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
  confirmButton: {
    borderRadius: 10,
  },
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
