import { createSlice } from "@reduxjs/toolkit";
import { Friend, Group } from "../../interface";

interface Common {
  currentRoom: Friend | Group | undefined;
}

const initialState: Common = {
  currentRoom: undefined,
};

const userCommonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentRoom = action.payload;
      console.log(state.currentRoom, "curr chat with");
    },
  },
});

export const userCommonActions = userCommonSlice.actions;
export default userCommonSlice.reducer;
