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

export const deleteUserAPI = async (id) => {
  try {
    const response = await axiosPrivate.delete(`users/${id}/delete/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete User', error);
  }
};

export const verifyUserAPI = async (data) => {
  try {
    const response = await axiosPrivate.post(`users/verify-user/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data' // Required for file uploads
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to verify User', error);
  }
};

export const getAllUsersAPI = async () => {
  try {
    const response = await axiosPrivate.get(`/users/list/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch All User', error);
  }
};

export const getRecentActionsAPI = async () => {
  try {
    const response = await axiosPrivate.get(`users/recent-actions/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch RecentActions', error);
  }
};
export const getRulesAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`users/rules/${id}/list/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Rules', error);
  }
};

export const createRulesAPI = async (data) => {
  try {
    const response = await axiosPrivate.post(`users/rules/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create Rule', error);
  }
};

export const deleteRulesAPI = async (id) => {
  try {
    const response = await axiosPrivate.delete(`users/rules/${id}/delete/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete Rule', error);
  }
};
