import api from './api';
import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  image: string | null;
  role: string;
  phone: string;
  order_count: number;
  order_sum: number;
  created_at: string | null;
  updated_at: string | null;
  image_url: string | null;
}

export interface LoginResponse {
  user: AuthUser | null;
  token: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface SignUpResponse {
  success: boolean;
  sign_up_code: number | boolean;
  user?: AuthUser;
  token?: string | null;
}

export interface CheckCodePayload {
  email: string;
  code: string;
}

export interface ForgetPasswordPayload {
  email: string;
}

export interface CheckCodeForgetPasswordPayload {
  email: string;
  code: string;
}

export interface NewPasswordForgetPasswordPayload {
  email: string;
  code: string;
  new_password: string;
}

export const authService = {
  login: (data: LoginPayload): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/login', data),

  signUp: (data: SignUpPayload): Promise<AxiosResponse<SignUpResponse>> =>
    api.post('/sign_up', data),

  checkCode: (data: CheckCodePayload): Promise<AxiosResponse<any>> =>
    api.post('/check_code', data),

  forgetPassword: (data: ForgetPasswordPayload): Promise<AxiosResponse<any>> =>
    api.post('/forget_password', data),

  checkCodeForgetPassword: (data: CheckCodeForgetPasswordPayload): Promise<AxiosResponse<any>> =>
    api.post('/check_code_forget_password', data),

  newPasswordForgetPassword: (data: NewPasswordForgetPasswordPayload): Promise<AxiosResponse<any>> =>
    api.post('/new_password_forget_password', data),

  logout: (): Promise<AxiosResponse> =>
    api.post('/logout'),

  saveSession: (token: string, role: string, user?: AuthUser) => {
    // Clear previous sessions to ensure we are not both admin and user
    Cookies.remove('admin_token');
    Cookies.remove('user_token');
    Cookies.remove('user_data');
    Cookies.remove('admin_data');

    // For development, don't require secure flag
    const isProduction = process.env.NODE_ENV === 'production';
    
    const cookieOptions = { 
      expires: 7, 
      secure: isProduction, 
      sameSite: 'Strict' as const,
      path: '/'
    };
    
    if (role === 'admin' || role === 'super_admin') {
      Cookies.set('admin_token', token, cookieOptions);
      if (user) {
        Cookies.set('admin_data', JSON.stringify(user), cookieOptions);
      }
    } else {
      Cookies.set('user_token', token, cookieOptions);
      if (user) {
        Cookies.set('user_data', JSON.stringify(user), cookieOptions);
      }
    }
  },

  clearSession: () => {
    Cookies.remove('admin_token');
    Cookies.remove('user_token');
    Cookies.remove('user_data');
    Cookies.remove('admin_data');
  },

  getToken: (type?: 'admin' | 'user'): string | undefined => {
    if (type === 'admin') return Cookies.get('admin_token');
    if (type === 'user') return Cookies.get('user_token');
    return Cookies.get('admin_token') || Cookies.get('user_token');
  },
    
  getUser: (type?: 'admin' | 'user'): AuthUser | null => {
    let data;
    if (type === 'admin') {
      data = Cookies.get('admin_data');
    } else if (type === 'user') {
      data = Cookies.get('user_data');
    } else {
      data = Cookies.get('user_data') || Cookies.get('admin_data');
    }

    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },
};
