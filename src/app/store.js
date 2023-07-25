import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/AuthSlices";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
