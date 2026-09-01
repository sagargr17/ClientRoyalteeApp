export interface VerifyResponse {
  token: string;
  token_type: "customer";
  expires_in: number; // seconds, e.g. 900 for 15 minutes
  customer: {
    id: string | number;
    name: string;
    customer_code: string;
  };
}

export interface Invoice {
  id: string | number;
  invoice_number: string;
  issued_at: string; // ISO date
  amount: number;
  currency?: string;
  status: "paid" | "pending" | "overdue" | string;
  description?: string;
}

export interface Slot {
  id: string | number;
  starts_at: string; // ISO date
  ends_at?: string;
  label?: string;
  capacity?: number;
  spots_left?: number;
  status: "open" | "booked" | "full" | string;
}

export interface TenantItem {
  id: string | number;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  image_url?: string;
  available?: boolean;
}

export interface Customer {
  id: string | number;
  name: string;
  customer_code: string;
}

export interface StoredSession {
  token: string;
  customer: Customer;
  expiresAt: number; // epoch ms
}
