---
layout: post
title:  "GTBWSA Chapter 14: SNS"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS SNS is and how to use it
date: 2021-10-04 09:00:14 # this is used to properly sort the chapters
redirect_to: https://thomasstep.gumroad.com/l/serverless-guide
---

This is a chapter from the Guide To Building With Serverless AWS that I wrote. For more information about the guide's intent and focuses, please read the Introduction Chapter.

**Table of Contents:**

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
14. [SNS](/blog/gtbwsa-chapter-14-sns) (You are here)
15. [SQS](/blog/gtbwsa-chapter-15-sqs)
16. [Kinesis](/blog/gtbwsa-chapter-16-kinesis)
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

---

When a system gets more and more complex, processing times can start to grow out of control. No matter how many tweaks or optimizations we make to API endpoints' handlers, sometimes it is best to simply move some of that logic out of the critical path. The end goal of creating an asynchronous workflow like this is the limit the amount of latency that a user experiences while finishing processing a request in the background. In traditional systems, this could mean creating a queuing service, posting messages to the queue, and consuming those messages in the background. With AWS we can accomplish all of this with the use of Simple Notification Service (SNS).

I will be honest, I did not realize the usefulness of SNS until fairly late into my AWS journey. Reducing latency can be difficult. I have found that moving logic out of the user's interaction and into the background is sometimes easier and more beneficial than trying to optimize code as much as possible. SNS is super helpful in creating these types of asynchronous workflows especially because it integrates so easily with Lambda. I brought up event-driven architectures in the Lambda chapter, and SNS is what drives those events throughout a system.

There are a few fundamental concepts revolving around SNS that need to be understood before I go into my uses cases. SNS is simply an event emitter and each "instance" of SNS is called a "topic". We can make an API call to publish an event to a topic. The topic then pushes that event out to all of its "subscriptions" based on the "filter policies" applied to them. Often times we refer to a system like this as a distributed publish-subscribe (pub/sub) messaging system, where Apache Kafka is the incumbent software.

A topic is what would be considered an instance of a queuing system. With SNS being serverless, we can choose to create as many topics as we would like, but I personally like to only create one per workload or API. This keeps everything centrally located and less confusing. I separate out my processing logic using filter policies on my subscriptions.

Subscribing to an SNS topic is fairly straightforward. We can subscribe a number of endpoint types to a topic including HTTPS, email, SMS, SQS (more on this later), Kinesis (again, more on this later), and Lambda. If the subscriber is external (HTTPS, email, SMS), then we subscribe the endpoint, email address, or phone number to the topic. If the subscriber is another AWS service, then we can subscribe the service directly using its ARN. Once the subscription has been established, any events published to the topic will be pushed to all of the subscriptions.

After creating a topic and while starting to create my subscriptions, I like to add filter policies to my subscriptions to maintain more granular control over what events my subscribing Lambdas handle. Filter policies are what allow me to use a single topic for multiple types of events. The only trick with using filter policies is that the same keys and values used in the filter policy need to be included in the `Publish` API request as part of the "message attributes". This is the only way that SNS will know how to deliver those events accurately.

The way I like to structure my projects for asynchronous processing now is a standard API Gateway and Lambda at the front serving the user in the critical path, an SNS topic for the API Gateway's Lambda to publish events to, and a Lambda with a subscription to that topic to consume those events on the backend. Normally, emitting an event in the critical path takes less time than the extra processing would especially if the extra processing includes API calls. I also use the AWS SDK to handle constructing the `Publish` API payload in the API Gateway's Lambda. Remember that the `Publish` API call is where I need to use the same message attribute key and value pairs that I used in the filter policy. If events are not being properly delivered, the message attributes may have an inconsistency with the filter policy.

Another clean integration with SNS is directly through API Gateway, which is also something I brought up in the Service Proxy Integrations section of the API Gateway chapter. An API Gateway would receive a request from a user and would be configured to construct and publish an event directly to SNS without a Lambda function in the middle. This is a much better way to handle requests that can be processed completely in the background. Be forewarned that this integration can be slightly tricky if you are not familiar with AWS APIs though.

Besides using SNS for offloading logic from an API endpoint, we have already discussed a useful integration a couple of times which is CloudWatch Alarms. Now that we have a better understanding of exactly what SNS is, the integration with CloudWatch Alarms is hopefully a little clearer. An Alarm triggers which publishes an event to an SNS topic which pushes the event to its subscriptions. I have personally used email and Lambda subscriptions with this integration and had great success.

One of the subscription integrations that I brought up earlier was AWS SQS which stands for Simple Queue Service. Wait, I thought SNS was a replacement for setting up a traditional queuing service? Kind of. SNS and SQS when used together would really be the alternative for a more traditional piece of software like Kafka. SNS works perfectly fine but SQS adds more durability into the mix. However, I will discuss my thoughts and use cases for SQS in the following chapter.

Overall, SNS offers huge benefits and easy integrations. Since I rediscovered how important it can be, I use SNS in tons of my workloads. Being able to publish events to be handled in the background frees up resources and time to ensure a smoother and snappier user experience for my APIs. The pricing also fits in nicely with the serverless models that I have already talked about. We pay for SNS by request or event, so our costs only scale as we utilize the service more. The goal, as with all applications, is that our usage increases in step with paying users.


[Next Chapter: SQS](/blog/gtbwsa-chapter-15-sqs)

[Previous Chapter: Route 53](/blog/gtbwsa-chapter-13-route-53)
