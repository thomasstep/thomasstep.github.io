---
layout: post
title:  "Why My SQS Free Tier Disappeared"
author: Thomas
tags: [ aws, ops, serverless ]
description: How SQS and Lambda create charges you in the background.
---

Last weekend I was meeting up with some friends from college when I received an unexpected email.

```
Your AWS account xxxxxxxxxxxx has exceeded 85% of the usage limit for one or more AWS Free Tier-eligible services for the month of July.
```

At the time the Budget email was sent I had used 865,062 of 1,000,000 free SQS requests. The first thought that came to my mind was, "I'm glad that I have a budget set up." The second was, "How am I about to exceed 1 million SQS requests?" The third was, "Oh wow did Crow go viral?" Unfortunately, Crow did not go viral.

I have a few queues with Lambda consumers that react to certain events for [Crow Authentication](https://crowauth.com/). I set these up to decrease the amount of synchronous work being done on various API endpoints and therefore decrease the latency an end-user experiences. I have an SNS topic set up that feeds into a few queues from which a few different Lambda functions are invoked.

The way I originally understood this integration, was that SNS broadcasted something, SQS received the event, SQS stored the event until a Lambda could consume it, and then a Lambda would act on the information in the request. Once that email hit my inbox I realized that something must be going on underneath the hood that would explain the huge amount of API being made on my behalf because a quick check of my database told me that Crow did not in fact go viral.

I have heard about the horror stories that never-ending, unfortunate recursion can have on cloud bills. My first stop on this investigation was CloudWatch. I wanted to see the logs coming through the Lambda functions that handled these events. Strangely enough none of them had any execution logs.

Looking through my SQS metrics was the next stop. There was only one metric showing any amount of activity: "Number of Empty Receives". It did not take long to find out that this was [self-inflicted and due to my Lambda integration configuration](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/reducing-costs.html).

While my understanding of the SNS -> SQS -> Lambda function pattern was mostly correct, I missed a key piece that relates directly to the cost: polling. Once a Lambda function is told to consume events from SQS it starts polling that queue. Even though I did not personally set the integration up it existed and it was charging API calls in the background. The reason I love building with serverless is that I only pay for what I use (or what my clients use on my behalf) or so I thought. In this instance, I was being charged despite not seeing any benefit since my product was not being used for those empty receives. The charge makes sense though because AWS's products were being used.

While the usage charges should not have surprised me, they did. Now I know what to be careful of, and I hope that someone else can get a head start by learning from my experience. Even though potential charges might not be clearly outlined in the explicit resource creation, they can still exist in the background.

In the moment of learning about my poor configuration choices, I tore down the CloudFormation stacks that created all of the asynchronous behavior including the SQS queues and Lambdas. For about a day, the applications provisioned in Crow Authentication did not have new sign ups accounted for them. I guess that's my way of compensating users for my infrastructure negligence.

Now I have an improved serverless setup that functions the same way with (hopefully) less cost incurred. Since there were periods of downtime in the queues, I moved away from using SQS and am now consuming the SNS events directly by my Lambdas. The code only needed to slightly change due to the difference in payload from SNS compared to SQS; otherwise, the migration was super simple. I also added Dead Letter Queues to the Lambdas for a little extra durability on the events in case the Lambdas encounter any errors during consumption.

My thought process for handling those asynchronous events is now more in line with my new setup with direct integration between SNS and Lambda. While I like the added durability and scalability provided by SQS, having a Lambda consume the event directly from SNS makes more sense because my async events are not too frequent right now. My goal is to bootstrap, so cost is at the forefront of my mind. Keeping a close reign on expenses is necessary to make sure I can sustain the service and business.

I definitely learned a lesson about serverless billing from this experience, and I am glad that my expenses did not skyrocket like some other instances I have read about online. Even though the charges were bound to be minimal if I had not caught this early on, it can still be scary to get an email from AWS billing out of nowhere. Hopefully, someone out there can learn from my experience as well and understand the underlying interactions happening between SQS and Lambda functions to keep their costs down too.