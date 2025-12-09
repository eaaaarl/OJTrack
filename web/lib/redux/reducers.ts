import { authApi } from "@/features/auth/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";
import { dashboardApi } from "@/features/dashboard/api/dashboardApi";
import { studentApi } from "@/features/student/api/studentApi";
import { locationApi } from "@/features/location/api/locationApi";

const rootReducer = combineReducers({
  auth: authReducer,

  [authApi.reducerPath]: authApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [studentApi.reducerPath]: studentApi.reducer,
  [locationApi.reducerPath]: locationApi.reducer,
});

export const apis = [authApi, dashboardApi, studentApi, locationApi];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
