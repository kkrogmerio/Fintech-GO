import React, { useEffect } from "react";
import {

  StyleSheet,
  Platform,
  FlatList,
  Button,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/UI/HeaderButton";

import { useIsFocused } from "@react-navigation/native";
import PlaceItem from "../../../components/UI/ListItem";
import * as transactionsActions from "../../../store/actions/transactions";

const Transaction = (props) => {
  const transactions = useSelector((state) => state.transactions.transactions);
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.currency);
  const isVisible = useIsFocused();
  useEffect(() => {

    dispatch(transactionsActions.fetchTransactions());
  }, [dispatch, isVisible]);

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <PlaceItem
          title={itemData.item.title}
          amount={
            (parseInt(itemData.item.amount) / currency.rate)
              .toFixed(0)
              .toString() + currency.currency
          }
          dateTime={itemData.item.dateTime}
        ></PlaceItem>
      )}
    />
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "All Dumb Transactions",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add Transaction"
          iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
          onPress={() => {
            navData.navigation.navigate("NewTransaction");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({});

export default Transaction;
