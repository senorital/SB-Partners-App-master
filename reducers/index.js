import { combineReducers } from "redux";
import authReducer from "./auth/auth";
import yogaStudio from "./yogaStudio/yogaStudio";
import category from "./category/category";
import institute from "./institute/institute";
import course from "./course/course";
import qualification from "./qualification/qualification";
import experience from "./experience/experience";
import homeTutor from "./homeTutor/homeTutor";
import locationReducer from "./locationReducer/locationReducer";
import notificationReducer from "./notification/notification";
import redeemReducer from "./redeem/referralData";

export const rootReducer = combineReducers({
  notification: notificationReducer,
  location : locationReducer,
  auth: authReducer,
  studio:yogaStudio,
  category,
  institute,
  course,
  qualification,
  experience,
  homeTutor,
  referralData : redeemReducer
});
