import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userDetailsAPI } from 'api/users';

const initialState = {
  userDetails: {},
  loading: false,
  error: null
};

export const fetchUserDetails = createAsyncThunk('user/userDetails', async () => {
  const response = await userDetailsAPI();
  return response;
});

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default user.reducer;
