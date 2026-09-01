import type { Customer, Invoice, Slot, TenantItem, StoredSession } from "./types";

export const MOCK_CUSTOMER: Customer = {
  id: 1,
  name: "Alex Rivera",
  customer_code: "CUST-A1B2C3",
};

/** Fake logged-in session — far-future expiry so it won't kick you back to /verify */
export const MOCK_SESSION: StoredSession = {
  // token: "mock-token",
  // customer: MOCK_CUSTOMER,
  // expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24h out
  token: "mock-token",
  customer: {
    id: 1,
    name: "Alex Rivera",
    customer_code: "CUST-A1B2C3",
  },
  expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24h out

};

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 1042,
    invoice_number: "INV-1042",
    issued_at: "2026-08-28T18:00:00Z",
    amount: 42.5,
    currency: "USD",
    status: "pending",
    description: "Dinner for two",
  },
  {
    id: 1038,
    invoice_number: "INV-1038",
    issued_at: "2026-08-14T12:00:00Z",
    amount: 18.0,
    currency: "USD",
    status: "paid",
    description: "Lunch",
  },
  {
    id: 1021,
    invoice_number: "INV-1021",
    issued_at: "2026-07-30T19:30:00Z",
    amount: 65.0,
    currency: "USD",
    status: "paid",
  },
];

export const MOCK_SLOTS: Slot[] = [
  {
    id: "slot-1",
    label: "Window seat, dinner",
    starts_at: "2026-09-03T19:30:00Z",
    status: "booked",
  },
  {
    id: "slot-2",
    label: "Lunch, patio",
    starts_at: "2026-09-04T12:00:00Z",
    spots_left: 3,
    status: "open",
  },
  {
    id: "slot-3",
    label: "Dinner, bar seating",
    starts_at: "2026-09-04T20:00:00Z",
    spots_left: 0,
    status: "full",
  },
  {
    id: "slot-4",
    label: "Brunch",
    starts_at: "2026-09-06T10:00:00Z",
    spots_left: 5,
    status: "open",
  },
];

export const MOCK_ITEMS: TenantItem[] = [
  {
    id: "item-1",
    name: "Grilled salmon",
    description: "Cedar-plank salmon with roasted vegetables",
    price: 24,
    currency: "USD",
    category: "Mains",
    available: true,
  },
  {
    id: "item-2",
    name: "Margherita pizza",
    description: "San Marzano tomato, fresh mozzarella, basil",
    price: 16,
    currency: "USD",
    category: "Mains",
    available: true,
  },
  {
    id: "item-3",
    name: "Caesar salad",
    description: "Romaine, parmesan, house-made croutons",
    price: 12,
    currency: "USD",
    category: "Starters",
    available: true,
  },
  {
    id: "item-4",
    name: "Tiramisu",
    description: "Espresso-soaked ladyfingers, mascarpone",
    price: 9,
    currency: "USD",
    category: "Desserts",
    available: false,
  },
];
