import { axiosPrivate } from './axios';

export const userDetailsAPI = async () => {
  try {
    const response = await axiosPrivate.get('users/details/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to find user', error);
  }
};
