import { configureStore } from "@reduxjs/toolkit";
import hotelsList from "../slices/hotelsList";
import roomsList from "../slices/roomsList";

export const store = configureStore({
  reducer: {
    hotelsList: hotelsList,
    roomsList: roomsList,
  },
  middleware: (getDefaulMiddleWare) => getDefaulMiddleWare()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
