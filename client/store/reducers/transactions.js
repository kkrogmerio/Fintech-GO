import { ADD_TRANSACTION, SET_TRANSACTIONS } from "../actions/transactions";
import { SET_TRANSACTIONS_TIMELINE } from "../actions/transactions";
import Transaction from "../../models/transaction";

const initialState = {
  transactions: [],
  transactionsTimeline: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TRANSACTIONS_TIMELINE:
      let lineChartDataset = [];
      for (var i in action.transactionsTimeline) {
        lineChartDataset.push(action.transactionsTimeline[i]);
      }
      return { ...state, transactionsTimeline: lineChartDataset };
    case SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.transactions.map(
          (pl) =>
            new Transaction(
              pl.id.toString(),
              pl.title,
              parseInt(pl.amount),
              pl.dateTime,
              pl.transactionMoment
            )
        ),
      };
    case ADD_TRANSACTION:
      const newTransaction = new Transaction(
        action.transactionData.id.toString(),
        action.transactionData.title,
        parseInt(action.transactionData.amount),
        action.transactionData.dateTime,
        action.transactionMoment
      );
      return {
        ...state,
        transactions: state.transactions.concat(newTransaction),
      };
  }
  return state;
};
