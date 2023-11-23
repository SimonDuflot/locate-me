import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    nickname: "",
    places: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUsernameToStore: (state, action) => {
      state.value.nickname = action.payload;
    },
    addCity: (state, action) => {
      state.value.places.push(action.payload);
    },
    removeCity: (state, action) => {
      state.value.places = state.value.places.filter(
        (el) => el.city !== action.payload
      );
    },
  },
});

export const { addUsernameToStore, addCity, removeCity } = userSlice.actions;
export default userSlice.reducer;
