import { axiosPrivate } from './axios';

export const getExamineeAnswersAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`examinee-answers/?exam-id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Examinee Answers', error);
  }
};

export const getSpecificExamineeAnswersAPI = async (examId, userId) => {
  try {
    const response = await axiosPrivate.get(
      `examinee-answers/answers?user-id=${userId}&exam-id=${examId}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Examinee Answers for this user', error);
  }
};

export const examineeAnswerDetailsAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`examinee-answers/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to find Examinee Answer', error);
  }
};

export const createExamineeAnswerAPI = async (data) => {
  try {
    const response = await axiosPrivate.post(`examinee-answers/`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data['id']);
  }
};

export const updateExamineeAnswerAPI = async (id, data) => {
  try {
    const response = await axiosPrivate.patch(`examinee-answers/${id}/update/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to Update your answer', error);
  }
};

export const deleteExamineeAnswerAPI = async (id) => {
  try {
    await axiosPrivate.delete(`examinee-answers/${id}/delete/`);
  } catch (error) {
    throw new Error('Failed to delete answer', error);
  }
};
