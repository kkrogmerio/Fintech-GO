import {
  CREATE_ACCOUNT,
  SET_ACCOUNTS,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  OPEN_FIRST_ACCOUNT,
} from "../actions/accounts";
import Account from "../../models/account";

const initialState = {
  accounts: [],
  banks: ["BCR", "ING", "MORGAN STANLEY", "VERT", "BARCKLAYS"],
};

export default (state = initialState, action) => {
  const mainBankIndex = state.accounts.findIndex((prod) => prod.bank === "BCR");
  switch (action.type) {
    case OPEN_FIRST_ACCOUNT:
      const firstAccount = new Account(
        action.accountData.id,
        action.accountData.bank,
        parseInt(action.accountData.amount)
      );
      return {
        accounts: [firstAccount],
        banks: state.banks.filter((bank) => bank !== action.bank),
      };
    case SET_ACCOUNTS:
      const remainedBanks = action.accounts.map((pl) => pl.bank);
      console.log(action.accounts);
      return {
        accounts: action.accounts.map(
          (pl) => new Account(pl.id.toString(), pl.bank, parseInt(pl.amount))
        ),
        banks: state.banks.filter(function (el) {
          return !remainedBanks.includes(el);
        }),
      };
    case CREATE_ACCOUNT:
      let userAccounts = [...state.accounts];
      userAccounts[mainBankIndex].amount -= parseInt(action.accountData.amount);
      const newAccount = new Account(
        action.accountData.id.toString(),
        action.accountData.bank,
        parseInt(action.accountData.amount)
      );
      userAccounts = [...userAccounts, newAccount];
      return {
        ...state,
        accounts: userAccounts,
        banks: state.banks.filter((bank) => bank !== action.accountData.bank),
      };
    case UPDATE_ACCOUNT:
      let accountIndex = state.accounts.findIndex(
        (prod) => prod.id === action.id
      );

      const updatedAccount = new Account(
        action.id,
        state.accounts[accountIndex].bank,
        parseInt(state.accounts[accountIndex].amount) + parseInt(action.amount)
      );
      const updatedUserAccounts = [...state.accounts];

      updatedUserAccounts[mainBankIndex].amount -= parseInt(action.amount);
      updatedUserAccounts[accountIndex] = updatedAccount;
      return {
        ...state,
        accounts: updatedUserAccounts,
      };
    case DELETE_ACCOUNT:
      accountIndex = state.accounts.findIndex((prod) => prod.id === action.pid);
      var addBackBank = state.accounts[accountIndex].bank;
      return {
        accounts: state.accounts.filter((account) => account.id !== action.pid),
        banks: state.banks.concat(addBackBank),
      };
    default:
      return state;
  }
};
