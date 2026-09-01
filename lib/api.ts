import type { Invoice, Slot, TenantItem, VerifyResponse } from "./types";
import {
  MOCK_CUSTOMER,
  MOCK_INVOICES,
  MOCK_ITEMS,
  MOCK_SLOTS,
} from "./mock-data";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

/** Set NEXT_PUBLIC_MOCK_MODE=true in .env.local to browse the UI with fake
 * data instead of a real backend — no server required. */
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body?.detail || body?.message || message;
    } catch {
      // ignore body parse errors
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Step E: exchange a customer_code + access_pin from the physical card for a 15-min JWT */
export function verifyPin(customerCode: string, accessPin: string) {
  if (MOCK_MODE) {
    if (accessPin.length !== 4) {
      return Promise.reject(new ApiError("PIN must be 4 digits", 400));
    }
    return delay<VerifyResponse>({
      token: "mock-token",
      token_type: "customer",
      expires_in: 900,
      customer: { ...MOCK_CUSTOMER, customer_code: customerCode || MOCK_CUSTOMER.customer_code },
    });
  }
  return request<VerifyResponse>("/api/pin/verify/", {
    method: "POST",
    body: JSON.stringify({ customer_code: customerCode, access_pin: accessPin }),
  });
}

export function getMyInvoices(token: string) {
  if (MOCK_MODE) return delay(MOCK_INVOICES);
  return request<Invoice[]>("/api/my-invoices/", { token });
}

export function getAvailableSlots(token: string) {
  if (MOCK_MODE) return delay(MOCK_SLOTS);
  return request<Slot[]>("/api/slots/available/", { token });
}

export function bookSlot(token: string, slotId: string | number) {
  if (MOCK_MODE) {
    const slot = MOCK_SLOTS.find((s) => s.id === slotId);
    return delay<Slot>({ ...(slot as Slot), status: "booked" });
  }
  return request<Slot>(`/api/slots/${slotId}/book/`, {
    method: "POST",
    token,
  });
}

/** Catalog of items the tenant has posted, visible to the customer */
export function getTenantItems(token: string) {
  if (MOCK_MODE) return delay(MOCK_ITEMS);
  return request<TenantItem[]>("/api/items/", { token });
}
