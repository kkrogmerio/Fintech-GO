import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { Entypo } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { chartConfig } from "../../constants/Styles";
const MarketItem = (props) => {
  let currentValue = props.chartData[props.chartData.length - 1];
  let prevValue = props.chartData[props.chartData.length - 2];
  let marketData = props.chartData;
  let tableHead = ["Category" + ":", "Shares:", "Profit:", "Current value:"];
  let tableBody = [[props.category, props.amount, props.profit, "bau"]];
  const currentShareValue = () =>
    (prevValue > currentValue && (
      <View style={styles.inlineContent}>
        <Text style={styles.contentDown}> {currentValue}</Text>
        <Entypo name="arrow-long-down" size={24} color="red" />
      </View>
    )) || (
      <View style={styles.inlineContent}>
        <Text style={styles.contentUp}> {currentValue}</Text>
        <Entypo name="arrow-long-up" size={24} color="green" />
      </View>
    );
  const profit = () =>
    (props.profit > 100 && (
      <View style={styles.inlineContent}>
        <Text style={styles.contentUp}>
          +{props.profit == Infinity ? 0 : props.profit - 100}%
        </Text>
      </View>
    )) || (
      <View style={styles.inlineContent}>
        <Text style={styles.contentDown}>
          -{props.profit.toString() === "NaN" ? 0 : 100 - props.profit}%
        </Text>
      </View>
    );
  return (
    marketData && (
      <View style={styles.marketItem}>
        <View style={styles.container}>
          <Table borderStyle={{ borderColor: "transparent" }}>
            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            {tableBody.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {rowData.map((cellData, cellIndex) => (
                  <Cell
                    key={cellIndex}
                    data={
                      (cellIndex === 3 && currentShareValue()) ||
                      (cellIndex === 2 && profit()) ||
                      cellData
                    }
                    textStyle={styles.text}
                  />
                ))}
              </TableWrapper>
            ))}
          </Table>
        </View>
        <LineChart
          data={{
            datasets: [{ data: marketData }],
          }}
          width={Dimensions.get("window").width * 0.9}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 5, borderRadius: 15 }}
        />

        <View style={styles.inlineButtons}>
          <TouchableOpacity
            onPress={() => {
              props.onBuy(props.category);
            }}
            style={styles.bankItem}
          >
            <View style={{ ...styles.marketButton, backgroundColor: "green" }}>
              <Text style={styles.onInvestButton}>Buy</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.onSell(props.category);
            }}
            style={styles.bankItem}
          >
            <View style={{ ...styles.marketButton, backgroundColor: "red" }}>
              <Text style={styles.onInvestButton}>SELL</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.actions}>{props.children}</View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  marketItem: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    flex: 1,

    paddingVertical: 15,
    alignItems: "center",
  },
  infoContainer: {
    marginHorizontal: 0,

    justifyContent: "center",
    alignItems: "flex-start",
  },
  onInvestButton: {
    color: "white",
    fontFamily: "open-sans-bold",
    fontSize: 30,
  },
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
  head: { height: 40 },
  text: { margin: 3, color: "black", fontSize: 20 },
  row: { flexDirection: "row" },

  marketButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  inlineButtons: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  inlineContent: {
    flexDirection: "row",
  },
  inlineContentWrap: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    width: "100%",
    opacity: 1,
  },
  goodProfit: {
    color: "green",
    fontSize: 18,
  },
  badProfit: {
    color: "red",
    fontSize: 18,
  },
  content: {
    color: "black",
    fontSize: 20,
  },
  title: {
    color: "black",
    fontSize: 18,
    marginBottom: 5,
    marginLeft: 10,
  },
  contentUp: {
    color: "green",
    fontSize: 16,
  },
  contentDown: {
    color: "red",
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

export default MarketItem;
