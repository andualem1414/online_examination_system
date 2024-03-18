import { axiosPrivate } from './axios';

export const getPaymentsAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`exams/payments/?user-id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch payments', error);
  }
};
export const getAllPaymentsAPI = async () => {
  try {
    const response = await axiosPrivate.get(`exams/payments/all/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch all payments', error);
  }
};

export const getPaymentCodeAPI = async () => {
  try {
    const response = await axiosPrivate.get(`exams/payments/code/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch code', error);
  }
};

export const createPaymentAPI = async (data) => {
  try {
    const response = await axiosPrivate.post(`exams/payments/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create Payment', error);
  }
};
