import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!BASE_URL) {
  throw new Error('REACT_APP_BASE_URL chưa được định nghĩa trong .env');
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/v1/auth/login', credentials);
    const { success, data, message, errors } = response.data;

    if (!success) {
      if (errors && Array.isArray(errors)) {
        throw new Error(errors.join(', '));
      }
      throw new Error(message || 'Đăng nhập thất bại');
    }

    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      const { success, message, errors } = error.response.data;
      if (!success && errors) {
        throw new Error(errors.join(', '));
      }
      throw new Error(message || error.message || 'Đăng nhập thất bại');
    }
    throw error;
  }
};