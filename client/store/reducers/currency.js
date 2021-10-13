import { RON, EUR, USD } from "../../screens/user/Settings";
const initialState = {
  currency: RON,
  rate: 1,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case RON: {
      return {
        currency: RON,
        rate: 1,
      };
    }
    case USD: {
      return {
        currency: "$",
        rate: 4.4,
      };
    }
    case EUR:
      {
        return {
          currency: "€",
          rate: 5,
        };
      }
  }
  return state;
};
