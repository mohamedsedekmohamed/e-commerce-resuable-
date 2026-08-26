import api from './api';
import { AxiosResponse } from 'axios';
import { OrderDetails, OrdersPaginatedResponse, OrderStatus, PaymentStatus } from '@/types/orders.interface';

export const ordersAdmin = {
  getOrders: (
    locale: string,
    params?: { page?: number; status?: string; payment_status?: string }
  ): Promise<AxiosResponse<OrdersPaginatedResponse>> =>
    api.get('/admin/orders', {
      params: { ...params, local: locale },
    }),

  getOrder: (id: string | number, locale: string): Promise<AxiosResponse<OrderDetails>> =>
    api.get(`/admin/orders/${id}`, {
      params: { local: locale },
    }),

  changePaymentStatus: (id: string | number, payment_status: PaymentStatus): Promise<AxiosResponse> =>
    api.post(`/admin/orders/${id}/payment-status`, { payment_status }),

  changeOrderStatus: (id: string | number, status: OrderStatus): Promise<AxiosResponse> =>
    api.post(`/admin/orders/${id}/status`, { status }),
};
