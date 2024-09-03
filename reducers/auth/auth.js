import {
  REGISTER,
  LOGIN,
  VERIFY_OTP,
  GET_INSTRUCTOR,
  UPDATE_INSTRUCTOR,
  UPDATE_TUTOR_TERM,
  UPDATE_THERAPIST_TERM,
  UPDATE_YS_TERM,
  REGISTER_EMAIL,
  LOGIN_EMAIL,
  VERIFY_OTP_EMAIL,
  ADD_AADHAR_VERIFICATION,
  GET_AADHAR_VERIFICATION,
  ADD_BANK_VERIFICATION,
  GET_BANK_VERIFICATION,
} from "../../constants/actionTypes";

const initialState = {
  user: null,
  aadharVerification: null,
  bankVerification: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER:
    case LOGIN:
    case VERIFY_OTP:
    case REGISTER_EMAIL:
    case LOGIN_EMAIL:
    case VERIFY_OTP_EMAIL:
      return {
        ...state,
        user: action.payload.user,
      };
    case GET_INSTRUCTOR:
      return {
        ...state,
        user: action.payload,
      };
    case UPDATE_INSTRUCTOR:
    case UPDATE_TUTOR_TERM:
    case UPDATE_THERAPIST_TERM:
    case UPDATE_YS_TERM:
      return {
        ...state,
        success: action.payload,
        error: null,
      };
    case GET_AADHAR_VERIFICATION:
      return {
        ...state,
        aadharVerification: action.payload,
      };
    case GET_BANK_VERIFICATION:
      return {
        ...state,
        bankVerification: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
