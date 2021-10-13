import React from "react";
import { useSelector } from "react-redux";

import {
  StyleSheet,
  Text,
  View,

  TouchableNativeFeedback,

} from "react-native";

export const USD = "USD";
export const EUR = "EUR";
export const RON = "RON";

import { centered, cardContainer } from "../../../constants/Styles";

import { LinearGradient } from "expo-linear-gradient";
import Card from "../../../components/UI/Card";

export default function Savings(props) {

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
                  props.navigation.navigate("Note");
                }}
              >
                <View style={styles.boxStyleS}>
                  <Text style={styles.boxTextStyle}>Write some notes</Text>
                </View>
              </TouchableNativeFeedback>
            </View>

            <View style={styles.boxStyle}>
              <TouchableNativeFeedback
                onPress={() => {
                  props.navigation.navigate("Alert");
                }}
              >
                <View style={styles.boxStyleS}>
                  <Text style={styles.boxTextStyle}>Consuming alert</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </Card>
    </LinearGradient>
  );
}
export const screenOptions = (navData) => {
  return {};
};
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
