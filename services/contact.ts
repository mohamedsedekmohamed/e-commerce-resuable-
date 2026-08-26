import api from './api';
import { AxiosResponse } from 'axios';
import { ContactMessage, ContactPaginatedResponse } from '@/types/contact.interface';

export const contactAdmin = {
  getContact: (params?: { page?: number }): Promise<AxiosResponse<ContactPaginatedResponse>> =>
    api.get('/admin/contact', { params }),
  getHistory: (params?: { page?: number }): Promise<AxiosResponse<ContactPaginatedResponse>> =>
    api.get('/admin/contact/history', { params }),
  markAsRead: (id: string | number): Promise<AxiosResponse<ContactMessage>> =>
    api.get(`/admin/contact/read/${id}`),
};
