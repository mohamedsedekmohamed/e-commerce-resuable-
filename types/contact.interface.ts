import { PaginatedResponse } from './pagination.interface';

export interface ContactMessage {
  id: number;
  f_name: string;
  l_name: string;
  phone: string;
  email: string;
  title: string;
  content: string;
  /** 0 means unread; read messages are returned by the history endpoint. */
  status: 0 | 1 | boolean;
  created_at: string;
  updated_at: string;
}

/** The contact endpoints wrap Laravel pagination in a top-level `data` object. */
export interface ContactPaginatedResponse {
  data: PaginatedResponse<ContactMessage>;
}
