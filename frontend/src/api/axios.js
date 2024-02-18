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
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA4Mjg3NDkwLCJpYXQiOjE3MDgyODQ0OTAsImp0aSI6IjY4NzU2ZWY1ZTZjODQwMWJhYjdhYTI0ODJiMjMwZjYwIiwidXNlcl9pZCI6OH0.3lObMhRKcb6BpjAddOxUPc3TXVbefBYvrGz_rDejNs4'
  }
  // withCredentials: true
});
