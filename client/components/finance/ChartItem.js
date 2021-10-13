import React from "react";
import {
  View,
  Text,
  StyleSheet,


  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { chartConfig } from "../../constants/Styles";
const ChartItem=(props)=>{
    return (
      <View
        style={styles.bigContainer}
      >
        <View style={{ marginLeft: 10 }}>
          <Text
            style={styles.text}
          >
            {props.title}
          </Text>
        </View>
        <LineChart
          data={{
            datasets: [{ data: props.dataSets }],
          }}
          width={Dimensions.get("window").width}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 5, borderBottomRadius: 15 }}
        />
       

        <View
          style={styles.smallContainer}
        >
          <Text
            style={styles.text}
          >
            {props.time}
          </Text>
        </View>
      </View>
    );}
const styles = StyleSheet.create({
    bigContainer:{
          backgroundColor: "#4169E1",
          height: 350,
          marginHorizontal: 10,
          marginVertical: 20,

          borderRadius: 25,
          overflow: "hidden",
        },
    smallContainer:{
      padding: 5,
      marginLeft: 10,
      borderWidth: 2,
      borderColor: "white",
      width: 60,
    },
    text:{
        fontSize: 30,
        fontFamily: "open-sans-bold",
        color: "white",
      }
})
export default ChartItem;