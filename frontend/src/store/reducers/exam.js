import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  examId: 0
};

const exam = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    changeExam(state, action) {
      console.log(action);
      state.examId = action.payload.examId;
    }
  }
});

export default exam.reducer;

export const { changeExam } = exam.actions;
