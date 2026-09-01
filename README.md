# Customer App

A mobile-first Next.js (App Router) + TypeScript frontend for the **customer**
side of the architecture: scan the printed QR/PIN card, view booking history
(invoices), browse the tenant's posted items, and book open slots.

Design: orange (`ember`) and white, minimalist cards, one signature moment —
the QR/PIN "card" verify screen — with small, purposeful motion elsewhere
(tab indicator, list entrances, button presses, a toast). Bottom tab bar for
mobile, capped at a `max-w-md` column so it also looks intentional on desktop.

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_BASE_URL to the tenant's API
npm run dev
```

Open `http://localhost:3000`. If there's no session yet you'll land on
`/verify`; scanning a real card whose QR encodes
`https://<tenant>/verify/?c=CUST-A1B2C3` will deep-link straight into the PIN
step.

### No backend yet? Use mock mode

Set `NEXT_PUBLIC_MOCK_MODE=true` in `.env.local` and restart `npm run dev`.
Every API call (`lib/api.ts`) then returns fake data from `lib/mock-data.ts`
instead of hitting the network, and the card code on `/verify` is prefilled —
just type any 4-digit PIN to land on `/home` with sample invoices, slots, and
menu items already filled in. Flip it back to `false` (or unset it) once a
real API is available.

> Note: fonts are loaded via `next/font/google` (Space Grotesk, Inter,
> JetBrains Mono), which fetches at build time. If your build environment has
> no general internet access, swap `app/layout.tsx` to `next/font/local` with
> self-hosted font files, or a system font stack.

## How auth works here

This matches steps **C–F** in the architecture diagram:

1. `/verify` reads `?c=` from the URL (native camera app opening the card's
   QR) or lets the customer scan in-app (`html5-qrcode`) or type the code.
2. The customer types the 4-digit PIN printed on the card.
3. `POST /api/pin/verify/ { customer_code, access_pin }` returns a
   short-lived (~15 min) customer JWT, stored in `localStorage` alongside its
   expiry.
4. `lib/auth-context.tsx` counts down that expiry every second, shown as a
   small pill in the header, and auto-logs-out (back to `/verify`) when it
   hits zero — the API's `token_type` boundary (customer vs staff) is
   enforced server-side, this just mirrors the UX for it.

## Pages

| Route        | Purpose                                            | Endpoint(s)                          |
|--------------|-----------------------------------------------------|---------------------------------------|
| `/verify`    | Scan/enter card code + PIN                          | `POST /api/pin/verify/`               |
| `/home`      | Dashboard: next booking, quick links, recent activity | `GET /api/my-invoices/`, `GET /api/slots/available/` |
| `/slots`     | Browse & book open slots                            | `GET /api/slots/available/`, `POST /api/slots/{id}/book/` |
| `/items`     | Browse items/menu posted by the tenant              | `GET /api/items/` *(add this endpoint — not in the original diagram, but referenced here as the tenant's catalog)* |
| `/invoices`  | Full booking/purchase history                       | `GET /api/my-invoices/`               |
| `/profile`   | Card identity, session countdown, end session       | —                                     |

## Structure

```
app/                route segments (App Router)
components/         presentational + interactive UI pieces
lib/api.ts          fetch wrapper + typed API calls
lib/auth-context.tsx  customer session state (localStorage + countdown)
lib/types.ts         shared API/domain types
lib/format.ts         money/date/countdown formatting
```

## Notes / things to wire up for production

- `GET /api/items/` is an assumption for "items posted by tenant" — adjust
  the path/shape in `lib/api.ts` and `lib/types.ts` to match your actual
  catalog endpoint.
- No refresh-token flow is implemented, matching the diagram's short-lived,
  re-scan-to-renew customer JWT design; if that changes server-side, extend
  `auth-context.tsx`.
- Camera scanning requires HTTPS (or `localhost`) per browser
  `getUserMedia` rules.
