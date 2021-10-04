---
layout: post
title:  "GTBWSA Chapter 16: Kinesis"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS Kinesis is and how to use it
date: 2021-10-04 09:00:16 # this is used to properly sort the chapters
---

This is a chapter from the Guide To Building With Serverless AWS that I wrote. For more information about the guide's intent and focuses, please read the Introduction Chapter.

Table of Contents:

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
16. [Kinesis](/blog/gtbwsa-chapter-16-kinesis) (You are here)
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

---

Another service facilitating asynchronous processing in AWS is Kinesis, which I have mentioned a few times already in this guide in the context of data analytics with S3 and CloudWatch. If you have already tried looking into Kinesis, you might have noticed that there are a few "subservices" underneath the greater umbrella. Kinesis itself is more of a family of services that help in collecting, processing, and analyzing data in real-time. Whenever I have mentioned "Kinesis", I specifically mean Kinesis Data Firehose, and the same rule applies in this section. Data Firehose is a serverless flavor of Kinesis where we pay by data ingested only, while Data Streams is a more managed flavor where we pay for provisioning by the hour. There are two other services as of this writing which are Video Streams and Data Analytics, but I have not used either service too extensively as of yet.

Any flavor of Kinesis (but specifically Data Firehose) is a queue similar to SQS but much more suited to data analytics applications because it operates near real-time. Kinesis can move tons of records at a time while also allowing for custom processing using integrated Lambda functions. The input to a Kinesis instance is logs and the output are those logs but transformed and shipped to the configured destination.

Kinesis is intended to ship data like logs from services in a distributed system to a centralized location, but it all starts with records produced by our system. Data can be pushed in using AWS integrations like CloudWatch or directly using HTTP PUTs on Kinesis's API which can be accomplished using the AWS SDK. I have also taken this a step further by creating an API Gateway proxy integration to Kinesis so that my services could PUT records to the API Gateway using an HTTP library instead of needing the SDK. This is just one more example of all the ways we can use the building blocks I have mentioned so far in this guide to build something custom for ourselves.

After records enter Kinesis, we can configure something called a transformer, which is a Lambda function that contains custom logic to transform records before they end up in their final destination. The Lambda function is invoked with a batch of records that have been buffered by Kinesis. Those records could come in compressed depending on how Kinesis is configured, and they will also be `base64` encoded. Normally my Lambda code involves iterating through the records, decoding them to ASCII, performing my custom transformations, encoding back to `base64`, then returning. Transforming Kinesis records normally involves normalizing, removing, scrubbing, or injecting data. That piece is custom so there is not much specific advice that I can provide on that front; however, returning the transformed data in the proper format to Kinesis has some trip-ups.

First off we need to return data to Kinesis encoded as `base64`. I have had my fair share of simply returning a transformed plain text record that resulted in me wondering where it went.

The more confusing part of returning records to Kinesis is the returned object. It is not enough for us to return a `base64` encoded string because Kinesis will not know what the original record was, where it was going, or if the transformation was successful. Each record is given to the Lambda as an object and needs to be returned as an object. The values of the returned object are the record's ID (this is part of the input), the record's status (whether the transformation was successful), and the record itself.

The ID is included in the object from the start and needs to be kept track of. The transformed record data is up to us to create and encode. The record's status is going to be one of three values (at least as of the time of my writing) which signify whether the transformation was successful, unsuccessful, or the record should be dropped/deleted. Unsuccessfully process records go to a specially configured location for this type of log, and we can also set up a CloudWatch Alarm to monitor failed processing attempts for us. Dropped records are dismissed. And successful records move on to their final destination.

After transformation, data is pushed to its final destination. Kinesis has integrations with data analytics and monitoring related services like S3, ElasticSearch, Datadog, and many others. This final piece of configuration contains nuances for each integration, so it is best to read current documentation whenever the integration is set up. I have personally had success pushing to the three destinations that I listed, but I know that there are many others that I am sure work out equally as well.

Since data analytics is more of a necessity for larger-scale applications, I have not used Kinesis much in the context of my personal projects. I have had great success using it for enterprise-level applications though. Data flows easily and near real-time from multiple scattered resources and even different AWS accounts into a centralized destination for viewing, debugging, and analytics purposes. Log consolidation is extremely helpful from a developer and business standpoint.


[Next Chapter: Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)

[Previous Chapter: SQS](/blog/gtbwsa-chapter-15-sqs)
