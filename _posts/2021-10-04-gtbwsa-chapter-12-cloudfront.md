---
layout: post
title:  "GTBWSA Chapter 12: CloudFront"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS CloudFront is and how to use it
date: 2021-10-04 09:00:12 # this is used to properly sort the chapters
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
12. [CloudFront](/blog/gtbwsa-chapter-12-cloudfront) (You are here)
13. [Route 53](/blog/gtbwsa-chapter-13-route-53)
14. [SNS](/blog/gtbwsa-chapter-14-sns)
15. [SQS](/blog/gtbwsa-chapter-15-sqs)
16. [Kinesis](/blog/gtbwsa-chapter-16-kinesis)
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

---

This first shorter chapter is about Amazon CloudFront. CloudFront is a Content Delivery Network (CDN) which is a fancy way of saying it is a file server. There are tons of different CDNs available out there, but CloudFront makes integrating with S3 super easy and it has extremely nice built-in features. The way CloudFront (and CDNs in general) work is by pulling static files (images, HTML, etc.) from a specified origin to be distributed with less latency to end-users. Distributing those files amongst data centers that are geographically separated allows a user to download files from a location closer to them instead of from a single file server that may be far away resulting in higher latency (the name of the game is almost always to reduce latency). Those files will be cached near users which also helps speed up delivery.

The way CloudFront works with S3 is more or less what I outlined above. We create something in CloudFront called a "distribution," which pulls files from a specific S3 bucket and serves them to users. The integration is about that simple. If an S3 bucket hosted a website, putting a CloudFront distribution in front of the S3 bucket would not change anything except speed up time to delivery for users, the paths are a one-to-one mapping unless otherwise configured.

CloudFront first and foremost brags about its security. Just turning on CloudFront instead of using an S3 bucket for pulling files brings all the benefits that Amazon has worked so hard to create. There are other add-ons that we can enable or integrate to create extra barriers for security's sake, but vanilla CloudFront is a great starting point. Integrations include services like AWS WAF (Web Application Firewall) and AWS Shield, but keep in mind that these security services are not free.

CloudFront is also highly available if configured correctly using something called origin groups. The CloudFront and single S3 bucket approach that I have already talked about is great, but there is a chance that the region can go down where our single-origin S3 bucket lives. If that happens, our users would not be able to retrieve files. Origin groups can provide higher availability by setting a failover origin. If the primary origin or S3 bucket is unavailable, CloudFront will automatically attempt to retrieve files from the failover origin or S3 bucket. As I have already mentioned, we can configure S3 to replicate data across regions, so the CloudFront failover origin can be set up as a cross-region replicated S3 bucket for our service's continuity.

I have already hinted at CloudFront being quick and performant, but there is a specific benefit that I wanted to point out related to speed. We receive great benefit from CloudFront's caching in terms of improved latency and lower cost. Data transfer costs money. Not a ton, but it does add up depending on the level of traffic being served. Whenever a file is transferred out of S3 to CloudFront, CloudFront caches that file which means we do not need to transfer any more data out of S3 as long as the file is cached. While there is still cost, data transfer out of CloudFront is cheaper and quicker than S3.

Edge locations are a huge advantage of CloudFront, and one of the main reasons anyone uses a CDN at all. Amazon uses CloudFront to serve their static content, so serving files quickly with their amount of traffic is no easy feat. Thanks to the numerous edge locations (data centers) all over the world that we can take advantage of, we can serve our files (websites, photos, etc.) quicker to users because servers are closer to our users. Low latency is one of the top factors for website users' satisfaction, so we have the chance to make users happier.

The last performance-based feature that I wanted to highlight is compression. CloudFront will compress objects that users are requesting to view if the user's browser (or other application) supports compression. A compressed file means a smaller payload, which translates to saved bandwidth and money. If there is less of a file to transfer across the internet, that file will naturally finish downloading faster. Also, since we pay CloudFront transfer fees by the gigabyte, we also pay less to transfer a compressed file.

CloudFront is a huge benefit of using AWS services because it is super easy to integrate, gives added security out of the box, and allows for easy configuration to reduce latency. Whenever I have an S3 bucket hosting a website or serving files, I almost always put a CloudFront distribution in front of it. As a rule of thumb, if an end-user uses a file in an S3 bucket, I try to serve it to them through CloudFront. With the easy integration, there is almost no reason not to use S3 and CloudFront together for file sharing and website hosting.


[Next Chapter: Route 53](/blog/gtbwsa-chapter-13-route-53)

[Previous Chapter: CloudWatch](/blog/gtbwsa-chapter-11-cloudwatch)
