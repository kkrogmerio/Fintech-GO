import { useSelector} from "react-redux";
import axios from "axios";
import ENV from "../../env";
export const SET_FINANCE_DATA = "SET_FINANCE_DATA";
export default getFinanceData = () => {
  let totalBankAccounts = useSelector((state) => state.accounts.accounts);
  let totalExpenditure = useSelector(
    (state) => state.transactions.transactions
  );
  totalBankAccounts = totalBankAccounts
    .map((el) => el.amount)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  totalExpenditure = totalExpenditure
    .map((el) => el.amount)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return { totalBankAccounts, totalExpenditure };
};
export const liveUpdatePortfolioData = () => {
  return async (dispatch) => {
    setInterval(() => {
      dispatch(getPortfolioData());
    }, 300000);
  };
};
export const getPortfolioData = () => {
  return async (dispatch, getState) => {
    setTimeout(() => {
      let investments = getState().investments.investments;

      

      console.log(JSON.stringify(investments));
        axios
          .post(`${ENV.REACT_APP_API_URL}/convertToPortfolioData`, {
            investments,
          })
          .then((res) => {
            dispatch({
              type: SET_FINANCE_DATA,
              portfolio: res.data.mockTypeInvestments,
              investmentsData: res.data.investmentsData,
            });
          })
          .catch((err) => {
            console.log(err.message);
            return false;
          });
      dispatch({ type: "NO_EXECUTION" });
    }, 1000);
  };
};
