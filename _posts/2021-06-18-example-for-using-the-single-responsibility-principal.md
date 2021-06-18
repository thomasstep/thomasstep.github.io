---
layout: post
title:  "Example for Using the Single Responsibility Principle"
author: Thomas
tags: [ databases, dev ]
description: Personal example of the Single Responsibility Principle in action
---

I just recently change the way that [Crow Authentication](https://crowauth.com) stored user information. My data model did not completely suit a new use case that I was looking into implementing. On top of that, I realized that the way I modeled my data did not make total sense, so I wanted to change what I had hastily thrown together into a more elegant solution.

Luckily, I had written my code better than I modeled my data and all of my database operations were completely abstracted away from my business logic. Instead of needing to track down and change every location that I asked the database for anything, I only had to change one function that handled how I assembled my commands to DynamoDB. The business logic continued to call the same abstracted database functions and those functions still returned the same data that the business logic expected. The difference was in the way the data layer stored the information. No further code needing to change, but the way I modeled my data completely changed. Cool.

I always like to have examples and use cases to back up a popular saying or principle. When I needed to change how I stored information in my data layer and it only took me a few lines of code, I knew I had to write it down for myself in the future. This is one occurrence where something I designed needed to be changed based on a new use case and the way I designed and wrote the code made my life so much easier.
