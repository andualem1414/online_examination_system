import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getExamineeAnswersAPI,
  getSpecificExamineeAnswersAPI,
  examineeAnswerDetailsAPI,
  createExamineeAnswerAPI,
  updateExamineeAnswerAPI,
  deleteExamineeAnswerAPI
} from 'api/examineeAnswer';

const initialState = {
  examineeAnswers: [],
  examineeAnswerDetails: {},
  answersForSpecificExaminee: [],
  loading: false,
  error: null
};

export const fetchExamineeAnswers = createAsyncThunk(
  'examineeAnswer/ExamineeAnswers',
  async (examId) => {
    const response = await getExamineeAnswersAPI(examId);
    return response;
  }
);

export const fetchSpecificExamineeAnswers = createAsyncThunk(
  'examineeAnswer/SpecificExamineeAnswers',
  async ({ examId, userId }) => {
    const response = await getSpecificExamineeAnswersAPI(examId, userId);
    return response;
  }
);

export const fetchExamineeAnswerDetails = createAsyncThunk(
  'examineeAnswer/ExamineeAnswerDetails',
  async (id) => {
    const response = await examineeAnswerDetailsAPI(id);
    return response;
  }
);

export const createExamineeAnswer = createAsyncThunk(
  'examineeAnswer/createExamineeAnswer',
  async (data) => {
    const response = await createExamineeAnswerAPI(data);
    return response;
  }
);

export const updateExamineeAnswer = createAsyncThunk(
  'examineeAnswer/updateExamineeAnswer',
  async ({ id, data }) => {
    const response = await updateExamineeAnswerAPI(id, data);
    return response;
  }
);

export const deleteExamineeAnswer = createAsyncThunk(
  'examineeAnswer/deleteExamineeAnswer',
  async (id) => {
    await deleteExamineeAnswerAPI(id);
    return id;
  }
);

const examineeAnswer = createSlice({
  name: 'examineeAnswer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Examinee Answer
      .addCase(fetchExamineeAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamineeAnswers.fulfilled, (state, action) => {
        state.examineeAnswers = action.payload;
        state.loading = false;
      })
      .addCase(fetchExamineeAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Specific Examinee Answer
      .addCase(fetchSpecificExamineeAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecificExamineeAnswers.fulfilled, (state, action) => {
        state.answersForSpecificExaminee = action.payload;
        state.loading = false;
      })
      .addCase(fetchSpecificExamineeAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Examinee Answer Details
      .addCase(fetchExamineeAnswerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamineeAnswerDetails.fulfilled, (state, action) => {
        state.examineeAnswerDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchExamineeAnswerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Examinee Answer
      .addCase(createExamineeAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExamineeAnswer.fulfilled, (state, action) => {
        state.examineeAnswerDetails = action.payload;
        state.loading = false;
      })
      .addCase(createExamineeAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Examinee Answer
      .addCase(updateExamineeAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExamineeAnswer.fulfilled, (state, action) => {
        state.examineeAnswerDetails = action.payload;
        state.loading = false;
      })
      .addCase(updateExamineeAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Examinee Answer
      .addCase(deleteExamineeAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExamineeAnswer.fulfilled, (state, action) => {
        const index = state.examineeAnswers.findIndex((item) => item.id === action.payload);
        if (index !== -1) {
          state.examineeAnswers.splice(index, 1);
        }
        state.loading = false;
      })
      .addCase(deleteExamineeAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default examineeAnswer.reducer;
