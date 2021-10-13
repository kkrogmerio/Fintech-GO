import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/UI/HeaderButton";
import PlaceBank from "../../../components/finance/BankItem";
import { stylesModal } from "../../../components/UI/MyModal";
import React,{useEffect,useState} from "react";
import {
  Modal,
  TextInput,
  View,
  Button,
  Text,
  Alert,
  Dimensions,
  StyleSheet,
  TouchableNativeFeedback,
  FlatList,
} from "react-native";
import * as accountsActions from "../../../store/actions/accounts";
export default AccountsOverview = (props) => {
  
  const accounts = useSelector((state) => state.accounts.accounts);

  const dispatch = useDispatch();
  const [amount,setAmount]=useState(0);
  const [currentAccount,setCurrentAccount]=useState("");
const [error, setError] = useState();
    const [visibleDepositModal, setVisibleDepositModal] = useState(false);
    const [visibleWithdrawModal, setVisibleWithdrawModal] = useState(false);

  const currency = useSelector((state) => state.currency);
  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);
  useEffect(() => {
    dispatch(accountsActions.fetchAccounts());
  }, [dispatch]);
  
  const confirmHandler =async ()=>{

    try{
    if(Math.abs(amount)<10000)
   {throw new Error("You need to fund/withdraw at least 10000 if you want to open a new account");}
      
    await dispatch(accountsActions.updateAccount(currentAccount,amount));
    }
    catch(err){ 
      setVisibleDepositModal(false);
      setVisibleWithdrawModal(false);
      setError(err.message);}
    
    setVisibleDepositModal(false);
    setVisibleWithdrawModal(false);
  }

  return (
    <View>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <PlaceBank
            title={itemData.item.bank}
            amount={
              (itemData.item.amount / currency.rate).toFixed(0).toString() +"  "+
              currency.currency
            }
            onDeposit={() => {
              setCurrentAccount(itemData.item.id);
              setVisibleDepositModal(true);
            }}
            onWithdraw={() => {
              setCurrentAccount(itemData.item.id);
              setVisibleWithdrawModal(true);
            }}
            onDelete={() => {dispatch(accountsActions.deleteAccount(itemData.item.id));}}
          >
              

          </PlaceBank>
        )}
      />
      <Modal
        visible={visibleWithdrawModal || visibleDepositModal}
        onDismiss={() => {
          setVisibleWithdrawModal(false);
          setVisibleDepositModal(false);
        }}
        style={{
          flex:1,
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
            {visibleWithdrawModal &&
              "Please enter the amount you want to withdraw in this account"}
            {visibleDepositModal &&
              "Please enter the amount you want to deposit in this account"}
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
              placeholder={`1000 ${currency.currency}`}
              id="amount"
              label={
                (visibleDepositModal && `Deposit an amount of ${currency.currency}`) ||
                (visibleWithdrawModal && `Withdraw an amount of ${currency.currency}`)
              }
              keyboardType="number-pad"
              required
              minLength={4}
              autoCapitalize="none"
              errorText="You need to enter an amount of at least 1000."
              onChangeText={(amount) => {
                if (visibleDepositModal) setAmount(amount);
                else setAmount(-amount);
              }}
            />
            <Text>{currency.currency}</Text>
          </View>
          <View style={styles.confirmButton}>
            <Button title="Confirm the transaction" onPress={confirmHandler} />
          </View>
          <View style={{ position: "absolute", top: 0, right: 0 }}>
            <Button
              style={{ opacity: 0.93 }}
              title="Close pop-up"
              onPress={() => {
                setVisibleWithdrawModal(false);
                setVisibleDepositModal(false);
              }}
            ></Button>
          </View>
        </View>
      </Modal>
      <View style={styles.boxStyle}>
        <TouchableNativeFeedback
          onPress={() => {
            props.navigation.navigate("AddAccount");

          }}
        >
          <View style={styles.boxStyleS}>
            <Text style={styles.boxTextStyle}>Link Bank Account</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
};
export const screenOptions = (navData) => {
  return {
    headerTitle: "All bank accounts",
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
  boxStyleTest:{

    width: "100%",
    height: "100%",
    backgroundColor:"blue"
  },
  boxStyle: {
    
    overflow:"hidden",
    position:"absolute",
      borderRadius: 40,
      width:"100%",

      top:Dimensions.get("window").height-155
  },
  boxStyleS: {
    
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E90FF",
    height:70,
    // paddingVertical: 20,
    borderRadius:40
  },
});
