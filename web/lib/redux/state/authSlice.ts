import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  id: string;
  email: string;
}

export const initialState: AuthState = {
  email: "",
  id: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; email: string }>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
    },

    clearUser: (state) => {
      state.email = "";
      state.id = "";
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
