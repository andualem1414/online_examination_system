import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserAPI, updateUserAPI, userDetailsAPI } from 'api/users';

const initialState = {
  userDetails: {},
  loading: false,
  error: null
};

export const fetchUserDetails = createAsyncThunk('user/userDetails', async () => {
  const response = await userDetailsAPI();
  return response;
});

export const createUser = createAsyncThunk('user/createUser', async (data) => {
  const response = await createUserAPI(data);
  return response;
});

export const updateUser = createAsyncThunk('user/updateUser', async ({ id, data }) => {
  const response = await updateUserAPI(id, data);
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
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default user.reducer;
