import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getQuestionsAPI,
  questionDetailsAPI,
  createQuestionAPI,
  updateQuestionAPI,
  deleteQuestionAPI,
  getQuestionPoolAPI,
  createQuestionPoolAPI
} from 'api/questions';

const initialState = {
  questions: [],
  questionPool: [],
  questionDetails: {},
  loading: false,
  error: null
};

export const fetchQuestionPool = createAsyncThunk('question/fetchQuestionPool', async (id) => {
  const response = await getQuestionPoolAPI(id);
  return response;
});

export const createQuestionPool = createAsyncThunk('question/createQuestionPool', async (data) => {
  const response = await createQuestionPoolAPI(data);
  return response;
});

export const fetchQuestions = createAsyncThunk('question/fetchQuestions', async (id) => {
  const response = await getQuestionsAPI(id);
  return response;
});

export const fetchQuestionDetails = createAsyncThunk('question/questionDetails', async (id) => {
  const response = await questionDetailsAPI(id);
  return response;
});

export const createQuestion = createAsyncThunk('question/createQuestion', async (data) => {
  const response = await createQuestionAPI(data);
  return response;
});

export const updateQuestion = createAsyncThunk('question/updateQuestion', async ({ id, data }) => {
  const response = await updateQuestionAPI(id, data);
  return response;
});

export const deleteQuestion = createAsyncThunk('question/deleteQuestion', async (id) => {
  await deleteQuestionAPI(id);
  return id;
});

const question = createSlice({
  name: 'question',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Question Pool
      .addCase(fetchQuestionPool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionPool.fulfilled, (state, action) => {
        state.questionPool = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuestionPool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Question Pool
      .addCase(createQuestionPool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestionPool.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createQuestionPool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Question
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Question Details
      .addCase(fetchQuestionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionDetails.fulfilled, (state, action) => {
        state.questionDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuestionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Question
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questionDetails = action.payload;
        state.loading = false;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Question
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.questionDetails = action.payload;
        state.loading = false;
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Question
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex((item) => item.id === action.payload);
        if (index !== -1) {
          state.questions.splice(index, 1);
        }
        state.loading = false;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default question.reducer;
