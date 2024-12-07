import { createSlice } from "@reduxjs/toolkit";
import { ICurrentUser } from "../../models/interfaces"

const initialState = {
  email: null,
  id: null,
  role: null,
  isAuthenticated: false,
} as ICurrentUser;

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    clearCurrentUser: (state) => {
      state.email = null;
      state.id = null;
      state.role = null;
      state.isAuthenticated = false;
    }
  }
})

export const { setCurrentUser, clearCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
