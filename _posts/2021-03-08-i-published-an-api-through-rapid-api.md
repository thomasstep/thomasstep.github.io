---
layout: post
title:  "I Published an API Through RapidAPI"
author: Thomas
tags: [ aws, dev, javascript, meta, ops ]
description: Selling an API on RapidAPI
---

Edit: I have since published more APIs through RapidAPI. The latest is my [calendar API](/blog/calendar-api-architecture).

A while back I read something about a platform called RapidAPI. It's a marketplace for APIs. I had never heard about it before, but as a backend developer, I was curious to know more. I starting digging deeper and found out that it offers a single point of access to various APIs that developers can publish. It functions as a router of sorts, where all requests go through RapidAPI using their keys and RapidAPI passes the request through to the configured endpoint. I also realized that there was no sign up fee or anything for developers to publish their APIs. Of course, I had to try it out and publish something.

I took a little while to finally come up with an idea that I thought would actually be somewhat useful. I wanted to take a common utility and create an API out of it. Just a microservice that anyone in the world can access. I went with randomly generated strings and ids. I fiddled around with some code, created a template to deploy it with AWS, and tested everything out. I used something similar to [the serverless API CloudFormation template](https://thomasstep.dev/blog/cloudformation-for-serverless-api-development) that I have posted about on this site before. I added some extra settings, API paths, an API key, and Lambda functions to support the different paths that I wanted my API to have. After I verified that it was up and running and functioning as expected, I went over to RapidAPI to integrate everything. The setup process was straightforward and involved only a few steps. After about an hour of configuration, my API was live and ready to use. Feel free to check it out at [https://rapidapi.com/tstep916/api/random-strings](https://rapidapi.com/tstep916/api/random-strings). There are sample snippets of code to help integrate quickly on the site, but it's also possible to quickly hit the API with a curl command.
```bash
curl -H "x-rapidapi-key: $YOUR_RAPIDAPI_KEY" -H "x-rapidapi-host: random-strings.p.rapidapi.com" https://random-strings.p.rapidapi.com/v1/uuid
```

Overall, I had a positive experience publishing through RapidAPI. The onboarding was quick and easy, and so far I have been able to track the uptime of my API easily. I have ideas for other APIs that I want to publish in the future, and I am excited to continue working with RapidAPI.