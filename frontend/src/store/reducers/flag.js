import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFlagsAPI, createFlagAPI, deleteFlagAPI } from 'api/flags';

const initialState = {
  flags: [],
  flagDetails: {},
  loading: false,
  error: null
};

export const fetchFlags = createAsyncThunk('flag/fetchFlags', async (id) => {
  const response = await getFlagsAPI(id);
  return response;
});

export const createFlag = createAsyncThunk('flag/createFlag', async ({ id, data }) => {
  const response = await createFlagAPI(id, data);
  return response;
});

export const deleteFlag = createAsyncThunk('flag/deleteFlag', async ({ id, examineeExamId }) => {
  await deleteFlagAPI(id, examineeExamId);
  return id;
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
        state.flags = [];
        state.error = action.error.message;
      })
      // Create Flag
      .addCase(createFlag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlag.fulfilled, (state, action) => {
        state.flagDetails = action.payload;
        state.loading = false;
      })
      .addCase(createFlag.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })
      // Delete Flag
      .addCase(deleteFlag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFlag.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteFlag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default flag.reducer;
