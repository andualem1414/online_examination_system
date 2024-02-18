import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getQuestions, createQuestionRequest } from 'api/questions';

const initialState = {
  questions: [],
  questionDetails: {},
  loading: false,
  error: null
};

export const fetchQuestions = createAsyncThunk('question/fetchQuestions', async (id) => {
  const response = await getQuestions(id);
  return response;
});

// export const fetchExamDetails = createAsyncThunk('exam/ExamDetails', async (id) => {
//   const response = await examDetails(id);
//   return response;
// });

export const createQuestion = createAsyncThunk('question/createQuestion', async (data) => {
  const response = await createQuestionRequest(data);
  return response;
});

// export const updateData = createAsyncThunk('exam/updateData', async (id, data) => {
//   const response = await updateExam(id, data);
//   return response;
// });

// export const deleteData = createAsyncThunk('exam/deleteData', async (id) => {
//   await deleteExam(id);
//   return id; // Return ID so it can be removed from the list
// });

const question = createSlice({
  name: 'question',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch data
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

      //   // Exam Details
      //   .addCase(fetchExamDetails.pending, (state) => {
      //     state.loading = true;
      //     state.error = null;
      //   })
      //   .addCase(fetchExamDetails.fulfilled, (state, action) => {
      //     state.loading = false;
      //     state.examDetails = action.payload;
      //   })
      //   .addCase(fetchExamDetails.rejected, (state, action) => {
      //     state.loading = false;
      //     state.error = action.error.message;
      //   })

      // Create data
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        // Add the new data to the state
        // state.data.push(action.payload);
        state.loading = false;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    //   // Update data
    //   .addCase(updateData.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(updateData.fulfilled, (state, action) => {
    //     // Update the existing data in the state
    //     const index = state.data.findIndex((item) => item.id === action.payload.id);
    //     if (index !== -1) {
    //       state.data[index] = action.payload;
    //     }
    //     state.loading = false;
    //   })
    //   .addCase(updateData.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   })

    //   // Delete data
    //   .addCase(deleteData.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(deleteData.fulfilled, (state, action) => {
    //     // Remove the deleted data from the state
    //     const index = state.data.findIndex((item) => item.id === action.payload);
    //     if (index !== -1) {
    //       state.data.splice(index, 1);
    //     }
    //     state.loading = false;
    //   })
    //   .addCase(deleteData.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   });
  }
});

export default question.reducer;
