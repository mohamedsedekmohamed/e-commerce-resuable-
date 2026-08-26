import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from "js-cookie";

const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce.mazoom.online/api/';
const BASE_URL = configuredBaseUrl.endsWith('/') ? configuredBaseUrl : `${configuredBaseUrl}/`;
// ─── Axios Instance ──────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Inject token automatically
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {

    if (typeof window !== "undefined") {
      const requestPath = config.url?.replace(/^\//, '');
      const isAdminRoute = requestPath?.startsWith('admin/');
      const isUserRoute = requestPath?.startsWith('user/');
      
      let token: string | undefined = undefined;
      if (isAdminRoute) {
        token = Cookies.get("admin_token");
      } else if (isUserRoute) {
        token = Cookies.get("user_token");
      } else {
        token = Cookies.get("admin_token") || Cookies.get("user_token");
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  }
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const requestPath = error.config?.url?.replace(/^\//, '');
        const isAdminRoute = requestPath?.startsWith('admin/');

        if (isAdminRoute) {
          Cookies.remove("admin_token");
          Cookies.remove("admin_data");
        } else {
          Cookies.remove("user_token");
          Cookies.remove("user_data");
        }
        
        const pathname = window.location.pathname;
        const firstSegment = pathname.split('/').filter(Boolean)[0];
        const locale = firstSegment === 'ar' || firstSegment === 'en' ? firstSegment : 'en';
        const withLocale = (path: string) => `/${locale}${path}`;

        // Redirect based on current path, but only if they don't have the appropriate token anymore
        if (pathname.includes('/dashboard') && isAdminRoute) {
          window.location.href = withLocale('/auth/admin-login');
        } else if ((pathname.includes('/account') || pathname.includes('/checkout')) && !isAdminRoute) {
          window.location.href = withLocale('/auth/login');
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Common Types ────────────────────────────────────────────────────────────
export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}
export default api;
