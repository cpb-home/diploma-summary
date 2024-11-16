import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IRoomsListReducer } from "../../models/interfaces"

interface IRequestWithDate {
  hotelId?: string;
  startDate?: Date;
  finDate?: Date;
}

const initialState = {
  loading: false,
  error: '',
  rooms: [

  ],
} as IRoomsListReducer;

export const fetchRooms = createAsyncThunk(
  'roomsList/fetchRooms',
  async (data: IRequestWithDate) => {console.log(data)
    if (data.startDate && data.finDate) {
      if (data.hotelId) {
        return await fetch(import.meta.env.VITE_COMMON_HOTEL_ROOMS_LIST + data.hotelId + '/rooms')
          .then(res => res.json())
      } else {
        return await fetch(import.meta.env.VITE_COMMON_ROOMS_LIST)
          .then(res => res.json())
      }
    } else {
      if (data.hotelId) {
        return await fetch(import.meta.env.VITE_COMMON_HOTEL_ROOMS_LIST + data.hotelId + '/rooms')
          .then(res => res.json())
      } else {
        return await fetch(import.meta.env.VITE_COMMON_ROOMS_LIST)
          .then(res => res.json())
      }
    }
  }
);

export const roomsListSlice = createSlice({
  name: 'roomsList',
  initialState,
  selectors: {
    roomsList: (state) => state.rooms,
    roomsListState: (state) => state,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        if (action.error.message === 'Failed to fetch') {
          state.error = 'Не удалось подключиться к серверу. Попробуйте позже.';  
        } else {
          state.error = action.error.message as string;
        }
      })
  }
});

export const { roomsList, roomsListState } = roomsListSlice.selectors;
export default roomsListSlice.reducer;