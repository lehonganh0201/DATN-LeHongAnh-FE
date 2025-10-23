import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!BASE_URL) {
  console.warn('VITE_BASE_URL undefined - dùng fallback');
  BASE_URL = 'http://localhost:8080';
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = async (params = {}) => {
  try {
    const defaultParams = {
      page: 0,
      size: 10,
      sortedBy: 'createdAt',
      sortDirection: 'desc',
      status: true,
      ...params,
    };

    const response = await api.get('/api/v1/products', { params: defaultParams });
    const { success, data } = response.data;

    if (!success) {
      throw new Error('Lấy danh sách sản phẩm thất bại');
    }

    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
    }
    throw new Error(error.response?.data?.message || error.message || 'Lỗi server');
  }
};