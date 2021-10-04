---
layout: post
title:  "GTBWSA Chapter 5: IAM"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS IAM is and how to use it
date: 2021-10-04 09:00:05 # this is used to properly sort the chapters
---

This is a chapter from the Guide To Building With Serverless AWS that I wrote. For more information about the guide's intent and focuses, please read the Introduction Chapter.

Table of Contents:

1. [Introduction](/blog/gtbwsa-chapter-1-introduction)
2. [Serverless Introduction](/blog/gtbwsa-chapter-2-serverless-introduction)
3. [Introduction to the Cloud and AWS](/blog/gtbwsa-chapter-3-introduction-to-the-cloud-and-aws)
4. [Infrastructure as Code](/blog/gtbwsa-chapter-4-infrastructure-as-code)
5. [IAM](/blog/gtbwsa-chapter-5-iam) (You are here)
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

IAM stands for Identity and Access Management. This service and concept can be annoying but it is, unfortunately, part of everything. IAM is one of the few fundamental services that AWS offers and it is related to security. IAM consists of a few important resources which include Users, Roles, and Policies. All of these IAM resources work together for AWS resources to tell other AWS resources what they are authorized to do similar to a traditional AAA (Authentication, Authorization, Accounting) service. For example, a Lambda function with an IAM Role attached to it that allows access to a specific DynamoDB Table named "lambdaTable" will only be able to access that table. The same Lambda will get an Access Denied Error if it tries to access a DynamoDB Table named "fargateTable."

IAM Users can be thought of as standalone AWS resources that represent a certain person or application that interacts with AWS. For example, I could create an IAM User for myself to have credentials for interaction through the command line, and I could create an IAM User for a third-party CI/CD service that needs access to deploy to AWS on my behalf. Users can have static credentials called Access Keys with which AWS can be accessed through the command line. The configuration process can be done through environment variables or static files, but I suggest searching for the current AWS documentation on that process instead of me giving specifics.

IAM Roles are a logical grouping of Policies. IAM Roles in and of themselves do not do anything. A Role needs to be assumed by another resource (an IAM User, Lambda function, etc.) before it becomes useful. The resource that assumes the Role then receives all of the permissions defined in the Policies contained in the Role.

IAM Policies are the fundamental element of authorization in AWS. Policies are JSON documents that define what actions resources are allowed to perform. There are two types of Policies: identity-based Policies and resource-based Policies.

Identity-based Policies can be built as standalone resources or attached directly to IAM Users and Roles. The resource that assumes a Role or a User with an attached Policy will only be able to operate within the bounds of what the identity-based Policy defines as allowed.

Resource-based Policies are attached directly to non-IAM AWS services. The most common service that can have Resource-based Policies attached to it is S3. The Resource-based Policy would define what other resources could act upon the attached resource and what operations the other resources could perform. Resource-based Policies allow us to create restrictions or allowances on AWS resources regardless of the permissions defined in the Identity-based Policies that they are associated with since Resource-based Policies' permissions boundaries take precedence over Identity-based ones.

Users, Roles, and Policies lightly play with each other but do not necessarily always need to. Policies are the fundamental portion as we have already seen. A Policy can function as a stand-alone resource that is associated or "attached" to multiple Users, Roles, or Resources, which are called Managed Policies. Policies can also be written as Inline Policies in which case they are one-off and only attached to a single User, Role, or Resource. Roles are bundles of Policies both managed and inline. Roles can be assumed by Users or other AWS resources during execution. Users are made up of managed and inline Policies, but Users can also "assume" Roles. It can be complicated, but after experimentation, IAM becomes easier to understand. I will share the most common pattern that I have used in the past to manage the various IAM resource types.

I normally start by creating a few Policies with a given set of permissions, for example, one Policy for reading from DynamoDB, one for reading from Kinesis and writing to S3, and so on. Those select few Policies become a standard issued set which can then be attached to various Users and Roles. Users are created for particular people or services and are somewhat one-off. The same idea with Policies would then apply to Roles, so a select few Roles are created with semi-broad but still restricted permissions defined in the Policies. Those few Roles are then referenced by various AWS resources to be assumed during execution. In this way, only the select few Policies and Roles need to be maintained reducing operational overhead for this area of AWS. The shortcoming is that the Policies are slightly broader than they may need to be which is not a security best practice, but maintaining Policies and Roles for every service can be cumbersome.

IAM is important but I do not want to spend too much more time discussing them. Much of IAM can be learned in a trial-by-fire process. AWS does not always have the best error messages, but figuring out that a service is missing permissions to access a certain resource is normally easy. Determining which permissions to add to an IAM Role or Policy is also fairly straightforward after seeing one of those errors. One way to go about doing this (although not best practice) is to provide a service with blanket permissions from the get-go. Later, those permissions can be narrowed down to specific CRUD (Create, Read, Update, Delete) permissions or specific API calls even.

All that being said I currently rely on IAM Roles generated by the CDK or I use IAM Roles that I have created multiple times over in CloudFormation in the manner that I discussed earlier. Just like anything else in computing, patterns will emerge for permissions that certain services need and those can be made into generic templates. The CDK handles IAM automatically and really well. Most of the time, IAM Roles do not even need to be defined through the CDK, and adding the required permissions for a given service becomes as simple as an API call. I highly suggest learning the ins and outs of IAM, but CDK puts all of that on autopilot once you understand what is happening behind the curtains.


[Next Chapter: VPC](/blog/gtbwsa-chapter-6-vpc)

[Previous Chapter: Infrastructure as Code](/blog/gtbwsa-chapter-4-infrastructure-as-code)
