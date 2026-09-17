# Stripe checkout — what's built, and the one piece left

The `/buy-now` → `/cart` → `/checkout` flow is complete: the customer picks
meals, fills in their details, and presses pay. Everything up to the card is
done and working.

The card step is Stripe's **hosted Checkout page**, which means no card details
ever touch this site. Getting a customer there needs a *Checkout Session*, and
a session can only be created with the Stripe **secret key**. That key must
never be sent to a browser — anyone with it can issue refunds and read every
customer's details — so the session has to be created by a server.

This site currently builds as a static export for Firebase Hosting
(`firebase.json` → `"public": "out"`), which has no server, and the Angel Food
API has no Stripe endpoint. **That one call is all that's missing.**

Until it exists, `/checkout` says so plainly and pressing pay fails with a
clear message, rather than pretending to take money.

## Address lookup

The delivery form has an address search over OpenStreetMap's Nominatim
(`lib/address-search.ts`), the same geocoder the store locator uses: no API
key, no billing, New Zealand only. It fills the address fields in, and every
one stays editable afterwards.

If a paid address service is ever wanted — Google Places, or NZ Post's AMS for
true delivery-point validation — `searchNzAddresses` is the single function to
swap; nothing else in the checkout knows where suggestions come from.

## Wiring it up

1. Stand up an endpoint that creates a session (see below for three ways).
2. Put its URL in the site's environment:

   ```
   NEXT_PUBLIC_CHECKOUT_API_URL=https://your-endpoint/checkout
   ```

3. Put the Stripe secret key in *that server's* environment — never in this
   repo, and never in a `NEXT_PUBLIC_*` variable, which is compiled into the
   JavaScript every visitor downloads.

That's it. `lib/checkout.ts` posts to the URL and sends the customer to
whatever payment page comes back.

## The contract

`POST` to `NEXT_PUBLIC_CHECKOUT_API_URL`, `Content-Type: application/json`.

**Request**

```jsonc
{
  "currency": "nzd",
  "lines": [
    {
      "code": "CMLC400G",          // product code, to match the catalogue
      "name": "Vege Lasagna",
      "description": "Carton (6 × 400g)",
      "quantity": 2,
      "unitAmount": 4500           // cents — Stripe counts in minor units
    }
  ],
  "deliveryAmount": 2000,          // cents. Flat NZ courier rate, on top
  "customer": {
    "firstName": "", "lastName": "", "email": "", "phone": "", "company": "",
    "address1": "", "address2": "", "suburb": "", "city": "",
    "region": "", "postcode": "", "deliveryNotes": ""
  },
  "successUrl": "https://www.angelfood.co.nz/checkout/success",
  "cancelUrl": "https://www.angelfood.co.nz/checkout?cancelled=1"
}
```

**Response**

```jsonc
{ "url": "https://checkout.stripe.com/c/pay/cs_test_...", "id": "cs_test_..." }
```

Only `url` is required. Anything else — a non-2xx, or a body without a `url` —
surfaces as an error on the checkout page instead of a silent dead end.

## Reference implementation

Node, using the official `stripe` package. The same shape works as a Next.js
route handler, a Firebase Cloud Function, or an ASP.NET controller on the
existing API.

```ts
// app/api/checkout/route.ts — if the site moves to a Node host (e.g. Vercel).
// Note this cannot be part of the Firebase static export build.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const order = await request.json();

  // Never trust prices from the browser: look each code up in the catalogue
  // and price it on the server, or anyone can pay one cent for a carton.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: order.lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: order.currency,
        unit_amount: priceOf(line.code, line.description), // server-side lookup
        product_data: { name: `${line.name} — ${line.description}` },
      },
    })),
    // Freight as its own line, so the customer sees what they were quoted.
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: "New Zealand courier",
          fixed_amount: {
            amount: order.deliveryAmount,
            currency: order.currency,
          },
        },
      },
    ],
    customer_email: order.customer.email,
    // The address was collected on our own form, so it is passed through
    // rather than asked for twice.
    payment_intent_data: {
      shipping: {
        name: `${order.customer.firstName} ${order.customer.lastName}`,
        phone: order.customer.phone,
        address: {
          line1: order.customer.address1,
          line2: [order.customer.address2, order.customer.suburb]
            .filter(Boolean)
            .join(", "),
          city: order.customer.city,
          state: order.customer.region,
          postal_code: order.customer.postcode,
          country: "NZ",
        },
      },
    },
    metadata: {
      company: order.customer.company,
      deliveryNotes: order.customer.deliveryNotes,
    },
    success_url: `${order.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: order.cancelUrl,
  });

  return Response.json({ url: session.url, id: session.id });
}
```

Append `?session_id={CHECKOUT_SESSION_ID}` to the success URL exactly as
above — Stripe substitutes it, and `/checkout/success` shows the last eight
characters back to the customer as their reference.

### Two things to get right

**Price on the server, not from the request.** The `unitAmount` in the request
is what the customer was *shown*; treat it as a display value. A request is
just a browser POST, and anyone can change it before it is sent. Look the code
up server-side and charge that.

**Fulfilment belongs on a webhook, not the success page.** A customer can close
the tab after paying and never load `/checkout/success`. Listen for
`checkout.session.completed` on a Stripe webhook and create the Cin7 sales
order there — `/api/SalesOrders/SendOnlineSalesOrder` on the Angel Food API
takes one, including an `isInCarton` flag and line items.

## How it's priced

Every item costs the same whatever it is; the rate depends only on how many
are in the order. All of it lives in `lib/pricing.ts`:

| Items | Per item | Delivery |
| ----- | -------- | -------- |
| 12–23 | $11.50   | $20.00   |
| 24+   | $10.00   | Free     |

Twelve is the minimum — below it the cart says how many more are needed and
there is no way through to the checkout. A carton of meals is twelve items, so
one carton is exactly the minimum: $138.00 + $20.00 = **$158.00**. Two cartons
is twenty-four: **$240.00**, delivered.

**Price the same way on the server.** `unitAmount` in the request is the rate
the customer was shown, and a request is just a browser POST that anyone can
edit before it is sent. Count the items, look the rate up from the same table,
and charge that — then check `deliveryAmount` against it too.

## Before going live

- Test with Stripe's test keys and card `4242 4242 4242 4242` first.
- The feed says a meal carton holds six. It holds twelve, so `CATALOGUE` in
  `lib/meals.ts` overrides it. Correct `quantityInCartion` in Cin7 and delete
  those `cartonQty` overrides — the feed's own figure takes over.
- Decide what happens for an address the courier can't serve — rural delivery
  and the offshore islands cost more than the $20 average.
