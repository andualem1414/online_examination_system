import { axiosPrivate } from './axios';

export const getExamsAPI = async () => {
  try {
    const response = await axiosPrivate.get(`/exams`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Exams', error);
  }
};
export const getAllExamsAPI = async () => {
  try {
    const response = await axiosPrivate.get(`/exams/admin-exams`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch All Exams', error);
  }
};

export const getPublicExamsAPI = async () => {
  try {
    const response = await axiosPrivate.get(`exams/public-exams/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Public Exams', error);
  }
};

export const examDetailsAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`/exams/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to find exam', error);
  }
};

export const createExamAPI = async (data) => {
  try {
    const response = await axiosPrivate.post(`/exams/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create Exam', error);
  }
};

export const updateExamAPI = async (id, data) => {
  try {
    const response = await axiosPrivate.patch(`exams/${id}/update/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update Exam', error);
  }
};

export const deleteExamAPI = async (id) => {
  try {
    await axiosPrivate.delete(`exams/${id}/delete/`);
  } catch (error) {
    throw new Error('Failed to delete Exam', error);
  }
};
