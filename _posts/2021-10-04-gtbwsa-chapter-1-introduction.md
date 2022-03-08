---
layout: post
title:  "GTBWSA Chapter 1: Introduction"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Introducing the guide and my intentions with it
date: 2021-10-04 09:00:01 # this is used to properly sort the chapters
redirect_to: https://thomasstep.gumroad.com/l/serverless-guide
---

This is a chapter from the Guide To Building With Serverless AWS that I wrote. For more information about the guide's intent and focuses, please read the Introduction Chapter.

**Table of Contents:**

1. [Introduction](/blog/gtbwsa-chapter-1-introduction) (You are here)
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
15. [SQS](/blog/gtbwsa-chapter-15-sqs)
16. [Kinesis](/blog/gtbwsa-chapter-16-kinesis)
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

---

I have worked extensively with AWS for multiple years. I have run production applications on AWS and I have personally created and built products and multiple one-off APIs using AWS. I have worked with more traditional architectures, but after learning about serverless architectures, I do not think I can ever go back. My goal with this guide is to give my stance on how to build applications with AWS by discussing my favorite services and showing how to tie them all together.

Anyone from a traditional architecture background may find that this is "buzzwordy" to which I say, "fair." However, there is a reason that building software with serverless is popular: it involves less upfront work and operational maintenance is reduced. Delivery speed is the name of the game in software. Being able to spin up a completely new API within the span of a few minutes should be an argument enough. Creating that same API with built-in autoscaling, efficiency, and security is icing on the cake. Let the people at AWS handle operations so we can focus on writing software for our specific use cases.

I am a software engineer that happened to learn DevOps and cloud engineering. I am not claiming to be the end-all-be-all resource on cloud or AWS knowledge; however, I am one of the few people I know of that has an understanding and interest of both the software and operational sides of building web applications. For that reason, putting together this guide seemed valuable for both myself and others. I run in two very different circles on the internet and I hope to bridge that gap.

Operations and development seem to not want to cross-pollinate despite the emergence of "DevOps" and despite everyone calling themselves a DevOps engineer. When I hear DevOps, my mind goes to someone like myself who can develop the application code and also write infrastructure as code to host and run the application. From what I have gathered online, this is not the norm. Instead, most people take DevOps to mean someone who used to be purely in operations, learned how to script in Python, and now does mostly the same operations work but through a cloud provider. On the other side, very few of the software engineers I know have had any sense of wanting to learn more about the infrastructure side of things. It is a true shame because writing software and provisioning infrastructure for the application go hand in hand.

Writing code for a serverless API is not a traditional method of writing code. I can only imagine how long it will take for colleges and boot camps to even realize that enterprise-grade code does not run on a virtual machine in a company-maintained data center anymore. There's a definite knowledge gap that I hope to start filling with this guide.

To achieve my goal with this guide, I will introduce some operational concepts and services available through AWS that implement those concepts, then I will give some ways that I have successfully integrated them. I do not plan to give highly technical examples or API calls because AWS could change those at any time. I want to instead give insight into how these services work at a higher level so that the tools available to us can be better understood instead of giving copy and paste examples. AWS is just a big set of building blocks, and the way in which we put them together is where we can create value. Knowing what is available and how to lay down a foundation is the starting point into the vast world that is AWS.

The services I write about are foundational services that I believe new learners should focus on. I hope to write this guide the same way I would speak to a colleague while they are first starting their journey. I want to expose you to key services and what they can do, but I do not intend to create a one-stop-shop for learning everything you need to know about AWS. As AWS is constantly changing, learning the fundamentals is more important than learning the implementation details or provisioning process. Also, once you know the provisioning process and integrations for one service, provisioning and integrating other services becomes vastly easier.


[Next Chapter: Serverless Introduction](/blog/gtbwsa-chapter-2-serverless-introduction)
