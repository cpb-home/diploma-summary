import { configureStore } from "@reduxjs/toolkit";
import hotelsList from "../slices/hotelsList";
import hotelsListState from "../slices/hotelsList";

export const store = configureStore({
  reducer: {
    hotelsList: hotelsList,
    hotelsListState: hotelsListState,
  },
  middleware: (getDefaulMiddleWare) => getDefaulMiddleWare()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
