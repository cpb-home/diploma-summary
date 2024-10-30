import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IHotelsListReducer } from "../../models/interfaces";

const initialState = {
  loading: false,
  error: '',
  hotels: [

  ],
} as IHotelsListReducer;

export const fetchHotels = createAsyncThunk(
  "hotelsList/fetchHotels",
  async () => {
    return await fetch('http://localhost:3001/')
    .then(res => res.json())
  }
);

export const hotelsListSlice = createSlice({
  name: 'hotelsList',
  initialState,
  selectors: {
    hotelsList: (state) => state.hotels,
    hotelsListState: (state) => state,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.hotels = action.payload.Search;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
});

export const { hotelsList, hotelsListState } = hotelsListSlice.selectors;
export default hotelsListSlice.reducer;