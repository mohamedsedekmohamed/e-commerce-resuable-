export interface StoreSettings {
  id: number;
  brand_name: { ar: string | null; en: string | null } | null;
  logo: string | null;
  logo_url: string | null;
  logo2?: string | null;
  logo2_url?: string | null;
  phone: string | null;
  wattsapp: string | null;
  email: string | null;
  address: string | null;
  lat: string | null;
  lng: string | null;
  facebook: string | null;
  insta: string | null;
  tiktok: string | null;
  ios_app: string | null;
  android_app: string | null;
  min_order: number | string | null;
  sign_up_code: number | boolean;
  currency: string | null;
  map?: string | null;
  created_at: string;
  updated_at: string;
}
