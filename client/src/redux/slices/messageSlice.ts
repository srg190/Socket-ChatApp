import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SendMessage, Messeges, MessageRequest } from "../../interface";
import { Api } from "../../api";

const initialState: Messeges = {
  messages: [],
  loading: false,
  message: "",
  error: "",
  success: false,
  page: 1,
  pageSize: 30,
  countMessage: 0,
};

export const userSendMessage = createAsyncThunk(
  "message/send",
  async (data: SendMessage, thunkAPI) => {
    try {
      const res = await axios.post(Api.SendMessage, data, {
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

export const getUserConversation = createAsyncThunk(
  "message/data",
  async (data: MessageRequest, thunkAPI) => {
    try {
      const res = await axios.post(Api.Conversation, data, {
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

export const getGroupConversation = createAsyncThunk(
  "message/groupData",
  async (data: MessageRequest, thunkAPI) => {
    try {
      const res = await axios.post(Api.GroupConversation, data, {
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

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.countMessage += 1;
      state.messages = [...state.messages, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userSendMessage.pending, (state) => {
      state.loading = true;
      state.message = "";
      state.error = "";
    });
    builder.addCase(userSendMessage.fulfilled, (state, action) => {
      state.message = action.payload.message;
      state.success = action.payload.success;
      state.loading = false;
    });
    builder.addCase(userSendMessage.rejected, (state, action) => {
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

    builder.addCase(getUserConversation.pending, (state) => {
      state.loading = true;
      state.message = "";
      state.error = "";
    });
    builder.addCase(getUserConversation.fulfilled, (state, action) => {
      state.messages = action.payload.data;
      state.message = action.payload.message;
      state.success = action.payload.success;
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.loading = false;
    });
    builder.addCase(getUserConversation.rejected, (state, action) => {
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

    builder.addCase(getGroupConversation.pending, (state) => {
      state.loading = true;
      state.message = "";
      state.error = "";
    });
    builder.addCase(getGroupConversation.fulfilled, (state, action) => {
      state.messages = action.payload.data.messages;
      state.message = action.payload.message;
      state.success = action.payload.success;
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.loading = false;
    });
    builder.addCase(getGroupConversation.rejected, (state, action) => {
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

export const messageAction = messageSlice.actions;
export default messageSlice.reducer;
