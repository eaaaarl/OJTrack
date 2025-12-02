import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  id: string;
  email: string;
  userType: "admin" | "student" | null; // Add this
}

export const initialState: AuthState = {
  email: "",
  id: "",
  userType: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        id: string;
        email: string;
        userType: "admin" | "student";
      }>
    ) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.userType = action.payload.userType;
    },

    clearUser: (state) => {
      state.email = "";
      state.id = "";
      state.userType = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
