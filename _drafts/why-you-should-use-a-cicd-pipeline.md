---
layout: post
title:  "Title"
author: Thomas
tags: [ aws, c++, containers, dev, javascript, meta, ops, python, ruby, serverless, travel ]
description: TBD
---
A pipeline is more or less just a set of scripts that runs on every change to code
Use webhooks as the trigger to run them
CI: making sure that new code is acceptable to be merged in from a branch
CDelivery: packaging that code to be deployed
CDeployment: automatically deploying
Keeps everything consistent, you know where everything is if it's automatically deployed
Can do this with infra too since it is IaC
Alerting/Feedback in pipeline, auto promotion, blue green deployments, testing (unit, functional, integration)
Git branching scheme
Enabled microservices by keeping changes small and pipelines simple
I have seen over engineering and stuff just starts getting too complicated