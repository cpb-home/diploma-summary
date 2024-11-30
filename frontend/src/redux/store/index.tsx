import { configureStore } from "@reduxjs/toolkit";
import hotelsList from "../slices/hotelsList";
import roomsList from "../slices/roomsList";
import currentUser from "../slices/currentUser";

export const store = configureStore({
  reducer: {
    hotelsList: hotelsList,
    roomsList: roomsList,
    currentUser: currentUser,
  },
  middleware: (getDefaulMiddleWare) => getDefaulMiddleWare()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
