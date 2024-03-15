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
    const response = await axios.post(`/users/create/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data' // Required for file uploads
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create User', error);
  }
};

export const updateUserAPI = async (id, data) => {
  try {
    const response = await axiosPrivate.patch(`users/${id}/update/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update User', error);
  }
};
