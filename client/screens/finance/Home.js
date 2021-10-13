import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,

  Dimensions,
  ActivityIndicator,

} from "react-native";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import { fetchAccounts } from "../../store/actions/accounts";
import { fetchTransactions } from "../../store/actions/transactions";
import { fetchInvestments } from "../../store/actions/investments";
import getFinanceData, {
  getPortfolioData,
} from "../../store/actions/getFinanceData";
import HeaderButton from "../../components/UI/HeaderButton";
import { chartConfig } from "../../constants/Styles";

export default function HomeOverview(props) {

  const dispatch = useDispatch();
  const currency = useSelector((state) => state.currency);
  let lineChartDataset = useSelector(
    (state) => state.transactions.transactionsTimeline
  );

  const totalInvestments = useSelector((state) => state.investments.investments)
    .map((ie) => ie.amount * ie.shareValue)
    .reduce((acc, cval) => acc + cval, 0);
  const totalProfit = useSelector(
    (state) => state.mockFinanceData.investmentsData
  )
    .map((ie) => ie.totalInvestments)
    .reduce((acc, cv) => acc + cv, 0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    setIsLoading(true);
    dispatch(fetchAccounts());
    dispatch(getPortfolioData());
    dispatch(fetchTransactions());
    dispatch(fetchInvestments());

    setIsLoading(false);
  }, [dispatch]);
  const { totalBankAccounts, totalExpenditure } = getFinanceData();

  if (lineChartDataset.length == 0) {
    lineChartDataset = [0];
  } else {

    lineChartDataset = lineChartDataset.map(
      (ie) => ie / currency.rate.toFixed(0)
    );

  }

  if (isLoading) {
    return <ActivityIndicator size="small" color={Colors.primary} />;
  } else
    return (
      <LinearGradient colors={["#00BFFF", "#48D1CC"]} style={styles.gradient}>
        {!isLoading && (
          <View
            style={{
              backgroundColor: "#4169E1",
              height: 350,
              marginHorizontal: 10,
              marginVertical: 20,

              borderRadius: 25,
              overflow: "hidden",
            }}
          >
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{
                  fontSize: 32,
                  fontFamily: "open-sans-bold",
                  color: "white",
                }}
              >
                Spendings
              </Text>
            </View>
            <LineChart
              data={{
                datasets: [{ data: lineChartDataset }],
              }}
              width={Dimensions.get("window").width}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{ marginVertical: 5, borderBottomRadius: 15 }}
            />
            <View
              style={{
                padding: 5,
                marginLeft: 10,
                borderWidth: 2,
                borderColor: "white",
                width: 60,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: "open-sans-bold",
                  color: "white",
                }}
              >
                1D
              </Text>
            </View>
          </View>
        )}
        <View
          style={{
            backgroundColor: "#E0FFFF",
            height: 300,
            marginHorizontal: 10,
            padding: 5,
            marginTop: 10,
            borderRadius: 30,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              marginLeft: 10,
              borderBottomWidth: 1,
              marginVertical: 5,
              padding: 5,
            }}
          >
            <Text style={{ fontSize: 32, fontFamily: "open-sans-bold" }}>
              Summary
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>Net worth:</Text>
              <Text style={styles.summaryText}>
                {(totalBankAccounts + totalProfit) / currency.rate.toFixed(0)}
                {currency.currency}
              </Text>
            </View>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>Total bank accounts:</Text>
              <Text style={styles.summaryText}>
                {(totalBankAccounts / currency.rate).toFixed(0)}
                {currency.currency}
              </Text>
            </View>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>Total expenditure:</Text>
              <Text style={styles.summaryText}>
                {(totalExpenditure / currency.rate).toFixed(0)}
                {currency.currency}
              </Text>
            </View>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>Total Investments:</Text>
              <Text style={styles.summaryText}>
                {(totalInvestments / currency.rate).toFixed(0)}
                {currency.currency}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
}

export const screenOptions = (navData) => {
  return {
    headerTitle: "Homepage",
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
  gradient: {
    flex: 1,
  },
  summaryText: { fontSize: 22, fontFamily: "open-sans" },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    width: "90%",
  },
});
