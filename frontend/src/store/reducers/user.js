import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createUserAPI,
  updateUserAPI,
  userDetailsAPI,
  verifyUserAPI,
  getAllUsersAPI,
  getRecentActionsAPI
} from 'api/users';

const initialState = {
  recentActions: [],
  users: [],
  userDetails: {},
  verified: false,
  loading: false,
  error: null
};

export const fetchAllUsers = createAsyncThunk('exam/fetchAllUsers', async () => {
  const response = await getAllUsersAPI();
  return response;
});
export const fetchRecentActions = createAsyncThunk('exam/fetchRecentActions', async () => {
  const response = await getRecentActionsAPI();
  return response;
});

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
export const verifyUser = createAsyncThunk('user/verifyUser', async (data) => {
  const response = await verifyUserAPI(data);
  return response;
});

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // All User
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRecentActions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActions.fulfilled, (state, action) => {
        state.recentActions = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecentActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
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
      })
      // Verify User
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.verified = action.payload.verified;
        state.loading = false;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default user.reducer;
