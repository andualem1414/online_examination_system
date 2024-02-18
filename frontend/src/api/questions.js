import { axiosPrivate } from './axios';

export const getQuestions = async (id) => {
  try {
    const response = await axiosPrivate.get(`/questions/?exam-id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data', error);
  }
};

export const createQuestionRequest = async (data) => {
  try {
    const response = await axiosPrivate.post(`/questions/`, data);
    return response.data;
  } catch (error) {
    // console.log(error.response.data.detail);
    throw new Error('Failed to create Questions', error);
  }
};

// export const updateExam = async (id, data) => {
//   try {
//     const response = await axiosPrivate.patch(`/data/${id}`, data);
//     return response.data;
//   } catch (error) {
//     throw new Error('Failed to update data:', error);
//   }
// };

// export const deleteExam = async (id) => {
//   try {
//     await axiosPrivate.delete(`/data/${id}`);
//   } catch (error) {
//     throw new Error('Failed to delete data:', error);
//   }
// };

// export const examDetails = async (id) => {
//   try {
//     const response = await axiosPrivate.get(`/exams/${id}/`);
//     return response.data;
//   } catch (error) {
//     throw new Error('Failed to find exam:', error);
//   }
// };
