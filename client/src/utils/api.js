import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

export const getExperts = (params) => API.get('/experts', { params });
export const getExpert = (id) => API.get(`/experts/${id}`);
export const createBooking = (data) => API.post('/bookings', data);
export const getBookingsByEmail = (email) => API.get('/bookings', { params: { email } });
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status`, { status });

export default API;
