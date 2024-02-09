import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from "./slices/userSlice";
import userFriendSlice from "./slices/allUsersSlice";
import userMessage from "./slices/messageSlice";
import userGroup from "./slices/groupSlice";
import userCommon from "./slices/commonSlice";

export const store = configureStore({
  reducer: {
    User: userReducer,
    Friend: userFriendSlice,
    Message: userMessage,
    Group: userGroup,
    Common: userCommon,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
