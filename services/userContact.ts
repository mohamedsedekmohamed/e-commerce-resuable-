import api from './api';
import { AxiosResponse } from 'axios';

export const contactuser = {
    postcontact: (data: unknown): Promise<AxiosResponse> => api.post('/user/contact', data),


};
