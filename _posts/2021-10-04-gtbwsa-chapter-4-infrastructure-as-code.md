---
layout: post
title:  "GTBWSA Chapter 4: Infrastructure as Code"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what infrastructure as code is and how to use it
date: 2021-10-04 09:00:04 # this is used to properly sort the chapters
---

This is a chapter from the Guide To Building With Serverless AWS that I wrote. For more information about the guide's intent and focuses, please read the Introduction Chapter.

Table of Contents:

1. [Introduction](/blog/gtbwsa-chapter-1-introduction)
2. [Serverless Introduction](/blog/gtbwsa-chapter-2-serverless-introduction)
3. [Introduction to the Cloud and AWS](/blog/gtbwsa-chapter-3-introduction-to-the-cloud-and-aws)
4. [Infrastructure as Code](/blog/gtbwsa-chapter-4-infrastructure-as-code) (You are here)
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

Infrastructure as Code enables repeatable infrastructure provisioning and configuration. This concept is what allows us to move quickly and abstract out ideas and patterns that we use often. The AWS-native method of writing infrastructure as code is using a service called CloudFormation.

CloudFormation ingests our requests in the form of "templates" written in YAML or JSON (I suggest using YAML) and provisions infrastructure according to what the template specifies in something called a CloudFormation Stack. The CloudFormation Stack can then be updated or deleted and multiple stacks can be created based on the same template. I like to think of CloudFormation templates as a declarative way of calling AWS APIs to provision infrastructure with certain configuration settings. A similar idea would be writing a program without variables and hard coding every value. That being said, there are ways to make CloudFormation templates "dynamic" by substituting in environment-specific values using parameters, pseudo parameters, AWS Secrets Manager, and AWS Systems Manager Parameter Store.

Learning CloudFormation is a good first step into learning IaC, but after thousands of lines of YAML, it is almost inevitable that patterns will start to emerge that would be better abstracted out. There are ways to do this natively in CloudFormation by using something called CloudFormation Nested Stacks; however, I do not recommend using them. I have heard horror stories from trusted resources when it comes to maintaining and updating those Nested Stacks. My suggestion is to either bite the bullet and copy-paste those walls of YAML text or look into IaC that leverages a programming language to build the infrastructure.

Spend some time hanging around cloud and DevOps forums and in no time at all there will be mentions of third-party IaC providers like Serverless Framework, Hashicorp Terraform, or Pulumi, to name a few. Some are kept more updated than others with Terraform seeming to be the prevalent provider. My suggestion is to stick with first-party solutions though. The latest addition to this menagerie of IaC using a familiar programming language is AWS's own called the CDK or Cloud Development Kit.

Since learning and experimenting with the CDK, I have started migrating my IaC to CDK applications. The CDK is a way to define infrastructure using a programming language instead of YAML templates. When a CDK application is "synthesized" it outputs CloudFormation in YAML or JSON, so the CDK is effectively a layer on top of CloudFormation that we can interact with using programming languages that output static templates.

Keep in mind that I am a software engineer at heart. When I learned that I could mesh my cloud knowledge with programming, I was excited. Abstracting out ideas and making them repeatable is a core concept in programming, so the ability to use what I knew already from that arena and apply it to cloud resource definitions would make my life much easier and more succinct.

I see loads of beginner AWS tutorials that start out using the AWS console. While I also get some amount of benefit from visual verification, do your best to start using IaC as quickly as possible. The benefits are too large to become dependent on using the console. Two of those benefits that I lean on heavily are replicability and programmatic deployments.

Using CloudFormation templates means that we can deploy a stack knowing exactly what resources will be provisioned on our behalf. Creating another version of an application becomes a matter of deploying a new CloudFormation stack using the same template(s) as before. That replicability helps me sleep well at night. If a resource fails or someone makes a breaking manual change (things that happen all the time), all we need to do is recreate or update our CloudFormation stack to get everything functioning as intended again.

Using CloudFormation templates and storing those alongside the code which runs on the infrastructure in source control means that we can enable DevOps processes. This goes hand-in-hand with replicability. We can create a CloudFormation template once and deploy it multiple times to produce the same application infrastructure. CodeBuild, CodeDeploy, and CodePipeline are all developer tools offered by AWS that help with deploying and updating CloudFormation stacks based on external triggers like a push to GitHub or a pull request being merged.

In the following sections highlighting specific services, I encourage experimenting with them solely through IaC and CloudFormation. All of the services that I use and will bring up in this guide are integrated with CloudFormation. The AWS documentation is good in this area (not so much for all of their services) so a quick search including "cloudformation" plus the service you are attempting to provision should bring up the corresponding documentation.


[Next Chapter: IAM](/blog/gtbwsa-chapter-5-iam)

[Previous Chapter: Introduction to the Cloud and AWS](/blog/gtbwsa-chapter-3-introduction-to-the-cloud-and-aws)
