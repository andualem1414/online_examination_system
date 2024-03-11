import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPaymentsAPI } from 'api/payments';

const initialState = {
  payments: [],
  loading: false,
  error: null
};

export const fetchPayments = createAsyncThunk('payment/fetchPayments', async (id) => {
  const response = await getPaymentsAPI(id);
  return response;
});

const payment = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch payment
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
        state.loading = false;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default payment.reducer;
