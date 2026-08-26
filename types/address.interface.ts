export interface AddressEntity {
  id: number | string;
  address?: string | null;
  lat?: string | null;
  lng?: string | null;
  floor?: string | null;
  street?: string | null;
  building_number?: string | null;
  city_id?: number | null;
  zone_id?: number | null;
  additional_data?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  map?: string;
}

export interface CreateAddressPayload {
  address?: string | null;
  lat: string;
  lng: string;
  floor: string;
  street: string;
  building_number?: string | null;
  city_id: number | string;
  zone_id: number | string;
  additional_data?: string | null;
}

export interface UpdateAddressPayload extends Partial<CreateAddressPayload> {}
