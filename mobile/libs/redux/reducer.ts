import { authApi } from "@/features/auth/api/authApi";
import { studentApi } from "@/features/student/api/studentApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,

  [authApi.reducerPath]: authApi.reducer,
  [studentApi.reducerPath]: studentApi.reducer,
});

export const apis = [authApi, studentApi];

export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
