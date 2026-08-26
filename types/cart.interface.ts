import { StoreEntityId, StoreProduct } from './store.interface';

export interface AddToCartPayload {
  local: string;
  product_id: StoreEntityId;
  count: number;
  options?: StoreEntityId[];
  variations?: StoreEntityId[];
}

export interface UpdateCartItemPayload {
  local: string;
  count: number;
}

export interface UserCartItem {
  // The cart endpoint identifies an item with cart_product_id. Some responses
  // do not include a separate id field.
  id?: StoreEntityId;
  cart_product_id: StoreEntityId;
  count: number;
  product?: StoreProduct;
  variations?: Array<{
    variation_id: StoreEntityId;
    variation_name?: string;
    selected_option?: { option_name?: string };
  }>;
}

export interface UserCartResponse {
  cart?: UserCartItem[];
  total?: number | string;
}
