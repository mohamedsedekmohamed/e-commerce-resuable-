import api from './api';
import { AxiosResponse } from 'axios';

export const couponsAdmin = {
  getCoupons: (
    locale: string,
    params?: { page?: number; search?: string }
  ): Promise<AxiosResponse> =>
    api.get('/admin/coupons', {
      headers: { 'Accept-Language': locale },
      params,
    }),

  getCouponsList: (locale: string): Promise<AxiosResponse> =>
    api.get('/admin/coupons/list', {
      headers: { 'Accept-Language': locale },
    }),

  getCoupon: (id: string | number, locale: string): Promise<AxiosResponse> =>
    api.get(`/admin/coupons/${id}`, {
      headers: { 'Accept-Language': locale },
    }),

  addCoupon: (data: unknown): Promise<AxiosResponse> =>
    api.post('/admin/coupons', data),

  updateCoupon: (id: string | number, data: unknown): Promise<AxiosResponse> =>
    api.post(`/admin/coupons/${id}`, data),

  deleteCoupon: (id: string | number): Promise<AxiosResponse> =>
    api.delete(`/admin/coupons/${id}`),
};
