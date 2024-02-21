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
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA4NTMzNTc4LCJpYXQiOjE3MDg0NDcxNzgsImp0aSI6ImNmYTExYWZhYTFjZjRkMTY4YmU4MDhmZGY1MjkyZmJmIiwidXNlcl9pZCI6OH0.f5_er900gHHve_5Apt19EoAnedjnNER-tGIOMSKPprM'
  }
  // withCredentials: true
});
