import { ADD_INVESTMENT, SET_INVESTMENTS } from "../actions/investments";
import Investment from "../../models/investments";
const initialState = {
  investments: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_INVESTMENTS:
      var investmentsList = [];
      for (var i in action.investments)
        investmentsList.push(
          new Investment(
            action.investments[i].key,
            action.investments[i].category,
            action.investments[i].amount,
            action.investments[i].shareValue
          )
        );
      return {
        investments: investmentsList,
      };
    case ADD_INVESTMENT:
      const newNote = new Investment(
        action.investmentData.id.toString(),
        action.investmentData.category,
        action.investmentData.amount,
        action.investmentData.shareValue
      );
      return {
        investments: state.investments.concat(newNote),
      };
    default:
      return state;
  }
};
