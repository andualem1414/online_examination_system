import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getPaymentsAPI,
  getPaymentCodeAPI,
  createPaymentAPI,
  getAllPaymentsAPI
} from 'api/payments';

const initialState = {
  payments: [],
  paymentCode: {},
  loading: false,
  error: null
};

export const fetchPayments = createAsyncThunk('payment/fetchPayments', async (id) => {
  const response = await getPaymentsAPI(id);
  return response;
});
export const fetchAllPayments = createAsyncThunk('payment/fetchAllPayments', async (id) => {
  const response = await getAllPaymentsAPI(id);
  return response;
});
export const fetchPaymentCode = createAsyncThunk('payment/fetchPaymentCode', async () => {
  const response = await getPaymentCodeAPI();
  return response;
});

export const createPayment = createAsyncThunk('payment/createPayment', async (data) => {
  const response = await createPaymentAPI(data);
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
      })
      // Fetch payment
      .addCase(fetchAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch payment
      .addCase(fetchPaymentCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentCode.fulfilled, (state, action) => {
        state.paymentCode = action.payload;
        state.loading = false;
      })
      .addCase(fetchPaymentCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default payment.reducer;
