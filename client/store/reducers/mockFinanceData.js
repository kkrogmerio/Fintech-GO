import { SET_FINANCE_DATA } from "../actions/getFinanceData";

const initialState = {
  portfolio: [],
  investmentsData: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FINANCE_DATA:

      return {
        ...state,
        portfolio: action.portfolio,
        investmentsData: action.investmentsData,
      };
    default:
      return state;
  }
};
