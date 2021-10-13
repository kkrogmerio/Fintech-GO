"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.screenOptions = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _reactRedux = require("react-redux");

var _reactNavigationHeaderButtons = require("react-navigation-header-buttons");

var _HeaderButton = _interopRequireDefault(require("../../components/UI/HeaderButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import TransactionItem from "../../components/shop/TransactionItem";
// import * as transactionsActions from "../../store/actions/transactions";
// import Colors from "../../constants/Colors";
// const TransactionsScreen = (props) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const transactions = useSelector((state) => state.transactions.transactions);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     setIsLoading(true);
//     dispatch(transactionsActions.fetchTransactions()).then(() => {
//       setIsLoading(false);
//     });
//   }, [dispatch]);
//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }
//   if (transactions.length === 0) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>No Transactions found .. maybe start ordering some!</Text>
//       </View>
//     );
//   }
//   return (
//     <FlatList
//       data={transactions}
//       keyExtractor={(item) => item.id}
//       renderItem={(itemData) => (
//         <TransactionItem
//           amount={itemData.item.totalAmount}
//           date={itemData.item.readableDate}
//           items={itemData.item.items}
//         />
//       )}
//     />
//   );
// };
// export const screenOptions = (navData) => {
//   return {
//     headerTitle: "Your Transactions",
//     headerLeft: () => (
//       <HeaderButtons HeaderButtonComponent={HeaderButton}>
//         <Item
//           title="Menu"
//           iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
//           onPress={() => {
//             navData.navigation.toggleDrawer();
//           }}
//         />
//       </HeaderButtons>
//     ),
//   };
// };
var screenOptions = function screenOptions(navData) {
  return {};
};

exports.screenOptions = screenOptions;

var styles = _reactNative.StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

var _default = TransactionsScreen;
exports["default"] = _default;