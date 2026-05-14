import { api } from './api';

const BASE = '/lich-hen';

export const bookingService = {
  createBooking: (payload) => 
    api.post(BASE, payload),

  getBookingsByType: (loai) => 
    api.get(`${BASE}/loai/${loai}`),

  getMyBookings: () => 
    api.get(`${BASE}/my-lich-hen`),

  updateBookingStatus: (id, status) => 
    api.put(`${BASE}/${id}/status`, null, { params: { status } }),

  cancelBooking: (id) => 
    api.put(`${BASE}/${id}/status`, null, { params: { status: 'DA_HUY' } }),
};
