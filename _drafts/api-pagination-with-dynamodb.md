---
layout: post
title:  "API Pagination with DynamoDB"
author: Thomas
tags: [ dev, front end, javascript ]
description: TBD
---

- i used golang, but this applies to any language
- first i go over the basic strategy and how it works with the generic DDB API
  - have your api accept limit and nexttoken query parameters
  - have defaults, limit = 20, nexttoken = null or something
  - pass those to the DDB Query or Scan API
  - pull the DDB attribute that is for the last scanned index
  - marshal that index to JSON
  - encode the string with base64
  - return it as the nexttoken
  - whenever the nexttoken is set, do the opposite
  - decode from base64, unmarshal into json, pass it to DDB API
- then go over that code with go
