import { axiosPrivate } from './axios';

export const getQuestionPoolAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`/questions/question-pool/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Questions', error);
  }
};

export const createQuestionPoolAPI = async (data) => {
  try {
    const response = await axiosPrivate.post(`/questions/question-pool/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create Questions', error);
  }
};
export const getQuestionsAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`/questions/?exam-id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Questions', error);
  }
};

export const questionDetailsAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`/questions/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to find Question', error);
  }
};

export const createQuestionAPI = async (data) => {
  try {
    const response = await axiosPrivate.post(`/questions/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create Question', error);
  }
};

export const updateQuestionAPI = async (id, data) => {
  try {
    const response = await axiosPrivate.patch(`questions/${id}/update/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update Question', error);
  }
};

export const deleteQuestionAPI = async (id) => {
  try {
    await axiosPrivate.delete(`questions/${id}/delete/`);
  } catch (error) {
    throw new Error('Failed to delete Question', error);
  }
};
