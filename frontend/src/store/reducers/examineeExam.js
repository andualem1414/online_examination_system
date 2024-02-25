import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getExamineeExamsAPI,
  getExamineesForSpecificExamsAPI,
  examineeExamDetailsAPI,
  createExamineeExamAPI,
  updateExamineeExamAPI,
  deleteExamineeExamAPI
} from 'api/examineeExam';

const initialState = {
  examineeExams: [],
  examineesForSpecificExams: [],
  examineeExamDetails: {},
  loading: false,
  error: null
};

export const fetchExamineeExams = createAsyncThunk('examineeExam/ExamineeExams', async () => {
  const response = await getExamineeExamsAPI();
  return response;
});
export const fetchExamineesForSpecificExams = createAsyncThunk(
  'examineeExam/ExamineesForSpecificExams',
  async (id) => {
    const response = await getExamineesForSpecificExamsAPI(id);
    return response;
  }
);

export const fetchExamineeExamDetails = createAsyncThunk(
  'examineeExam/ExamineeExamDetails',
  async (id) => {
    const response = await examineeExamDetailsAPI(id);
    return response;
  }
);

export const createExamineeExam = createAsyncThunk(
  'examineeExam/createExamineeExam',
  async (data) => {
    const response = await createExamineeExamAPI(data);
    return response;
  }
);

export const updateExamineeExam = createAsyncThunk(
  'examineeExam/updateExamineeExam',
  async ({ id, data }) => {
    const response = await updateExamineeExamAPI(id, data);
    return response;
  }
);

export const deleteExamineeExam = createAsyncThunk(
  'examineeExam/deleteExamineeExam',
  async (id) => {
    await deleteExamineeExamAPI(id);
    return id;
  }
);

const examineeExam = createSlice({
  name: 'examineeExam',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Examinee Exam
      .addCase(fetchExamineeExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamineeExams.fulfilled, (state, action) => {
        state.examineeExams = action.payload;
        state.loading = false;
      })
      .addCase(fetchExamineeExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchExamineesForSpecificExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamineesForSpecificExams.fulfilled, (state, action) => {
        state.examineesForSpecificExams = action.payload;
        state.loading = false;
      })
      .addCase(fetchExamineesForSpecificExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Examinee Exam Details
      .addCase(fetchExamineeExamDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamineeExamDetails.fulfilled, (state, action) => {
        state.examineeExamDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchExamineeExamDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Examinee Exam
      .addCase(createExamineeExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExamineeExam.fulfilled, (state, action) => {
        state.examineeExamDetails = action.payload;
        state.loading = false;
      })
      .addCase(createExamineeExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Examinee Exam
      .addCase(updateExamineeExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExamineeExam.fulfilled, (state, action) => {
        state.examineeExamDetails = action.payload;
        state.loading = false;
      })
      .addCase(updateExamineeExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Examinee Exam
      .addCase(deleteExamineeExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExamineeExam.fulfilled, (state, action) => {
        const index = state.examineeExams.findIndex((item) => item.id === action.payload);
        if (index !== -1) {
          state.examineeExams.splice(index, 1);
        }
        state.loading = false;
      })
      .addCase(deleteExamineeExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default examineeExam.reducer;
