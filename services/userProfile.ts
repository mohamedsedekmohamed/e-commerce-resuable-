import api from './api';
import { AxiosResponse } from 'axios';

export const userProfile = {
  profile: (locale: string = 'en'): Promise<AxiosResponse> =>
    api.get('/user/profile', {
      headers: { 'Accept-Language': locale },
    }),

  updateProfile: (data: FormData, locale: string = 'en'): Promise<AxiosResponse> =>
    api.post('/user/update_profile', data, {
      headers: {
        'Accept-Language': locale,
        'Content-Type': 'multipart/form-data',
      },
    }),
};
