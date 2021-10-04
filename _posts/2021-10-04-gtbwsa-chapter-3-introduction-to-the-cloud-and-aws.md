---
layout: post
title:  "GTBWSA Chapter 3: Introduction to the Cloud and AWS"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Introducing what the cloud is and what AWS is
date: 2021-10-04 09:00:03 # this is used to properly sort the chapters
---

This is a chapter from the Guide To Building With Serverless AWS that I wrote. For more information about the guide's intent and focuses, please read the Introduction Chapter.

Table of Contents:

1. [Introduction](/blog/gtbwsa-chapter-1-introduction)
2. [Serverless Introduction](/blog/gtbwsa-chapter-2-serverless-introduction)
3. [Introduction to the Cloud and AWS](/blog/gtbwsa-chapter-3-introduction-to-the-cloud-and-aws) (You are here)
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

Boiled down to its core, cloud providers are simply offering computers and storage to anybody wanting to use their resources. Some companies that are large enough to benefit from economy of scale will own and manage their own data centers, but using a cloud provider mostly likely makes more financial sense before reaching that scale (and sometimes even afterward).

For those of us who are smaller players, using a cloud provider fits the bill well. There is a low overhead for us because we do not need to work out the finer data center details or struggle with the overhead of purchasing servers. Also, there are performance benefits both in computation and reliability. Purchasing mass volumes of high-end servers for a smaller player makes little to no sense when compared to running the same service on a cloud provider's managed servers. Furthermore, purchasing enough servers and appropriately networking them to have failover and geographic redundancy would skyrocket the cost. At a scale like Amazon, Google, or Microsoft, it makes sense to have multiple data centers spread out all over the world with racks upon racks of servers and disks. For a bootstrapped startup, buying a single server to host an app is almost out of the question not to mention the operational overhead of getting it up and running.

AWS is simply a cloud provider. The concepts used for building, deploying, and running applications on AWS can be abstracted out to any cloud provider. My goal is not to sell anyone specifically on using AWS, but I believe AWS currently has the best service offerings and has the largest community around it. Specific serverless services make arguing against AWS difficult especially with the cult-like following of some including Lambda and DynamoDB. On top of that, AWS makes DevOps available to even the smallest players with serverless CI/CD tools like CodeBuild, CodePipeline, and CodeDeploy.

There are plenty of PaaS (Platform as a Service) out there, but using AWS and having full control over your infrastructure comes with great benefit. Configurations can be tweaked and optimized, new services can easily be integrated, and it is plain fun to build out infrastructure. Having more granular control also means more granular pricing.

By using AWS and reading through this guide, I hope that I can offer a framework for quickly building applications. I believe that by harnessing all of the hard work that AWS (or any cloud provider for that matter) does with regards to deploying and hosting code, building an application is easy than ever before in history. Speed is the name of the game, and using AWS means getting stuff out quicker.

Before we dive much deeper into understanding specific services, we need to touch on two other services that are foundational to everything in the cloud: Infrastructure as Code (IaC) and IAM (Identity and Access Management). Both topics serve an enormously important role in the cloud, and I always recommend learning the concepts behind them before jumping into other services. I learn best by doing things, so in the cloud learning arena, I learn best by provisioning infrastructure and using it. Since IaC and IAM are tools that touch every other service, I do not think that practicing only IaC or IAM is completely necessary because practicing using these two areas will happen in parallel with everything else.


[Next Chapter: Infrastructure as Code](/blog/gtbwsa-chapter-4-infrastructure-as-code)

[Previous Chapter: Serverless Introduction](/blog/gtbwsa-chapter-2-serverless-introduction)
