import { axiosPrivate } from './axios';

export const getFlagsAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`/examinee-answers/flags/?examinee-answer=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Flags', error);
  }
};
