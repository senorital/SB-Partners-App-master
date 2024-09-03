import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "../../api";
import {
  REGISTER,
  LOGIN,
  VERIFY_OTP,
  GET_INSTRUCTOR,
  UPDATE_INSTRUCTOR,
  UPDATE_TUTOR_TERM,
  UPDATE_THERAPIST_TERM,
  UPDATE_YS_TERM,
  ADD_AADHAR_VERIFICATION,
  GET_AADHAR_VERIFICATION,
  ADD_BANK_VERIFICATION,
  GET_BANK_VERIFICATION,
  REGISTER_EMAIL,LOGIN_EMAIL,
  VERIFY_OTP_EMAIL
} from "../../constants/actionTypes";

export const register = (userInfo) => async (dispatch) => {
  try {
    const { data } = await api.register(userInfo);
    dispatch({ type: REGISTER, payload: data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = (userInfo) => async (dispatch) => {
  try {
    const { data } = await api.login(userInfo);
    dispatch({ type: LOGIN, payload: data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginEmail = (userInfo) => async (dispatch) => {
  try {
    const { data } = await api.loginEmail(userInfo);
    dispatch({ type: LOGIN_EMAIL, payload: data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const registerEmail = (userInfo) => async (dispatch) => {
  try {
    const { data } = await api.registerEmail(userInfo);
    dispatch({ type: REGISTER_EMAIL, payload: data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyOtp = (otpInfo) => async (dispatch) => {
  try {
    const { data } = await api.verifyOtp(otpInfo);
    dispatch({ type: VERIFY_OTP, payload: data });
    console.log("authToken", data.authToken);
    await AsyncStorage.setItem("authToken", data.authToken);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verfiyOtpByEmail = (otpInfo) => async (dispatch) => {
  try {
    const { data } = await api.verfiyOtpByEmail(otpInfo);
    dispatch({ type: VERIFY_OTP_EMAIL, payload: data });
    console.log("authToken", data.authToken);
    await AsyncStorage.setItem("authToken", data.authToken);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getInstructor = () => async (dispatch) => {
  try {
    const { data } = await api.getInstructor();
    dispatch({ type: GET_INSTRUCTOR, payload: data.data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateInstructor = (formData) => async (dispatch) => {
  try {
    const response = await api.updateInstructor(formData);
    dispatch({ type: UPDATE_INSTRUCTOR, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTutorTerm = (termInfo) => async (dispatch) => {
  try {
    const response = await api.updateTutorTerm(termInfo);
    dispatch({ type: UPDATE_TUTOR_TERM, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTherapistTerm = (termInfo) => async (dispatch) => {
  try {
    const response = await api.updateTherapistTerm(termInfo);
    dispatch({ type: UPDATE_THERAPIST_TERM, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const updateYogaStudioTerm = (termInfo) => async (dispatch) => {
  try {
    const response = await api.updateYogaStudioTerm(termInfo);
    dispatch({ type: UPDATE_YS_TERM, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addKYC = (formData) => async (dispatch) => {
  try {
    const response = await api.addKYC(formData);
    console.log(response);
    dispatch({ type: ADD_AADHAR_VERIFICATION, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getKYC = () => async (dispatch) => {
  try {
    const response = await api.getKYC();
    dispatch({ type: GET_AADHAR_VERIFICATION, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const addBankDetails = (formData) => async (dispatch) => {
  try {
    const response = await api.addBankDetails(formData);
    dispatch({ type: ADD_BANK_VERIFICATION, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getBankDetails = () => async (dispatch) => {
  try {
    const response = await api.getBankDetails();
    dispatch({ type: GET_BANK_VERIFICATION, payload: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};




