import api from './api';
import { CreateAddressPayload, UpdateAddressPayload } from '@/types/address.interface';
import { AxiosResponse } from 'axios';

export const userAddress = {
  index: (local: string, page = 1): Promise<AxiosResponse> => 
    api.get(`/user/addresses?local=${local}&page=${page}`),
  
  cities: (local: string): Promise<AxiosResponse> => 
    api.get(`/user/addresses/cities?local=${local}`),
  
  zones: (local: string, cityId: number | string): Promise<AxiosResponse> => 
    api.get(`/user/addresses/zones?local=${local}&city_id=${cityId}`),
    
  store: (data: CreateAddressPayload): Promise<AxiosResponse> => 
    api.post('/user/addresses', data),
    
  update: (id: string | number, data: UpdateAddressPayload): Promise<AxiosResponse> => 
    api.post(`/user/addresses/${id}`, data),
    
  destroy: (id: string | number): Promise<AxiosResponse> => 
    api.delete(`/user/addresses/${id}`),
};
