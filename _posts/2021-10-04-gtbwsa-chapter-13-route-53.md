---
layout: post
title:  "GTBWSA Chapter 13: Route 53"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS Route 53 is and how to use it
date: 2021-10-04 09:00:13 # this is used to properly sort the chapters
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
13. [Route 53](/blog/gtbwsa-chapter-13-route-53) (You are here)
14. [SNS](/blog/gtbwsa-chapter-14-sns)
15. [SQS](/blog/gtbwsa-chapter-15-sqs)
16. [Kinesis](/blog/gtbwsa-chapter-16-kinesis)
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

---

Amazon's Domain Name System (DNS) is called Route 53. Route 53 integrates easily with other AWS services, is highly available, scalable, and has some interesting methods of routing traffic. I have used Route 53 in the past and enjoyed it, but it is worth pointing out that using another DNS (like the one where a domain name is purchased) does not void anyone of using custom domains on AWS. Using an AWS service over a third-party service always comes with its own set of benefits though.

One last note before I dive a little deeper into Route 53. This service is not really serverless in the way that I have defined it. Pricing is not necessarily per request, but by the very nature of DNS, I am not entirely sure if that is possible. That being said, there is no other DNS that I know of offering a "per-request" style of pricing. Either way, I feel like the flexibility and ease of integration that Route 53 has with other AWS services that I have brought up in this guide makes it useful enough to include.

The first and largest benefit that comes with using Route 53 is availability. AWS offers a 100% available SLA, which is just wild. I have never heard of another service in the world that offers 100% availability. Their strategy for providing something so ludicrous is not a secret and published in online documentation, which I suggest finding and reading to understand the power of this system that we can tap into. Again, AWS flexes their huge global presence to make an extremely available and scalable service.

A fundamental concept of Route 53 is the "hosted zone", which is the same idea as a normal DNS zone. A hosted zone needs to be created in Route 53 before DNS records can be created. There are two types of hosted zones: public and private. Private hosted zones are used for inter-VPC records, so my guess is that you will not use them often unless that type of networking is needed in your infrastructure. Public hosted zones are what will be exposed to the internet and tell users where to find the resources they are querying for.

Another fundamental concept of Route 53 is the health check. This might not sound like something that relates to normal DNS, which is correct. There are complex routing policies offered through Route 53 that rely on health checks for failovers, and I will discuss those more complex routing policies right after health checks. This concept is what it sounds like though. Route 53 checks that the target it is sending traffic to is up and ready to receive that traffic.

There are three types of health checks: normal health check, single resource health check, a combination of health checks on various resources, and a health check based on a CloudWatch Alarm. The single resource health check is a simple and standard health check that reaches out to a resource, makes sure that the resource responds, and signifies whether or not the resource is up and running.

The combination of health checks is similar to CloudWatch Alarm math where we can take the status of multiple health checks on resources and combine them to determine a final status of a system. The combination health checks work best for distributed systems that need a few critical pieces working in order for the whole system to work properly.

The final health check style should seem familiar after going through the CloudWatch chapter. The status of a CloudWatch Alarm is what signifies the health of the target. This can also be a combination of different alarms or based on a resource's load to determine whether a resource can handle more load. Since a CloudWatch Alarm is used, the possibilities are almost endless, and I suggest reading what I have previously discussed about CloudWatch Alarms to understand what can go into this.

Lastly, I wanted to bring up the various routing policies that Route 53 exposes to us. The types of routing as of this writing are simple, failover, multivalue answer, weighted, geolocation-based, latency-based, and geoproximity. We do not necessarily need to stick to a single routing policy though since AWS lets us combine them; however, I have personally never used a combinatorial approach and I imagine the use case would be fairly complex. The two routing policies that I specifically want to discuss are simple routing and latency-based routing. These are the two that I have used in projects before and find most useful. Each routing policy has its own advantages depending on users and application use case though, so they are all worth knowing about.

Simple routing is a normal DNS record. This is more of a standard single domain name to single resource mapping using record types like `A` and `CNAME` records. I have used this type of policy multiple times over because it is familiar and simple to set up. There is not much more to say about this, and if this information seems foreign to you, I would suggest looking into what DNS is before moving on.

Latency-based routing adds a bit of Route 53 flavor into the mix of a standard DNS. Instead of a single domain name mapping to a single resource, we can use the same domain name for multiple resources and dynamically point the user towards the resource that would provide them with the lowest latency. To me, this is an awesome feature of Route 53 that allows us to create dynamic and distributed applications. The situation I have used this in was a globally diverse application. There were regional deployments of API Gateways with Lambda integrations and DynamoDB Global Tables replicating to those regions. The DNS was handled by a latency-based routing policy that routed the user to the replica of the application closest to them instead of using different domain names for each region.

I have used Route 53 as the DNS service for both API Gateway and CloudFront distributions hosting websites with great success. The way that AWS allows us to replicate resources across regions and point users towards the closest set to them is an instant latency decrease. The services all flow together and make building distributed applications much easier and quicker, which is my main goal.


[Next Chapter: SNS](/blog/gtbwsa-chapter-14-sns)

[Previous Chapter: CloudFront](/blog/gtbwsa-chapter-12-cloudfront)
