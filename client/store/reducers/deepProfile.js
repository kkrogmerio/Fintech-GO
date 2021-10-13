import { CREATE_PROFILE, SET_PROFILE, UPDATE_EMAIL } from "../actions/auth";
import { SET_PROFILE_PIC, UPDATE_SPENDING_LIMITS } from "../actions/profile";

const initialState = {
  id: "",
  userName: "",
  profilePic: "",
  birthday: "",
  salary: "",
  email: "",
  bankAccount: "",
  spendingLimits: Infinity,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SPENDING_LIMITS:
      return { ...state, spendingLimits: action.spendingLimits };
    case UPDATE_EMAIL:
      return { ...state, email: action.email };
    case SET_PROFILE_PIC:
      return {
        ...state,
        profilePic: action.profilePic,
      };
    case SET_PROFILE:
      return {
        ...state,
        salary: action.salary,
        birthday: action.birthday,
      };
    case CREATE_PROFILE:
      return {
        ...action.profileData,
      };
  }

  return state;
};
