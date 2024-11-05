---
layout: post
title:  "Building Another Slack App"
author: Thomas
tags: [ dev, entrepreneurship, go, javascript, serverless, startup ]
description: TBD
---

As discussed in [building a Slack app](/blog/building-a-slack-app).

- instead of using bolt which doesnt work in aws lambda
- use their web api package, pull out token from query param
- exchange token and then store data
- bolt covers up an extra api call that can also be made to get slightly more information if that is wanted
