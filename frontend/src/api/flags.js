import { axiosPrivate } from './axios';

export const getFlagsAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`/examinee-answers/flags/?examinee-answer=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Flags', error);
  }
};

export const createFlagAPI = async (id, data) => {
  try {
    const response = await axiosPrivate.post(
      `/examinee-answers/flags/?examinee-answer=${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data' // Required for file uploads
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to create Flag', error);
  }
};
