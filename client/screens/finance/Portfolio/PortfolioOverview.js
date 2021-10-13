import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Alert,
  FlatList,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import moment from "moment";
import { stylesModal } from "../../../components/UI/MyModal";
import Colors from "../../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import { fetchAccounts } from "../../../store/actions/accounts";

import {
  fetchInvestments,
  addInvestment,
} from "../../../store/actions/investments";
import { fetchTransactions } from "../../../store/actions/transactions";
import getFinanceData, {
  getPortfolioData,
  liveUpdatePortfolioData,
} from "../../../store/actions/getFinanceData";
import HeaderButton from "../../../components/UI/HeaderButton";
import MarketItem from "../../../components/finance/MarketItem";

export default function PortfolioOverview(props) {
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const width = Dimensions.get("window").width;

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    barPercentage: 0.5,
  };
  const [visibleBuyModal, setVisibleBuyModal] = useState(false);
  const [visibleSellModal, setVisibleSellModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [error, setError] = useState(false);
  const [countOperation, setCountOperation] = useState(0);
  const [modalShareValue, setModalShareValue] = useState(0);
  let portfolioData = useSelector((state) => state.mockFinanceData.portfolio);
  const investmentsData = useSelector(
    (state) => state.mockFinanceData.investmentsData
  );
  let totalInvestments = investmentsData
    .map((ie) => ie.totalInvestments)
    .reduce((acc, cv) => acc + cv, 0);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  if (portfolioData.length == 0) {
    portfolioData = [
      {
        name: "Real estate",
        volume: 25,
        color: "#ff8711",
        legendFontColor: "white",
        legendFontSize: 15,
      },
      {
        name: "Crypto",
        volume: 30,
        color: "#ffd38d",
        legendFontColor: "white",
        legendFontSize: 15,
      },
      {
        name: "Stocks",
        volume: 10,
        color: "#9ed764",
        legendFontColor: "white",
        legendFontSize: 15,
      },
    ];
  }
  const buyFundsHandler = (categoryType, shareValue) => {
    setModalShareValue(shareValue);
    setCategory(categoryType);
    setVisibleBuyModal(true);
  };
  const sellFundsHandler = (categoryType, shareValue) => {
    setModalShareValue(shareValue);
    setCategory(categoryType);
    setVisibleSellModal(true);
  };
  const confirmHandler = async () => {
    try {
      if (
        amount === 0 ||
        (amount < 0 &&
          -amount >
            investmentsData.find((ie) => ie.category === category).totalShares)
      ) {
        throw new Error("Cannot trade 0 or more shares than you actually own");
      }
      await dispatch(addInvestment(category, amount, modalShareValue));
    } catch (err) {

      setVisibleBuyModal(false);
      setVisibleSellModal(false);
      setModalShareValue(0);
      setError(err.message);
    }
    setCountOperation(() => countOperation + 1);
    setAmount(0);
    setModalShareValue(0);
    setVisibleBuyModal(false);
    setVisibleSellModal(false);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getPortfolioData());
    dispatch(fetchInvestments());
    dispatch(fetchTransactions());
    dispatch(fetchAccounts());

    dispatch(liveUpdatePortfolioData());

    setIsLoading(false);
  }, [dispatch, countOperation]);
  const { totalBankAccounts, totalExpenditure } = getFinanceData();

  const currency = useSelector((state) => state.currency);
  var listHeaderComponent = (
    <LinearGradient colors={["#00008B", "#B0E0E6"]} style={styles.gradient}>
      <View
        style={{
          height: 250,
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
        <PieChart
          data={portfolioData}
          width={width}
          height={220}
          chartConfig={chartConfig}
          accessor={"volume"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
        <View
          style={{
            padding: 5,
            marginLeft: 10,
            borderWidth: 2,
            borderColor: "white",
            width: 60,
          }}
        ></View>
      </View>
      <View
        style={{
          backgroundColor: "#E0FFFF",
          height: 200,
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
            Details
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Ratio accounts/investments:</Text>
            <Text style={styles.summaryText}>
              {(
                totalBankAccounts /
                (totalInvestments === 0 ? 1 : totalInvestments) /
                currency.rate
              ).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Ratio expenditure/investments:
            </Text>
            <Text style={styles.summaryText}>
              {(
                totalExpenditure /
                (totalInvestments === 0 ? 1 : totalInvestments) /
                currency.rate
              ).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Total investments:</Text>
            <Text style={styles.summaryText}>
              {(totalInvestments / currency.rate).toFixed(0)}
              {currency.currency}
            </Text>
          </View>
        </View>
      </View>
      <Modal
        visible={visibleSellModal || visibleBuyModal}
        onDismiss={() => {
          setVisibleSellModal(false);
          setVisibleBuyModal(false);
          setCategory("");
        }}
        style={{
          flex: 1,
          margin: 0,
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
            {visibleBuyModal &&
              `Please enter the number of shares for ${category} you want to purchase.`}
            {visibleSellModal &&
              `Please enter the number of shares for ${category} you want to sell.`}
          </Text>
          <View
            style={{
              ...stylesModal.textContainer,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              style={stylesModal.input}
              id="amount"
              keyboardType="number-pad"
              required
              minLength={4}
              autoCapitalize="none"
              onChangeText={(amount) => {
                if (visibleBuyModal) setAmount(amount);
                else setAmount(-amount);
              }}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {visibleBuyModal &&
                `This transaction will cost you: ${
                  (amount * modalShareValue) / currency.rate
                } ${currency.currency}`}
              {visibleSellModal &&
                `This transaction will refund you: ${
                  (-amount * modalShareValue) / currency.rate
                } ${currency.currency}`}
            </Text>
          </View>
          <View style={styles.confirmButton}>
            <Button title="Confirm the deal" onPress={confirmHandler} />
          </View>
          <View style={{ position: "absolute", top: 0, right: 0 }}>
            <Button
              style={{ opacity: 0.93 }}
              title="Close pop-up"
              onPress={() => {
                setVisibleBuyModal(false);
                setVisibleSellModal(false);
              }}
            ></Button>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
  if (isLoading) {
    return <ActivityIndicator size="small" color={Colors.primary} />;
  } else {
    return (
      !isLoading && (
        <SafeAreaView>
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#F5FFFA",
            }}
          >
            <FlatList
              data={investmentsData}
              keyExtractor={(item) => item.category}
              ListHeaderComponent={listHeaderComponent}
              renderItem={(itemData) => (
                <MarketItem
                  profit={
                    (
                      (itemData.item.variations[
                        itemData.item.variations.length - 1
                      ] *
                        itemData.item.totalShares) /
                      itemData.item.totalInvestments
                    ).toFixed(2) * 100
                  }
                  amount={itemData.item.totalShares}
                  category={itemData.item.category}
                  chartData={itemData.item.variations}
                  onBuy={() => {
                    buyFundsHandler(
                      itemData.item.category,
                      itemData.item.variations[
                        itemData.item.variations.length - 1
                      ]
                    );
                  }}
                  onSell={() => {
                    sellFundsHandler(
                      itemData.item.category,
                      itemData.item.variations[
                        itemData.item.variations.length - 1
                      ]
                    );
                  }}
                />
              )}
            />
          </View>
   
        </SafeAreaView>
      )
    );
  }
}
export const screenOptions = (navData) => {
  return {
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
    width: "100%",
    height: 555,
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 90,
    zIndex: 2,
  },
  summaryText: { fontSize: 18, fontFamily: "open-sans" },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    width: "90%",
  },
});
