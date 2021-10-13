import axios from "axios";
import ENV from "../../env";
export const SET_TRANSACTIONS_TIMELINES = "SET_TRANSACTIONS_TIMELINES";
export const fetchTimelineTransactions = () => {
  return async (dispatch) => {
    axios
      .get(`${ENV.REACT_APP_API_URL}/fetchDailyTransactions`)
      .then((res) => {
        console.log(res.data.transactionsTimeline);
        dispatch({
          type: SET_TRANSACTIONS_TIMELINES,
          transactionsTimeline: res.data.transactionsTimeline,
        });
      })
      .catch((err) => {
        console.log(err.message);
        return false;
      });
  };
};
