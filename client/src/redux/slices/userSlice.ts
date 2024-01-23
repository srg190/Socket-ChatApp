import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UserAuth, UserLogin, UserRegistration } from "../../interface";
import { Api } from "../../api";
import { setCookie } from "../../utilities";

const initialState: UserAuth = {
  user: {
    id: "",
    email: "",
    userName: "",
    groupIds: [],
    isOnline: false,
    lastSeen: null,
    createAt: null,
    groupAdmin: [],
  },
  token: "",
  message: "",
  success: false,
  loading: false,
  error: "",
};

export const userRegistration = createAsyncThunk(
  "user/register",
  async (data: UserRegistration, thunkAPI) => {
    try {
      const res = await axios.post(Api.Register, data, {
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

export const userLogin = createAsyncThunk(
  "user/login",
  async (data: UserLogin, thunkAPI) => {
    try {
      const res = await axios.post(Api.Login, data, {
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

export const userLogout = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      const res = await axios.post(
        Api.Logout,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userRegistration.pending, (state) => {
      state.loading = true;
      state.message = "";
      state.error = "";
    });
    builder.addCase(userRegistration.fulfilled, (state, action) => {
      state.user = { ...action.payload.user };
      state.message = action.payload.message;
      state.token = action.payload.token;
      state.success = action.payload.success;
      state.loading = false;
      console.log("state..... redux, ", state);
    });
    builder.addCase(userRegistration.rejected, (state, action) => {
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

    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
      state.message = "";
      state.error = "";
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.user = { ...action.payload.user };
      state.message = action.payload.message;
      state.token = action.payload.token;
      state.success = action.payload.success;
      state.loading = false;
      console.log("state..... redux, ", state);
    });
    builder.addCase(userLogin.rejected, (state, action) => {
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

    builder.addCase(userLogout.pending, (state) => {
      state.loading = true;
      state.message = "";
      state.error = "";
    });
    builder.addCase(userLogout.fulfilled, (state, action) => {
      state.message = action.payload.message;
      state.success = action.payload.success;
      state.loading = false;
      console.log("state..... redux, ", state);
    });
    builder.addCase(userLogout.rejected, (state, action) => {
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

export const userActions = userSlice.actions;
export default userSlice.reducer;
