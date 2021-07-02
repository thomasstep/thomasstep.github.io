---
layout: post
title:  "Stripe Webhook Integration with AWS Lambda"
author: Thomas
tags: [ aws, dev, javascript, ops, serverless ]
description: Writing code to handle Stripe Webhooks in a Lambda function
---

I have worked with Stripe for the last month or so and one topic that I stumbled upon that seemed to stump people was handling Stripe webhooks in a Lambda function. I initially stumbled on this issue because I misconfigured my code but it had nothing to do with the API Gateway and Lambda proxy configuration set up. Specifically, I am referencing problems that others came across in [this GitHub issue](https://github.com/stripe/stripe-node/issues/356).

I have my endpoint set up as an API Gateway and Lambda proxy integration. I configured the generated endpoint URL in Stripe and passed my Stripe secret key and webhook secret into my Lambda as environment variables held in Secrets Manager. I tried using the "Test Webhook" events in the Stripe dashboard, but they send dummy customer and price IDs which did not play well with what I needed to accomplish. Either way, I was quickly able to get everything up and running by simply using my test environment to play through the whole integration and onboarding sequence.

Verifying the webhook is easy enough, and thanks to the [stellar documentation](/blog/whoever-does-stripes-technical-writing-deserves-an-award) it's a fun integration to go through. [Here's a link to what I followed from their side](https://stripe.com/docs/webhooks/integration-builder). This was the sticking point for most people in the aforementioned GitHub issue.

There were quite a few mentions about needing to parse a raw body or stringify the request. For me, all I needed to do was pass the `event.body` into the `stripe.webhooks.constructEvent` function. That's it.

After constructing the webhook event, the only thing left to do it parse out the information I needed and then act on it. My need was simply to grab the subscription and price IDs and store them in my database for retrieval by my front end. [This is what that Lambda handler looks like](https://gist.github.com/thomasstep/31f2a5bb394ee05efc9b987606bdadc9).

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
  updateUserSubscription,
  deleteUserSubscription,
} = require('./database');

exports.handler = async function (event, context, callback) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  try {
    const requestId = event?.requestContext?.requestId;
    const sig = event?.headers['Stripe-Signature'];

    const stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
    const eventType = stripeEvent.type ? stripeEvent.type : '';
    // https://stripe.com/docs/api#event_object
    const jsonData = JSON.parse(event.body);

    console.log(`Event Type: ${eventType}`);
    console.log(jsonData);

    const subscriptionId = stripeEvent.data.object.id;
    const customerId = stripeEvent.data.object.customer;
    const priceId = stripeEvent.data.object.plan?.id;

    let customerEmail;
    customerEmail = stripeEvent.data.object['customer_details']?.email;
    if (!customerEmail) {
      const customer = await stripe.customers.retrieve(customerId);
      customerEmail = customer.email;
    }

    switch (eventType) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await updateUserSubscription(
          customerEmail,
          subscriptionId,
          priceId,
        );
        break;
      case 'customer.subscription.deleted':
        await deleteUserSubscription(
          customerEmail,
        );
      default:
        console.log('Unhandled event type');
        console.log(stripeEvent.data.object);
        break;
    }

    const data = {
      statusCode: 200,
      body: JSON.stringify({
        received: true,
      }),
    };
    return data;
  } catch (uncaughtError) {
    console.error(uncaughtError);
    throw uncaughtError;
  }
}
```