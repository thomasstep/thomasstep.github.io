---
layout: post
title:  "Free Hobby Level Infrastructure for Side Projects"
author: Thomas
tags: [ infrastructure ]
description: Cloud providers with free tier or low cost options
---
I have experimented with a few free hobby level platforms over the years and I wanted to round them up. I think that these are useful simply to test out a platform or idea without going overboard on paying for infrastructure.

[Heroku](https://www.heroku.com/pricing) has an excellent platform for going from zero to full running application in a day. Once you understand how to use Heroku, I think the sky is the limit, and the best part is that they have 100% free options. I have run a dyno on Heroku for a Discord bot and never paid a dime for it; it just shuts off if I am reaching my monthly hobby level limit.

For my current side project, I am using [Vercel](https://vercel.com/pricing) to host my Nextjs app. So far I have been blown away by Vercel, and I love that the API endpoints are hosted on serverless functions. Again, totally free, and they throw in awesome features like HTTPS, custom domain support, CI/CD, the list goes on.

My data layer for my Nextjs app hosted on Vercel is hosted on [MongoDB Atlas](https://www.mongodb.com/pricing). They offer a free Mongo cluster and it was super easy to connect with my backend through [Mongoose](https://mongoosejs.com/).

I do not think a list about cloud infrastructure would be complete without mentioning the giants: [AWS](https://aws.amazon.com/pricing/), [Azure](https://azure.microsoft.com/en-us/pricing/), and [GCP](https://cloud.google.com/pricing). While all of the big three have free tiers, I would warn you to be careful. I have not messed with Azure and GCP enough to incur a hefty charge, but I can say that it is extremely easy to end up with a big AWS bill at the end of the month.

There are tons of other cloud providers with their own set of features and specialties that I have not personally played with before but wanted to mention. [IBM Cloud](https://www.ibm.com/cloud/free) has an assortment of free tier services, and it looks like there is a way to setup a "Lite account", which only allows you to use free tier services. I actually like this approach since it seems like they want to give users a way to not feel paranoid about racking up a charge unintentionally. [DigitalOcean](https://www.digitalocean.com/pricing/) has been a player in cloud services for a while and I have heard good things about them and their support from friends who have used them. The only difference that I can see is that they do not offer a free tier; however, their services are affordable with the lowest computing tier at $5 per month. [Linode](https://www.linode.com/pricing/) is similar to DigitalOcean in their pricing scheme, which means that they do not have a free tier. Unfortunately, these last two cloud providers are not free, but I think that the prices are low enough and they both offer Kubernetes hosting on the cheap.
