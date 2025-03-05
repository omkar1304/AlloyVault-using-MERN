import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  roleId: null,
  roleName: null,
  firstName: null,
  lastName: null,
  email: null,
  perms: [],
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    },
    logout: () => initialState,
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice;
