import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
const BankItem = (props) => {
  let amountOnlyNumber;
  if (props.amount)
    amountOnlyNumber = props.amount.substr(0, props.amount.indexOf(" "));
  return (
    <TouchableNativeFeedback onPress={props.onSelect} style={styles.bankItem}>
      <View style={styles.infoContainer}>
        <View style={styles.inlineTitle}>
          <FontAwesome name="bank" size={30} color="black" />
          <Text style={styles.title}>{props.title}</Text>
        </View>
        <Text style={styles.content}>{props.amount}</Text>
        {props.onDeposit && (
          <View style={styles.inlineButtons}>
            {props.title !== "BCR" && (
              <Button title="Deposit" onPress={props.onDeposit} />
            )}
            {amountOnlyNumber != 0 && props.title !== "BCR" && (
              <Button title="Withdraw" onPress={props.onWithdraw} />
            )}
            {amountOnlyNumber == 0 && props.title !== "BCR" && (
              <Button title="Delete" onPress={props.onDelete} />
            )}
          </View>
        )}
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  bankItem: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    marginLeft: 5,
    width: 230,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  inlineButtons: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inlineTitle: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    // justifyContent: "space-between",
  },
  title: {
    color: "black",
    fontSize: 18,
    marginBottom: 5,
    marginLeft: 10,
  },
  content: {
    color: "#666",
    fontSize: 16,
  },
  time: {
    color: "black",
    fontSize: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "23%",
    paddingHorizontal: 20,
  },
});

export default BankItem;
