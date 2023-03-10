---
layout: post
title:  "API Calls with Pagination in React"
author: Thomas
tags: [ dev, front end, javascript ]
description: TBD
---

- simple strategy for reading elements using a paginated API in React
- make initial call
- state contains next token
- `useEffect` that only triggers on next token update
- keep calling and adding info to state as needed until next token is none or length of array you are reading is less than limit
