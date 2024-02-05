import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { GroupList } from "../../interface";
import { Api } from "../../api";

const initialState: GroupList = {
  id: "",
  name: "",
  userIds: [],
  adminId: "",
  users: [],
  loading: false,
  message: "",
  error: "",
  success: false,
};

export const getGroupUsersList = createAsyncThunk(
  "group/list",
  async (data: { groupId: string }, thunkAPI) => {
    try {
      const res = await axios.post(Api.GroupUsersList, data, {
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

const userGroupSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGroupUsersList.pending, (state) => {
      state.loading = true;
      state.message = "";
      state.error = "";
    });
    builder.addCase(getGroupUsersList.fulfilled, (state, action) => {
      state.message = action.payload.message;
      state.success = action.payload.success;
      state.id = action.payload.data.id;
      state.name = action.payload.data.name;
      state.userIds = action.payload.data.userIds;
      state.users = action.payload.data.users;
      state.adminId = action.payload.data.adminId;
      state.loading = false;
    });
    builder.addCase(getGroupUsersList.rejected, (state, action) => {
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

export const userActions = userGroupSlice.actions;
export default userGroupSlice.reducer;
