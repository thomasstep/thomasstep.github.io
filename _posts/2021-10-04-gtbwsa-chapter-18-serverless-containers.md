---
layout: post
title:  "GTBWSA Chapter 18: Serverless Containers"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining how to run serverless containers with AWS
date: 2021-10-04 09:00:18 # this is used to properly sort the chapters
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
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers) (You are here)

---

I am hesitant about bringing up container-related services for this guide, which are Amazon Elastic Container Registry (ECR), Elastic Container Service (ECS), and Fargate. While they are marketed as serverless, they do not exactly fit my bill for being serverless since there is still much to be managed by us. Not only is management more involved, but there is a constant cost associated with compute time being billed by the hour since the underlying compute infrastructure is constantly provisioned instead of being charged by requests handled. All that being said, these services are still a good step in the serverless direction compared to the infrastructure that many teams and companies still run.

I have mentioned ECR a couple of times so far in this guide. The same way Lambda deployment packages are to S3, so are container images to ECR. ECR is similar to Docker Hub. We can create public and private image repositories that will hold our images for us. Naturally, AWS services are well integrated with ECR to make deploying images to Fargate as easy as deploying code to Lambda. That is about it for a high-level overview of ECR. I treat it as a simple resting place for images.

Now we can learn how to run containers starting with ECS. ECS is a control plane much like Kubernetes is, and I would not be surprised if some Amazon hacked version of Kubernetes lives under the hood. Before we can even start launching containers, we even create something called an "ECS cluster". Does that sound like Kubernetes? You will find many similarities between the two. ECS is responsible for determining which containers to create, how many to create, and then maintaining the desired state.

There are two fundamental concepts in ECS for defining containers and how they should run, which will seem familiar if you have Kubernetes experience. We use "services" and "tasks" in ECS to define how containers should be orchestrated. A task is a set of containers that should be run together. Most of the time a task only has one main container with business logic in it, but we can deploy auxiliary containers sometimes called sidecars. A service defines some information about how to run and maintain a certain number of tasks within the ECS cluster.

Most people online including myself, normally refer to this whole suite of services as simply "Fargate," but Fargate itself is a small piece of deploying containers using ECS. Fargate is the compute platform onto which ECS deploys containers. The alternative to letting ECS deploy containers on Fargate is deploying them on EC2 instances, which requires much more operational overhead and is definitely not serverless. I like to think of Fargate more or less as a preconfigured set of EC2 instances that are ready to be used specifically with ECS.

In my opinion, Fargate is only considered serverless because the alternative is obviously not serverless. If we chose to use EC2 instances with ECS, we would need to create AMIs (VM images) that allow ECS to run containers and manage the amount of EC2 instances available to an ECS cluster at any given time. While it is not impossible to set up EC2 instances to run with ECS, it does introduce much more complexity than simply using a managed version in Fargate.

Where Fargate is not serverless in my opinion is billing and built-in administrative features like autoscaling. Fargate makes running containers in the cloud easier, but the amount of instances needed at any given point in time needs to be determined by us. A common strategy is setting up CloudWatch Alarms and Autoscaling Groups to scale the number of tasks up whenever they pass the alarm's threshold and back down whenever the alarm quiets down. It works just fine, but it means more management and overhead for us. Compared to Lambda where thinking of autoscaling is almost a non-factor, this is just another downside to ECS and Fargate.

Fargate uses EC2 instances under the hood, which have a time-based charge associated with them. Depending on the amount of memory and CPU power we want available to our containers, we pay per hour to host those containers. No matter what though, we are paying per hour, not per request. Even with a new project trying to get off of the ground, AWS would rightly charge us no matter how much the instances are being utilized. It also means development and staging environments incur a charge when they are up whether or not they are being used.

Use cases for applications vary and using constantly provisioned compute instances does come with benefits sometimes. Maybe traffic patterns are well known and consistent, which would make scaling less of a factor. Maybe the programs being run are more resource-intensive and heavier, which would make Lambda's timeouts and lean nature unappealing. Maybe developing with containers is best for a team, which makes Fargate a step in the right direction compared to EC2. (Although, we can run containers using Lambda, which is very similar to running them in Fargate.) While I still personally prefer using Lambda, Fargate might be a step in the right direction that a team needs to incrementally adopt serverless technology.

While I do shed some sense of a negative light on Fargate, I have used it for production workloads with success, and I do not dislike Fargate as a service. At the end of the day, a development team will probably choose a set of technologies that is most familiar to them, and containers, ECS, and Fargate are closer to prior technology stacks than Lambda will be. This is the reason I decided to include these services in my guide. If all of this is new to you though, then my suggestion is to stick with Lambda as a compute platform. The lower learning overhead makes it easier to get up to speed and Lambda is a great platform to build APIs for modern web applications.


[Previous Chapter: Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
