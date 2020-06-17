---
layout: post
title:  "Creating Your Own Canary For An API"
author: Thomas
tags: [ aws ]
description: Creating a bootlegged version of AWS Synthetics Canary
redirect_from:
  - /aws/2020/05/20/cloudformation-for-creating-canary.html
---
A while ago I was looking into using [AWS Synthetics to create a canary](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Create.html) to measure/track uptime of an API and make sure that I was one of the first people to notice if it was down.
It is fairly easy to setup a canary and it worked as expected.

However, there were a few downfalls that I can see with Synthetics Canaries.
The first, which will probably be resolved by AWS soon, is that there is no CloudFormation, SDK, or CDK support for this service yet.
The second is the cost of canaries.
As of me writing this, [the cost of a single canary run is $0.0012](https://aws.amazon.com/cloudwatch/pricing/) (at least in most of the United States' regions).
The canary that I ran triggered once every 5 minutes, which means 8760 times per month.
That single canary would have cost me $10.512 per month.
I am by no means trying to make people avoid using this service, but if cost is a main concern, I think that there is a much cheaper alternative that you can create fairly easily.

The solution that I am currently using is more or less just a dumbed down canary; it pings my API once every 5 minutes from a lambda function that is triggered by a CloudWatch Event Rule.
Using the same 8760 runs per month, a CloudWatch Rule would cost $0.00876 per month ([calculated using cost of $1.00 per million events](https://aws.amazon.com/cloudwatch/pricing/)) and a [lambda would cost $0.02 per month not including Free Tier](https://s3.amazonaws.com/lambda-tools/pricing-calculator.html).
Also take all of the pricing with a grain of salt; I am still learning all of the pricing for AWS and I have heard that it is never a completely straightforward calculation, but I am trying to reference AWS pricing pages.
If the pricings that I have found are all correct, Synthetics would cost about 365 times more than this bootlegged canary using CloudWatch Events and a lambda function.

I have put together a template that builds all of the infrastructure I just mentioned, [which can be found here](https://github.com/thomasstep/starterTemplates/blob/master/canary.yml).
The code that goes into the lambda is ultimately up to you, but I also wrote a small script that was meant to go with this template, [which can be found here](https://github.com/thomasstep/starterTemplates/blob/master/canary.js).
The general idea is that the lambda should make a request to the API you want to monitor and then either log an error or success.
I suggest using CloudWatch Insights or just the logs to monitor what is happening over time, and you can also set up CloudWatch Alarms for this.
I have these logs going to a dashboard that graphs the uptime over time.
Having all of this being built through templates also means that you can add, remove, or update this infrastructure through a pipeline.
Until Synthetics becomes available as IaC and drops its pricing, this will probably be the alternative that I use.
