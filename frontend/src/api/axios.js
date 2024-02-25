import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/';

export default axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for adding Authorization header to the request
axiosPrivate.interceptors.request.use(
  (config) => {
    // Check if the access token exists and add it to the request headers
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to Refresh when token expires
axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error status is 403 (Forbidden) and if the request was not already retried
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Make a request to refresh the access token
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshedResponse = await axiosPrivate.post('users/token/refresh/', {
          refresh: `${refreshToken}`
        });

        // Update the access token in local storage and request headers
        const newAccessToken = refreshedResponse.data.access;

        localStorage.setItem('accessToken', newAccessToken);
        axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new access token
        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        // Redirect to login page and save the current path

        sessionStorage.setItem('originalUrl', window.location.pathname);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
