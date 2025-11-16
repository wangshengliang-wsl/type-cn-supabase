import * as crypto from "crypto";

function generateSignature(payload, secret) {
  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return computedSignature;
}

// creem checkout.completed request body
const payload = {
  "id": "evt_6FnbeZTGCNT8sEDEMDgekT",
  "eventType": "checkout.completed",
  "created_at": 1763303092018,
  "object": {
    "id": "ch_4LFKfGOW1ROZYiEbz9RBXE",
    "object": "checkout",
    "order": {
      "object": "order",
      "id": "ord_4TZ7Oboe9Y1tKmHIE4SF2M",
      "customer": "cust_4d7uKgCk3vpEch1pcG7tht",
      "product": "prod_2z33UasJaSLnNkAXtli3ka",
      "amount": 1000,
      "currency": "USD",
      "sub_total": 1000,
      "tax_amount": 0,
      "amount_due": 1000,
      "amount_paid": 1000,
      "status": "paid",
      "type": "recurring",
      "transaction": "tran_4Dd0ll6TvSKCCm8I3aV1CC",
      "created_at": "2025-11-16T14:23:34.345Z",
      "updated_at": "2025-11-16T14:23:34.345Z",
      "mode": "test"
    },
    "product": {
      "id": "prod_2z33UasJaSLnNkAXtli3ka",
      "object": "product",
      "name": "pro",
      "description": "vip pro test",
      "image_url": "https://nucn5fajkcc6sgrd.public.blob.vercel-storage.com/lou-ll-maids-christmas-2021-22-small-KGmBqFtjmPdTxX4klAwAbfKqlEIuUM.jpg",
      "price": 1000,
      "currency": "USD",
      "billing_type": "recurring",
      "billing_period": "every-month",
      "status": "active",
      "tax_mode": "exclusive",
      "tax_category": "saas",
      "default_success_url": "http://localhost:3000/payment/success",
      "created_at": "2025-11-16T12:28:54.972Z",
      "updated_at": "2025-11-16T12:28:54.972Z",
      "mode": "test"
    },
    "units": 1,
    "success_url": "http://localhost:3000/payment/success",
    "customer": {
      "id": "cust_4d7uKgCk3vpEch1pcG7tht",
      "object": "customer",
      "email": "wsl1710642275@gmail.com",
      "name": "王声亮",
      "country": "CN",
      "created_at": "2025-11-16T03:21:05.309Z",
      "updated_at": "2025-11-16T03:21:05.309Z",
      "mode": "test"
    },
    "subscription": {
      "id": "sub_2dIOBEFgWSp8sMpzh8J1tN",
      "object": "subscription",
      "product": "prod_2z33UasJaSLnNkAXtli3ka",
      "customer": "cust_4d7uKgCk3vpEch1pcG7tht",
      "collection_method": "charge_automatically",
      "status": "active",
      "current_period_start_date": "2025-11-16T14:24:33.000Z",
      "current_period_end_date": "2025-12-16T14:24:33.000Z",
      "canceled_at": null,
      "created_at": "2025-11-16T14:24:37.606Z",
      "updated_at": "2025-11-16T14:24:41.329Z",
      "metadata": {
        "userId": "0e741669-a909-4126-95ba-4a5d49f9402d",
        "productId": "prod_2z33UasJaSLnNkAXtli3ka"
      },
      "mode": "test"
    },
    "status": "completed",
    "metadata": {
      "userId": "0e741669-a909-4126-95ba-4a5d49f9402d",
      "productId": "prod_2z33UasJaSLnNkAXtli3ka"
    },
    "mode": "test"
  }
}
// webhook secret
const secret = "whsec_7IOeKWaLhyLLn12mlrjZlB";
const payloadString = JSON.stringify(payload, null, 2);

// console.log(payloadString);

const response = generateSignature(payloadString, secret);

console.log(response);
