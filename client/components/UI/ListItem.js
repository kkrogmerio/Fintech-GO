import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const PlaceItem = (props) => {
  if (props.content) {
    let previewString = props.content.substring(0, 30);
    return (
      <TouchableNativeFeedback
        onPress={props.onSelect}
        style={styles.placeItem}
      >
        <View style={styles.spacebetween}>
          <View style={!props.content && styles.infoContainer}>
            <Text style={styles.title}>{props.title}</Text>
            {props.content && (
              <Text style={styles.content}>{previewString} ...</Text>
            )}
            {props.company && (
              <Text style={styles.company}>{props.company}</Text>
            )}
            {props.time && <Text style={styles.time}>{props.time}</Text>}
            {props.amount && <Text style={styles.time}>{props.amount}</Text>}
          </View>
          <View style={styles.actions}>{props.children}</View>
        </View>
      </TouchableNativeFeedback>
    );
  } else if (props.newsTitle) {
    return (
      <TouchableNativeFeedback
        onPress={props.onSelect}
        style={styles.placeItem}
      >
        <View>
          <Text style={styles.title}>{props.newsTitle}</Text>
          <Text style={styles.company}>{props.newsCompany}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <View style={styles.infoContainer}>
        <View style={styles.moneyImage}>
          <FontAwesome5 name="money-bill-wave" size={40} color="green" />
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.content}>{props.amount}</Text>
          <Text style={styles.content}>{props.dateTime}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  placeItem: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    height: 220,

    flexDirection: "row",
    alignItems: "center",
  },
  details: {
    marginLeft: 10,
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: "row",

    alignItems: "flex-start",
  },

  title: {
    color: "black",
    fontSize: 18,
    marginBottom: 5,
    marginLeft: 15,
  },
  content: {
    color: "#666",
    fontSize: 16,
    marginLeft: 10,
  },
  time: {
    color: "black",
    fontSize: 10,
  },
  actions: {
    flexDirection: "row",

    alignItems: "center",
    left: Dimensions.get("window").width - 100,
    paddingHorizontal: 20,
  },
  company: {
    marginLeft: 10,
  },
});

export default PlaceItem;
