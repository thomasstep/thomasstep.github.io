---
layout: post
title:  "Free Hobby Level Infrastructure for Side Projects"
author: Thomas
tags: [ dev, javascript ]
---
I have experimented with a few free hobby level platforms over the years and I wanted to round them up.
I think that these are useful simply to test out a platform or idea without going overboard on paying for infrastructure.
[Heroku](https://www.heroku.com/pricing) has an excellent platform for going from zero to full running application in a day.
Once you understand how to use Heroku, I think the sky is the limit, and the best part is that they have 100% free options.
I have run a dyno on Heroku for a Discord bot and never paid a dime for it; it just shuts off if I am reaching my monthly hobby level limit.
For my current side project, I am using [Vercel](https://vercel.com/pricing) to host my Nextjs app.
So far I have been blown away by Vercel, and I love that the backend is automatically hosted on serverless functions.
Again, totally free, and they throw in awesome features like HTTPS, custom domain support, CI/CD, the list goes on.
My data layer for my Nextjs app hosted on Vercel is hosted on [MongoDB Atlas](https://www.mongodb.com/pricing).
They offer a free Mongo cluster and it was super easy to connect with my backend through [Mongoose](https://mongoosejs.com/).
I do not think a list about cloud infrastructure would be complete without mentioning the giants: [AWS](https://aws.amazon.com/pricing/), [Azure](https://azure.microsoft.com/en-us/pricing/), and [GCP](https://cloud.google.com/pricing).
While all of the big three have free tiers, I would warn you to be careful.
I have not messed with Azure and GCP enough to incur a hefty charge, but I can say that it is extremely easy to end up with a big AWS bill at the end of the month.
