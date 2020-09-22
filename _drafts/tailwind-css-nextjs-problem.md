---
layout: post
title:  "NextJs Prerendering Error"
author: Thomas
tags: [ dev, javascript ]
description: Solution to prerendering error in Vercel with Nextjs
---

Tailwind wasn't set up to purge `.jsx` files, only `.js`.
I have picture in `assets/img/`.
purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
