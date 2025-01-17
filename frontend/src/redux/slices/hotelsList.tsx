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
    return await fetch(import.meta.env.VITE_COMMON + 'hotels')
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
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        if (action.error.message === 'Failed to fetch') {
          state.error = 'Не удалось подключиться к серверу. Попробуйте позже.';  
        } else {
          state.error = action.error.message as string;
        }
      })
  }
});

export const { hotelsList, hotelsListState } = hotelsListSlice.selectors;
export default hotelsListSlice.reducer;