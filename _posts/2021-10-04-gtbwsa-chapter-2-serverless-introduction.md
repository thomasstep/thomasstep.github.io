---
layout: post
title:  "GTBWSA Chapter 2: Serverless Introduction"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Intoducing what serverless is and means to me
date: 2021-10-04 09:00:02 # this is used to properly sort the chapters
---

This is a chapter from the Guide To Building With Serverless AWS that I wrote. For more information about the guide's intent and focuses, please read the Introduction Chapter.

**Table of Contents:**

1. [Introduction](/blog/gtbwsa-chapter-1-introduction)
2. [Serverless Introduction](/blog/gtbwsa-chapter-2-serverless-introduction) (You are here)
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
15. [SQS](/blog/gtbwsa-chapter-15-sqs)
16. [Kinesis](/blog/gtbwsa-chapter-16-kinesis)
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

---

I almost exclusively use serverless technologies. Some of the more popular AWS serverless offerings I use include Lambda, API Gateway, SNS, and DynamoDB. Each of these has its purpose that I will go into throughout this guide. I want to keep a focused lens for this guide and not let in scope creep.

I have multiple products lingering around the internet that are all built on serverless technologies. The hosting costs are zero until someone pays me first to use a service. From what I have seen from others and experienced in my professional life when it comes to AWS costs I am unique in the fact that I do not pay anything until my products get used. Cost is one of the largest benefits of using serverless architectures and one of the largest differentiators that I look at before judging a service as one that I want to use. It may be argued that serverless technologies cost more down the road while under load or with consistent traffic, but I have seen that the opposite is true as long as the code is written to go hand-in-hand with the architecture.

Before getting into AWS and operations, I was a software engineer. I am still a software engineer, and I thoroughly enjoy writing code. The main reason I got so deep into AWS was that after I wrote the code, I needed some way to share it. Anyone can spin up a server on their machine and make requests to `localhost`. An added layer of complexity arrives when it comes time to host that code or service publicly. AWS and the opportunity for abstraction it provides, allows me to handle that complexity. That being said, I like to understand what goes on behind the scenes of any technology that I work with, so I will offer the same explanation in this guide. However, using the serverless services that AWS provides allows me to focus on writing code while managing infrastructure becomes the easy part. This is another huge benefit of serverless: time savings. Not only does setting up a serverless architecture take less time than traditional infrastructure, but it also extends the time savings to generic boilerplate server code. I don't write routing logic anymore, I just create a new Lambda function with the logic and tell API Gateway to handle the rest for me.

Serverless provides advanced infrastructure benefits that used to be difficult to orchestrate like autoscaling and computing efficiency. I have seen many guides online about autoscaling for containers and EC2 instances. With a service like Lambda, load balancers and scaling alarms are a non-factor. All of that is handled out of the box. Compute resources, and therefore cost, is also optimized. Using a Lambda function means that I only ever paid for the underlying compute resources when I use it. Compare that to always paying for an EC2 instance regardless of the utilization and the cost-benefit becomes clear. The best part is that there are probably benefits and optimizations working behind the scenes and constantly being updated that I do not know about. Using serverless technologies means that developers can develop while a dedicated operations team at AWS handles the infrastructure.


[Next Chapter: Introduction to the Cloud and AWS](/blog/gtbwsa-chapter-3-introduction-to-the-cloud-and-aws)

[Previous Chapter: Introduction](/blog/gtbwsa-chapter-1-introduction)
