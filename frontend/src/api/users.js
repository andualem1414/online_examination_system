import { axiosPrivate } from './axios';
import axios from './axios';

export const userDetailsAPI = async () => {
  try {
    const response = await axiosPrivate.get('users/details/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to find user', error);
  }
};

export const createUserAPI = async (data) => {
  try {
    const response = await axios.post(`/users/create/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create User', error);
  }
};
