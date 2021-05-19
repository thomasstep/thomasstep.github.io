---
layout: post
title:  "Creating a Whitelist for a Secrets Manager Secret"
author: Thomas
tags: [ aws, ops, security ]
description: TBD
---

A while back, I was attempting to block access to a secret in AWS Secrets Manager to everything except a few IAM roles. It might seem like an easy task but there were some challenges involved. I will include a snippet of a template near the end, but if you would rather jump straight to the template, I added it to my [aws-cloudformation-reference GitHub repo](https://github.com/thomasstep/aws-cloudformation-reference/blob/master/secretsmanager/whitelisted-secret.yml) along with other CloudFormation templates that I have created over time.


