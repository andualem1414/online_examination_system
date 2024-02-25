import { axiosPrivate } from './axios';

export const getExamineeExamsAPI = async () => {
  try {
    const response = await axiosPrivate.get(`/examinee-exams/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Exams', error);
  }
};

export const getExamineesForSpecificExamsAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`examinee-exams/examinees?exam-id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Exams', error);
  }
};

export const examineeExamDetailsAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`/examinee-exams/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to find exam', error);
  }
};

export const createExamineeExamAPI = async (data) => {
  try {
    const response = await axiosPrivate.post(`/examinee-exams/`, data);
    return response.data;
  } catch (error) {
    if (error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw new Error('Failed to Join Exam');
    }
  }
};

export const updateExamineeExamAPI = async (id, data) => {
  try {
    const response = await axiosPrivate.patch(`examinee-exams/${id}/update/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to Submit Exam', error);
  }
};

export const deleteExamineeExamAPI = async (id) => {
  try {
    await axiosPrivate.delete(`examinee-exams/${id}/delete/`);
  } catch (error) {
    throw new Error('Failed to delete Exam', error);
  }
};
