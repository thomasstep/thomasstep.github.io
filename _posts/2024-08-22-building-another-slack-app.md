---
layout: post
title:  "Building Another Slack App"
author: Thomas
tags: [ dev, entrepreneurship, go, javascript, serverless, startup ]
description: TBD
---

Two posts ago I wrote about [building a Slack app](/blog/building-a-slack-app). I had a good time building that app out and learning the Slack API, so I have been keeping my eyes peeled for anything else Slack-related that I could work on. It had been a while since I had built anything until I came across something on Reddit that caught my attention. There was a commenter lamenting the amount of Slack channels that they had to keep an eye on. I suffer from the same thing as well and I had thought previously about how I could handle that situation.

For me, the amount of Slack channels I need to monitor is cumbersome especially when I am on-call. Notifications can easily get lost and on some occasions, I need to keep track of channels that are not in my normal channel folders. My idea was to have a way to funnel multiple Slack channels to a single channel. That way I could monitor a single Slack channel and see all of the notifications that I needed.

I discussed the problem and potential solution with a few people I found on Reddit (I know, not the most reliable sources) and figured I would build this app to see how it fares out in the wild. After all, the logic should not be crazy difficult to implement.

Since I have some experience working with Slack I was able to get a working app running pretty quickly. I also figured out a more elegant way to handle OAuth redirects in AWS Lambda, which is [something I had issues with](/blog/building-a-slack-app#distribution) in my first Slack app. It involves manually handling the HTTP request instead of stuffing a bunch of their Bolt logic into another package to serve through the Lambda handler. It's much cleaner and I will write a post specifically about this in the future.

The business logic itself is pretty straightforward. Whenever a message is posted, check if any channels want those messages funneled into them and forward if so. I also got my feet wet with slash commands which allow a user to configure the app in Slack itself instead of using an API or something else. Getting all of the Slack-specific coding done was about half of my time. The other half was the web app side of things.

Slack's Marketplace is not the most developer-friendly place. Paid apps use the Slack Marketplace as basically a listing that points to their website and nothing more. If an app requires payment, then the developer needs to handle that themselves. The Slack Marketplace leads to a web app where users can sign in with via OAuth with Slack and then subscribe to the application. It would have been super convenient if Slack would handle payments and send related webhooks for provisioning like some other popular SaaS marketplaces out there. Alas, I needed to integrate with Stripe on my own. I actually [enjoyed the process](/blog/whoever-does-stripes-technical-writing-deserves-an-award) though and came out with what I believe is my best implementation with Stripe yet.

For this application I took advantage of Stripe subscriptions, [Checkout](https://docs.stripe.com/billing/subscriptions/build-subscriptions?platform=web&ui=stripe-hosted&lang=go#create-session), and [Portal](https://docs.stripe.com/billing/subscriptions/build-subscriptions?platform=web&ui=stripe-hosted&lang=go#create-portal-session). The whole thing was pretty painless on my end and I learned a little bit more about the Stripe ecosystem.

The front end is written using Next.js and hosted by Vercel. I have quite a bit of code written for Next.js at this point, so I was able to reuse a lot of what I have previously done.

And with that, the app was ready for launch. I updated my environment variables to point to Stripe's production environment and redeployed the app. It is [live as of now](https://channel-funnel.thomasstep.com). Feel free to use it and let me know of any feedback. I have extended the free trial to 6 months for the time being. I need 10 active workspace installations before Slack Marketplace will publish my app as an official listing, so I am in a beta phase of sorts. I appreciate any installations!
