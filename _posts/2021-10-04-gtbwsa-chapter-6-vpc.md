---
layout: post
title:  "GTBWSA Chapter 6: VPC"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS VPC is
date: 2021-10-04 09:00:06 # this is used to properly sort the chapters
---

This is a chapter from the Guide To Building With Serverless AWS that I wrote. For more information about the guide's intent and focuses, please read the Introduction Chapter.

Table of Contents:

1. [Introduction](/blog/gtbwsa-chapter-1-introduction)
2. [Serverless Introduction](/blog/gtbwsa-chapter-2-serverless-introduction)
3. [Introduction to the Cloud and AWS](/blog/gtbwsa-chapter-3-introduction-to-the-cloud-and-aws)
4. [Infrastructure as Code](/blog/gtbwsa-chapter-4-infrastructure-as-code)
5. [IAM](/blog/gtbwsa-chapter-5-iam)
6. [VPC](/blog/gtbwsa-chapter-6-vpc) (You are here)
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

Virtual Private Cloud (VPC) is a fundamental AWS service so much so that every AWS account comes with a VPC by default. However, I do not want to spend much time discussing VPC. If you only ever use the services that I outline in this guide you do not necessarily need to worry about creating a new VPC or even using the default VPC, but you will surely read about them after diving into the AWS realm.

For anyone coming from a traditional networking or operations background, a VPC is pretty much a VLAN. For anyone who does not know what a VLAN is, think about a VPC as a way to completely separate your AWS resources from other resources. Resources in two different VPCs using respective private IP addresses will not be able to talk to each other unless certain non-default conditions are met. This grants more security and helps teams divide up resources based on workload or environment. The downside of learning about VPCs is that AWS assumes everyone has existing knowledge about networking.

Deploying certain resources into a VPC is almost a given, but none of those resources are talked about in-depth in this guide. Some popular VPC-dependent resources include EC2 (which are self-managed virtual machines), ECS Fargate (serverless containers), and RDS (relational databases). I would not worry about VPCs to get started with because it is probably too deep of a rabbit hole to go down into unless you know for sure that your specific workload will need one.


[Next Chapter: Lambda](/blog/gtbwsa-chapter-7-lambda)

[Previous Chapter: IAM](/blog/gtbwsa-chapter-5-iam)
