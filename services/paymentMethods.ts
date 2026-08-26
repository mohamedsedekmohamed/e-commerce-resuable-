import api from './api';
import { AxiosResponse } from 'axios';

export const paymentMethodsAdmin = {
  getPaymentMethods: (
    locale: string,
    params?: { page?: number; search?: string }
  ): Promise<AxiosResponse> =>
    api.get('/admin/payment-methods', {
      headers: { 'Accept-Language': locale },
      params,
    }),

  getPaymentMethodsList: (locale: string): Promise<AxiosResponse> =>
    api.get('/admin/payment-methods/list', {
      headers: { 'Accept-Language': locale },
    }),

  getPaymentMethod: (id: string | number, locale: string): Promise<AxiosResponse> =>
    api.get(`/admin/payment-methods/${id}`, {
      headers: { 'Accept-Language': locale },
    }),

  addPaymentMethod: (data: FormData): Promise<AxiosResponse> =>
    api.post('/admin/payment-methods', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updatePaymentMethod: (id: string | number, data: FormData): Promise<AxiosResponse> =>
    api.post(`/admin/payment-methods/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deletePaymentMethod: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/admin/payment-methods/${id}`),

  changePaymentMethodStatus: (id: string | number, status: boolean): Promise<AxiosResponse> =>
    api.post(`/admin/payment-methods/${id}/change-status`, { status: status ? '1' : '0' }),
};
