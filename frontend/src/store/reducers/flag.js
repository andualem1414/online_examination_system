import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFlagsAPI } from 'api/flags';

const initialState = {
  flags: [],
  loading: false,
  error: null
};

export const fetchFlags = createAsyncThunk('flag/fetchFlags', async () => {
  const response = await getFlagsAPI();
  return response;
});

const flag = createSlice({
  name: 'flag',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Flag
      .addCase(fetchFlags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlags.fulfilled, (state, action) => {
        state.flags = action.payload;
        state.loading = false;
      })
      .addCase(fetchFlags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default flag.reducer;
