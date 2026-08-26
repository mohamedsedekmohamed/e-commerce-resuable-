export type StoreEntityId = number | string;

export interface StoreProductOption {
  id: StoreEntityId;
  name: string;
  price?: number | string;
}

export interface StoreProductVariation {
  id: StoreEntityId;
  name: string;
  options: StoreProductOption[];
}

export interface StoreProduct {
  id: StoreEntityId;
  name: string;
  description?: string;
  image?: string;
  price?: number | string;
  final_price?: number | string;
  discount?: number | string;
  pdf?: string | null;
  brand?: string;
  category?: string | { id?: StoreEntityId; name?: string };
  variations?: StoreProductVariation[];
}

export interface StoreGalleryImage {
  id?: StoreEntityId;
  image: string;
}

export interface StoreProductDetails {
  product?: StoreProduct;
  gallery?: StoreGalleryImage[];
}

export interface StoreCategoryImage {
  image_path?: string;
  image?: string;
  url?: string;
}

export interface StoreCategory {
  id: StoreEntityId;
  name: string;
  description?: string;
  image?: string;
  images?: Array<StoreCategoryImage | string>;
  instagram?: string;
}

export interface StorePaginatedResponse<T> {
  data?: T[];
  last_page?: number;
  current_page?: number;
  total?: number;
}

export interface StoreCartItem {
  cart_product_id: StoreEntityId;
  count: number | string;
  product?: Pick<StoreProduct, 'id' | 'name' | 'image' | 'price' | 'final_price'> & {
    is_discounted?: boolean;
  };
  variations?: Array<{
    variation_id: StoreEntityId;
    variation_name?: string;
    selected_option?: { option_name?: string };
  }>;
}

export interface StoreCartResponse {
  cart?: StoreCartItem[];
}

export interface StoreOrderOption {
  id: StoreEntityId;
  variation: string;
  name: string;
}

export interface StoreOrderProduct {
  id: StoreEntityId;
  count: number | string;
  price: number | string;
  final_price: number | string;
  discount?: number | string;
  product?: Pick<StoreProduct, 'id' | 'name' | 'image'>;
  options?: StoreOrderOption[];
}

export interface StoreOrderAddress {
  address?: string;
  city?: string;
  zone?: string;
  street?: string;
  building_number?: string | number;
  floor?: string | number;
  additional_data?: string;
}

export interface StoreOrder {
  id: StoreEntityId;
  created_at?: string;
  price: number | string;
  discount: number | string;
  coupon_discount: number | string;
  final_price: number | string;
  payment_status: string;
  status: string;
  order_products?: StoreOrderProduct[];
  coupon?: { name?: string };
  payment_method?: { name?: string; icon?: string } | null;
  address?: StoreOrderAddress | null;
}

export interface StoreAbout {
  title?: string;
  content?: string;
  image?: string;
}

export interface StoreService {
  id: StoreEntityId;
  name: string;
  description?: string;
  icon?: string;
}

export interface StoreFooterSettings {
  brand_name?: string | Record<string, string | undefined>;
  logo_url?: string;
  logo2_url?: string;
  ios_app?: string;
  android_app?: string;
  address?: string;
  map?: string;
  phone?: string;
  email?: string;
  wattsapp?: string;
  facebook?: string;
  insta?: string;
  tiktok?: string;
}
