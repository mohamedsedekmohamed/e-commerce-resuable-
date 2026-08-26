import api from './api';
import { AxiosResponse } from 'axios';

export const userHome = {
  getFooter: (locale: string): Promise<AxiosResponse> =>
    api.get('/user/footer', {
      params: { local: locale },
    }),
  allProducts: (locale: string, page: number = 1): Promise<AxiosResponse> =>
    api.get('/user/home/all_products', {
      params: { local: locale, page },
    }),

  getPartners: (locale: string): Promise<AxiosResponse> =>
    api.get('/user/partners', {
      params: { local: locale },
    }),

  getBanners: (locale: string): Promise<AxiosResponse> =>
    api.get('/user/home/banners', {
      params: { local: locale },
    }),




  parentCategories: (locale: string, page: number = 1): Promise<AxiosResponse> =>
    api.get('/user/home/parent-categories', {
      params: { local: locale, page },
    }),

  subCategories: (locale: string, category_id: number, page: number = 1): Promise<AxiosResponse> =>
    api.get('/user/home/sub-categories', {
      params: { local: locale, category_id, page },
    }),

  products: (locale: string, category_id: number, page: number = 1): Promise<AxiosResponse> =>
    api.get('/user/home/products', {
      params: { local: locale, category_id, page },
    }),

  productDetails: (locale: string, id: string | number): Promise<AxiosResponse> =>
    api.get(`/user/home/product/${id}`, {
      params: { local: locale },
    }),
};
