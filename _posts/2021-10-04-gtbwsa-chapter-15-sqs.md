---
layout: post
title:  "GTBWSA Chapter 15: SQS"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS SQS is and how to use it
date: 2021-10-04 09:00:15 # this is used to properly sort the chapters
---

This is a chapter from the Guide To Building With Serverless AWS that I wrote. For more information about the guide's intent and focuses, please read the Introduction Chapter.

Table of Contents:

1. [Introduction](/blog/gtbwsa-chapter-1-introduction)
2. [Serverless Introduction](/blog/gtbwsa-chapter-2-serverless-introduction)
3. [Introduction to the Cloud and AWS](/blog/gtbwsa-chapter-3-introduction-to-the-cloud-and-aws)
4. [Infrastructure as Code](/blog/gtbwsa-chapter-4-infrastructure-as-code)
5. [IAM](/blog/gtbwsa-chapter-5-iam)
6. [VPC](/blog/gtbwsa-chapter-6-vpc)
7. [Lambda](/blog/gtbwsa-chapter-7-lambda)
8. [API Gateway](/blog/gtbwsa-chapter-8-api-gateway)
9. [DynamoDB](/blog/gtbwsa-chapter-9-dynamodb)
10. [S3](/blog/gtbwsa-chapter-10-s3)
11. [CloudWatch](/blog/gtbwsa-chapter-11-cloudwatch)
12. [CloudFront](/blog/gtbwsa-chapter-12-cloudfront)
13. [Route 53](/blog/gtbwsa-chapter-13-route-53)
14. [SNS](/blog/gtbwsa-chapter-14-sns)
15. [SQS](/blog/gtbwsa-chapter-15-sqs) (You are here)
16. [Kinesis](/blog/gtbwsa-chapter-16-kinesis)
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

---

As I mentioned in the last chapter, Amazon SQS is a more durable message queuing service than SNS. While SNS attempts to emit events as they are published, SQS will hold onto events until an event has successfully been acted upon. Even though I compare SNS and SQS together, know that they are different services with different use cases. SNS pushes out events and SQS holds onto events for a given amount of time or until they are retrieved by some other service.

I have had success using SNS to feed events into SQS with a Lambda consuming the events in SQS. The benefit is that events emitted through SNS are held onto, but there is one caveat here. While SNS pushes events to subscribers, SQS is more of a container that requires polling. Each time that we poll SQS, there is a charge associated with the API call because we are using the service. Depending on the polling configuration, this can add up to extra charges even if events are not actively flowing through SQS. While SQS in and of itself is serverless, the usage model is not based solely on events but also on API calls for retrieving events.

My suggestion for using SQS is to make sure that there is a steady stream of events to consume otherwise the low scale might not be a justifiable use case. SQS is great at offering a buffer for handling events, so if the amount of events does not swamp a Lambda function, then it might be better to stick with only SNS. The threshold of when to add in SQS is a case-by-case decision, but it is worth a bit of caution for the extra cost even if it is small.

I have talked about polling for SQS already, and I want to quickly mention that with a Lambda integration, that polling is handled for us. This is yet another benefit of Lambda and the native integrations offered through other AWS services. I have personally only used Lambda with SQS because the integration provides long polling out of the box and it is super easy to set up. Other services can be used with SQS, but since it does not push events to subscribers, queue consumers might need to set up polling on their own using the AWS SDK or related APIs.

There are two caveats that I have personally come across while developing with SQS and Lambda that I want to point out and discuss. The first is how Lambda deletes events from a queue. The second is around how SQS delivers duplicate events.

When a Lambda function is integrated with SQS it long polls the queue until it receives a batch of events or records. Once our code successfully acts upon those records, we see the Lambda return and finish execution. Behind the curtains though, the integration knows that it needs to delete events from SQS before actually ending its execution. If our code throws an error, the event is never deleted and remains in the queue for another attempt at processing. I learned this lesson the hard way as I wondered why the events in my queue starting stacking up and were never consumed. I knew that the Lambda was running, but the problem was that my code kept erroring out causing the events to remain in the queue.

I have two suggestions for creating a more robust integration between SQS and Lambda. The first is to properly test for and log unexpected errors. I have not had good experiences simply catching and passing all errors, and I will explain why with the second suggestion. Logging the errors is important so we can see what exactly caused the problem then fix it. My second suggestion is to limit the number of times SQS will return an event when polled and move the presumably "bad" event to a dead-letter queue (DLQ) after the number of retries is reached. If all errors are simply caught and passed, then an event would never make it to the DLQ for further investigation.

A dead-letter queue is a queue where events go that could not be successfully processed in their original queue. I like to set up something like three maximum retries on events before they are forwarded to the DLQ. For the DLQ, we can set a CloudWatch Alarm that notifies us whenever we have a bad event end up there, which should prompt further investigation. Maybe the event was malformed, or maybe there was a bug in our code. Either way, this saves money by not having a Lambda function continually fail to act on a specific event.

The second caveat that I have encountered while working with this integration is that SQS does not guarantee only-once delivery. That means that two instances of the same Lambda function can pick up duplicate copies of the same event. There are configuration settings to help remediate this, but I have found better success simply writing idempotent Lambda functions. Writing idempotent Lambdas is probably a better way to go about coding anyway. Just keep this in mind if you ever find two duplicate entries in a database and wonder what happened.

SQS has its benefits, but I see those benefits more so at scale when a heavy spike of traffic needs to be properly absorbed. My personal preference when large scale is not present is to emit events to Lambda through SNS only. My reasoning is because it reduces the potential cost of polling an empty SQS queue. For more durability, I attach a DLQ to the Lambda that is handling the SNS events. The same idea for DLQs applies with Lambda, and we can attach DLQs to any asynchronously invoked Lambda. If the Lambda fails to successfully process an event, it falls into the DLQ, which I can investigate later.


[Next Chapter: Kinesis](/blog/gtbwsa-chapter-16-kinesis)

[Previous Chapter: SNS](/blog/gtbwsa-chapter-14-sns)
