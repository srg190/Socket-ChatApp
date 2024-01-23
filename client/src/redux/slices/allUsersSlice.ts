import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Friends } from "../../interface";
import { Api } from "../../api";

const initialState: Friends = {
  users: [],
  message: "",
  success: false,
  loading: false,
  error: "",
};

export const userFriends = createAsyncThunk(
  "user/friends",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(Api.Friends, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue({
          error: error.response?.data,
        });
      } else {
        return "An error occurred";
      }
    }
  }
);

const userFriendSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userFriends.pending, (state) => {
      state.loading = true;
      state.message = "";
      state.error = "";
    });
    builder.addCase(userFriends.fulfilled, (state, action) => {
      state.users = [...action.payload.users];
      state.message = action.payload.message;
      state.success = action.payload.success;
      state.loading = false;
    });
    builder.addCase(userFriends.rejected, (state, action) => {
      const payloadError = (
        action.payload as {
          error: {
            message: string;
            success: boolean;
          };
        }
      )?.error;
      state.loading = false;
      state.success = payloadError.success;
      state.error = payloadError.message;
      state.message = "";
    });
  },
});

export const userFriendActions = userFriendSlice.actions;
export default userFriendSlice.reducer;
