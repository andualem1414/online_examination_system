import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createExam, deleteExam, getExams, updateExam, examDetails } from 'api/exams';

const initialState = {
  exams: [],
  examDetails: {},
  loading: false,
  error: null
};

export const fetchExams = createAsyncThunk('exam/fetchExams', async () => {
  const response = await getExams();
  return response;
});

export const fetchExamDetails = createAsyncThunk('exam/ExamDetails', async (id) => {
  const response = await examDetails(id);
  return response;
});

export const createData = createAsyncThunk('exam/createData', async (data) => {
  const response = await createExam(data);
  return response;
});

export const updateData = createAsyncThunk('exam/updateData', async (id, data) => {
  const response = await updateExam(id, data);
  return response;
});

export const deleteData = createAsyncThunk('exam/deleteData', async (id) => {
  await deleteExam(id);
  return id; // Return ID so it can be removed from the list
});

const exam = createSlice({
  name: 'exam',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch data
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.exams = action.payload;
        state.loading = false;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Exam Details
      .addCase(fetchExamDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamDetails.fulfilled, (state, action) => {
        state.examDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchExamDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create data
      .addCase(createData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createData.fulfilled, (state, action) => {
        // Add the new data to the state
        state.data.push(action.payload);
        state.loading = false;
      })
      .addCase(createData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update data
      .addCase(updateData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateData.fulfilled, (state, action) => {
        // Update the existing data in the state
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete data
      .addCase(deleteData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        // Remove the deleted data from the state
        const index = state.data.findIndex((item) => item.id === action.payload);
        if (index !== -1) {
          state.data.splice(index, 1);
        }
        state.loading = false;
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default exam.reducer;
