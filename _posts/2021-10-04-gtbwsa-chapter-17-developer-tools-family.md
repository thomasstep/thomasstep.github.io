---
layout: post
title:  "GTBWSA Chapter 17: Developer Tools Family"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining how to run CI/CD pipelines on AWS
date: 2021-10-04 09:00:17 # this is used to properly sort the chapters
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
14. [SNS](/blog/gtbwsa-chapter-14-sns)
15. [SQS](/blog/gtbwsa-chapter-15-sqs)
16. [Kinesis](/blog/gtbwsa-chapter-16-kinesis)
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family) (You are here)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

---

CodeBuild, CodeDeploy, and CodePipeline are three services that do not operate our application but can be crucial in developing it. All are under the AWS Developer Tools family which helps implement Continuous Integration and Continuous Deployment (CI/CD) workflows. I felt like these services deserved at least a mention since I have used them so extensively, and I believe that most developers and companies should try to implement CI/CD. There are loads of services out there available to help implement CI/CD but I prefer these because the native AWS integration advantages.

CodeBuild is what it sounds like: a build server. A CodeBuild instance is configured to trigger a build based on a git repository either from webhooks, manually, or through an API call. Once a build starts, CodeBuild references something called a `buildspec.yml` in the source code to run. The `buildspec` is a series of shell commands to install dependencies, lint, test, package, and whatever else is necessary to create our deployment package. Each build is run on a clean Linux image (or any other image configured), so we can perform any action we can on development machines to create our output. Normally, my outputs are deployment packages for Lambda that I push to S3, but I have also built and pushed Docker images to ECR and performed other actions not necessarily related to deploying code.

In the same way, CodeDeploy is also what it sounds like: a service to deploy code. The difference between deploying with CodeDeploy and CloudFormation is that we can get fancier than a simple all-at-once deployment and we can enable automatic rollbacks. While CodeDeploy can deploy code like CloudFormation with an all-at-once strategy, we can also enable blue/green deployments using canary and linear approaches, which are much safer than all-at-once deployments. Canary deployments shift traffic in two increments with the first being a smaller portion of traffic before shifting the rest of the traffic after a deployment is deemed safe. Linear deployments shift traffic in multiple equal increments over a configured amount of time. Both canary and linear deployments can automatically roll back deployments at any point based on CloudWatch Alarms that would trigger if something fatal to our service occurs.

Lastly, CodePipeline is a CI/CD workflow orchestrator. The same way AWS Step Functions orchestrates multiple services for serverless workflows so does CodePipeline for CI/CD workflows. I have personally integrated CodePipeline before with S3, CodeBuild, CodeDeploy, Lambda, and CloudFormation among others. Notice the Lambda integration? Again, Lambda is the glue between AWS services, and once a service can use Lambda, anything is possible. CodePipeline always needs a "source stage," which is where it either pulls in a deployment package from S3, a container from ECR, or is triggered by a git repository webhook from something like GitHub. After the source stage, we can combine different actions with inputs and outputs into stages that build, test, and deploy code. The ideal situation is to continuously deploy code, but we can also continuously deliver code and wait for manual approval before deploying.

One implementation idea could be as follows. CodePipeline is integrated with a GitHub webhook to pull in code whenever it is merged into a mainline branch. CodePipeline could then feed the source code into CodeBuild to build the actual deployment package and push it to a predetermined S3 bucket. The location and version of the new S3 object could be output by CodeBuild to be fed into a deployment stage consisting of a CloudFormation action. The CloudFormation action would then perform an all-at-once deployment of the new Lambda code. This effectively implements a CI/CD workflow where source code is automatically deployed without a developer needing to perform tasks outside of merging a pull request.


[Next Chapter: Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

[Previous Chapter: Kinesis](/blog/gtbwsa-chapter-16-kinesis)
