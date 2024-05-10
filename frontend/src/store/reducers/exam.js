import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getExamsAPI,
  getPublicExamsAPI,
  examDetailsAPI,
  createExamAPI,
  updateExamAPI,
  deleteExamAPI,
  getAllExamsAPI
} from 'api/exams';

const initialState = {
  exams: [],
  examDetails: {},
  loading: false,
  error: null
};

export const fetchExams = createAsyncThunk('exam/fetchExams', async () => {
  const response = await getExamsAPI();
  return response;
});

export const fetchAllExams = createAsyncThunk('exam/fetchAllExams', async () => {
  const response = await getAllExamsAPI();
  return response;
});

export const fetchPublicExams = createAsyncThunk('exam/fetchPublicExams', async () => {
  const response = await getPublicExamsAPI();
  return response;
});

export const fetchExamDetails = createAsyncThunk('exam/examDetails', async (id) => {
  const response = await examDetailsAPI(id);
  return response;
});

export const createExam = createAsyncThunk('exam/createExam', async (data) => {
  const response = await createExamAPI(data);
  return response;
});

export const updateExam = createAsyncThunk('exam/updateExam', async ({ id, data }) => {
  const response = await updateExamAPI(id, data);
  return response;
});

export const deleteExam = createAsyncThunk('exam/deleteExam', async (id) => {
  await deleteExamAPI(id);
  return id;
});

const exam = createSlice({
  name: 'exam',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Exam
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
      // Fetch Exam
      .addCase(fetchAllExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExams.fulfilled, (state, action) => {
        state.exams = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Public Exam
      .addCase(fetchPublicExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicExams.fulfilled, (state, action) => {
        state.exams = action.payload;
        state.loading = false;
      })
      .addCase(fetchPublicExams.rejected, (state, action) => {
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
        state.examDetails = {};
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Exam
      .addCase(createExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.examDetails = action.payload;
        state.loading = false;
      })
      .addCase(createExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Exam
      .addCase(updateExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        state.examDetails = action.payload;
        state.loading = false;
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Exam
      .addCase(deleteExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        const index = state.exams.findIndex((item) => item.id === action.payload);
        if (index !== -1) {
          state.exams.splice(index, 1);
        }
        state.loading = false;
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default exam.reducer;
