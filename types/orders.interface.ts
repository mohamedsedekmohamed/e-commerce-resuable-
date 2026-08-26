import { PaginatedResponse } from './pagination.interface';

export type PaymentStatus = 'pending' | 'approve' | 'reject';
export type PaymentStatusValue = PaymentStatus | 'faild';
export type OrderStatus = 'pending' | 'inprogress' | 'delivered' | 'faild_delivered' | 'return';

export interface OrderSummary {
  id: number;
  price: string;
  discount: string;
  coupon_discount: string;
  final_price: string;
  payment_status: PaymentStatusValue;
  status: OrderStatus;
  user: string | null;
  payment_method: string | null;
  receipt_url: string | null;
}

export interface OrderUser {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  image: string | null;
}

export interface OrderAddress {
  address: string | null;
  floor: string | null;
  street: string | null;
  building_number: string | null;
  additional_data: string | null;
  lat: string | null;
  lng: string | null;
  map: string | null;
  city: string | null;
  zone: string | null;
}

export interface OrderProductOption {
  id: number;
  name: string;
  price: string;
  variation: string;
}

export interface OrderProduct {
  id: number;
  price: string;
  discount: string;
  final_price: string;
  count: number;
  product: {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
  } | null;
  options: OrderProductOption[];
}

export interface OrderPaymentMethod {
  id: number;
  name: string;
  icon: string | null;
}

export interface OrderDetails extends Omit<OrderSummary, 'user' | 'payment_method'> {
  coupon: string | null;
  user: OrderUser | null;
  address: OrderAddress | null;
  payment_method: OrderPaymentMethod | null;
  order_products: OrderProduct[];
}

export type OrdersPaginatedResponse = PaginatedResponse<OrderSummary>;
