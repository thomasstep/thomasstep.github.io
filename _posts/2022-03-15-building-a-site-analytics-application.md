---
layout: post
title:  "Building a Site Analytics Application"
author: Thomas
tags: [ dev, meta, ops, security, serverless ]
description: Announcing my site analytics software
---

A couple weeks ago an article circulated about [France discovering GDPR breaches by Google Analytics](https://techcrunch.com/2022/02/10/cnil-google-analytics-gdpr-breach/). I was naturally curious since I use Google Analytics for my blog so I started digging deeper to find out what happened and if there is anything I needed to do. Since Google Analytics is based in the US where similar laws to GDPR do not exist, Google was exporting users' data in a way that did not comply with EU laws. The [same findings also came out of Austria](https://techcrunch.com/2022/01/12/austrian-dpa-schrems-ii/) not long before France.

I know that my blog is read in Europe and I know that there are various other general privacy concerns surrounding Google and the use of their products. As a preemptive step and as a courtesy to my readers around the world, I am pledging to shift away from Google Analytics and onto a more privacy focused solution. But I want to add a fun challenge for myself into the mix. I have created [SaaS products](/projects) in the past and there are existing SaaS products in this space so I know that there is demand. My goal is to build this project as open source software that can be completely self-hosted as well. To make it even easier to self-host and more cost-friendly, my site analytics workload will be completely serverless.

Stay tuned for more information. I will update this announcement post with more links as I start bringing everything online, but feel free to reach out in the meantime if you would like to work with me on figuring out the initial features.
