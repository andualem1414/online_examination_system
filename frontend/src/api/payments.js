import { axiosPrivate } from './axios';

export const getPaymentsAPI = async (id) => {
  try {
    const response = await axiosPrivate.get(`exams/payments/?user-id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch payments', error);
  }
};
