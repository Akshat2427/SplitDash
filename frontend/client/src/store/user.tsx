import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("user") || 'null') || {
  isLogin: false,
  username: "",
  email: "",
  photo: "",
  phone: 0,
  expenseID: "",
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("New USER", action.payload);
      
     
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.photo = action.payload.photo;
      state.phone = action.payload.phone;
      state.isLogin = true; 
      state.expenseID = action.payload.expenseID;
      
      
      localStorage.setItem("user", JSON.stringify(state));

      console.log("Updated State Saved:", state);
    },
    clearUser: (state) => {
      
      Object.assign(state, {
        isLogin: false,
        username: "",
        email: "",
        photo: "",
        phone: 0,
      });

      
      localStorage.removeItem("user");

      console.log("User Cleared");
    },
  },
});

export const { setUser, clearUser } = UserSlice.actions;

export default UserSlice.reducer;
