---
layout: post
title:  "Quick Stripe Guide for SaaS"
author: Thomas
tags: [ dev, entrepreneurship, startup ]
description: Setting forth a quick start guide for integrating with Stripe
---

I recently discovered a combination of services in Stripe that is a super quick and easy way to get things up and running for a SaaS. There is minimal coding on your side to get things working, and you can probably get around handling PII or any subscription modification actions. There are a few things to keep in mind when it comes to your data model, but other than that, Stripe will handle all of the money-related inner workings.

Let's start with the data model that I mentioned. There are two important pieces of information that we will need to keep track of; the user's ID and the Stripe Customer ID. The user ID should be pretty stock standard. I would hope that this piece of data is already stored in a database somewhere and easily accessible. The Stripe Customer ID will also need a place in your database schema and will need to be linked to the user's ID somehow. I'll explain how we connect those two dots in a minute.

The first of the Stripe services that are part of this combination is [Stripe Checkout Session](https://docs.stripe.com/billing/subscriptions/build-subscriptions?platform=web&ui=stripe-hosted&lang=go#create-session). A Checkout Session is a hosted portal that handles accepting a user's payment and processing it. The developer gets to define what is being paid for and how much needs to be paid in an API call to Stripe, and then Stripe gives us back a URL for the hosted portal. We redirect our user to the Checkout Session URL. After the user completes payment Stripe redirects the user back to a preconfigured URL, which is most likely back to our SaaS site. Here is a code snippet of some of the parameters in action that I used in a recent project.

```go
params := &stripe.CheckoutSessionParams{
  Mode: stripe.String(string(stripe.CheckoutSessionModeSubscription)),
  LineItems: []*stripe.CheckoutSessionLineItemParams{
 &stripe.CheckoutSessionLineItemParams{
      Price:    stripe.String(config.PriceId),
      Quantity: stripe.Int64(1),
 },
 },
  SuccessURL: stripe.String(config.successUrl),
  CancelURL:  stripe.String(config.cancelUrl),
  Metadata: map[string]string{
    "userId": userId,
 },
  SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
    TrialPeriodDays = stripe.Int64(int64(30)),
    TrialSettings = &stripe.CheckoutSessionSubscriptionDataTrialSettingsParams{
      EndBehavior: &stripe.CheckoutSessionSubscriptionDataTrialSettingsEndBehaviorParams{
        MissingPaymentMethod: stripe.String(string(stripe.SubscriptionTrialSettingsEndBehaviorMissingPaymentMethodPause)),
 },
 },
    // We want metadata on the subscription object itself too
    Metadata: map[string]string{
      "userId": userId,
 },
 },
}
```

There are a few things that I want to point out in the snippet that might not be easy to understand at first.

The `Price` uses `config.PriceId` as its value, which is something that I manually set up in the Stripe console. I then took the ID of the created price and passed it to my app. You can instead automate this process, but I took the single manual step to make things easier.

The `SuccessURL` and `CancelURL` are redirect URLs for different cases of the user exiting the Checkout Session portal.

The `Metadata` is a very important piece. This is what connects your user ID to a Stripe customer. After payment is processed, you can configure Stripe to send you a webhook. Creating a Checkout Session in this way (without a `Customer` parameter) means that Stripe will create a new Customer object for you automatically. The webhook you receive will contain the relevant Stripe Customer information including the new Stripe Customer ID and the `Metadata` that we include here. We can then link the Stripe Customer ID in our database to the user ID because we will have both pieces of information as part of the webhook payload.

I glossed over a lot of the Stripe webhook setup in that last paragraph, so let's fill that information in. Using Stripe comes with the option to receive tons of different events as webhooks. For more information about setting up a webhook endpoint, [please read here](https://docs.stripe.com/webhooks). Discussing webhook endpoints is out of the scope of this post. After your webhook endpoint is set, you should be configuring Stripe to send you the [`checkout.session.completed` webhook event](https://docs.stripe.com/api/events/types#event_types-checkout.session.completed). There might also be other webhook event types that you will need to configure for your application.

Now, we have a Stripe Customer ID that is linked to our internal user ID and is on an active subscription. But what if they need to update their subscription? I certainly don't want to write all the logic and create all the pages to help them handle that information. In comes the second Stripe service to aid us in this setup: [Stripe Billing Portal](https://docs.stripe.com/billing/subscriptions/build-subscriptions?platform=web&ui=stripe-hosted&lang=go#create-portal-session). This is another hosted portal that Stripe offers to handle any billing updates that a user might have like updating an address, updating payment information, or canceling a subscription. Here is another code snippet of some of the parameters in action that I used in a recent project.

```go
params := &stripe.BillingPortalSessionParams{
  Customer:  stripe.String(customerId),
  ReturnURL: stripe.String(config.returnUrl),
}
```

Setting up a Billing Portal is much easier. Here we can see why we needed to save the Stripe Customer ID though. Stripe needs that ID to properly generate the portal on their side with the customer's information. And the whole thing is opaque to us. We do not need to store any of the customer's/user's PII.

I tie these two things together by having an endpoint in my backend that is capable of creating both the Checkout Session and the Billing Portal. Whenever my frontend hits that endpoint, the backend checks whether or not the user already has a Stripe Customer ID attached to it. If there is an existing Stripe Customer ID, then I create a Billing Portal Session and send the URL back to the front end. If the user is not an existing Stripe Customer, then I create a Checkout Session and send the URL back to the frontend. The front end can tell which type of session URL is being shown and redirects or shows a button accordingly.

And just like that, you can have subscriptions set up for a SaaS. Stripe continues to impress me. The developer experience is one of the best that I have ever come across. I hope this has helped you get Stripe set up with your SaaS. Feel free to reach out if you have any questions.
