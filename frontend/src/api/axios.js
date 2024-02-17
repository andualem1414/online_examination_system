import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:8000/api/';

export default axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA4MTg0NDU0LCJpYXQiOjE3MDgxODE0NTQsImp0aSI6ImZhNDNkNDIxMDNiMzRiNTBhYzg3MGIzMGE5NDVhYzE0IiwidXNlcl9pZCI6OH0.0elu5tINCIKdR4ejZFtqHntv2AccRTa1UCjfrd79ik8'
  }
  // withCredentials: true
});
