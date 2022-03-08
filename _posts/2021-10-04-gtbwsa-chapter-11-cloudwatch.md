---
layout: post
title:  "GTBWSA Chapter 11: CloudWatch"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS CloudWatch is and how to use it
date: 2021-10-04 09:00:11 # this is used to properly sort the chapters
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
11. [CloudWatch](/blog/gtbwsa-chapter-11-cloudwatch) (You are here)
12. [CloudFront](/blog/gtbwsa-chapter-12-cloudfront)
13. [Route 53](/blog/gtbwsa-chapter-13-route-53)
14. [SNS](/blog/gtbwsa-chapter-14-sns)
15. [SQS](/blog/gtbwsa-chapter-15-sqs)
16. [Kinesis](/blog/gtbwsa-chapter-16-kinesis)
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

---

So far we have discussed foundational services that can help build a serverless application. Now we need to discuss an aspect that is just as important as building, which is observing. While building an application we produce all sorts of logs and in AWS those logs go to a centralized service called CloudWatch. At the same time, the infrastructure that our code is running on produces its own set of logs and metrics which also go to CloudWatch.

Another AWS service that I want to include in this section and discussion is called X-Ray. X-Ray provides tracing, which helps a ton with debugging timing and latency as a system starts getting more complex. X-Ray pieces together what API calls are made to what services and tracks the amount of time that each of those calls takes. It is a super helpful service to piece together what is truly happening within a system and find bottlenecks. We can enable X-Ray on Lambda and other services as a configuration item, and we can trace calls outside of AWS by patching HTTP libraries. There is more documentation about patching libraries online. I do not feel like this guide is the right place to give specifics because it would probably be quickly outdated.

CloudWatch functions similarly to a log aggregating solution like ElasticSearch, Splunk, or Datadog. There are caveats though as with any other service. AWS builds generalized services and common functionality with some being more of a specialty than others, and CloudWatch is not one of their specialties in my opinion. Spending some time in AWS forums will undoubtedly mean crossing paths with someone who deeply dislikes CloudWatch because of how slow it is. From personal experience, I can say that CloudWatch is indeed a bit slow. There is a noticeable lag between when logs are written and when they appear in the console, but unless you are dealing with extremely time-sensitive applications I do not think it is unbearable.

### Logs

One of the first reasons I familiarized myself with CloudWatch was reading logs. I remember making the obligatory "Hello World" Lambda function from a tutorial, invoking it, then needing to find where it logged. The way CloudWatch organizes logs is straightforward once you understand it but can be confusing if you never take the time to properly comprehend the different logging entities.

We will start with "log groups." A log group is simply a collection of logs from a common resource. For example, each Lambda function will have its own log group where all logs are written. For most infrastructure, including Lambda functions, AWS will automatically create log groups whenever logs are written. The logs need to go somewhere, but if we have already created a log group with the correct name, AWS will write the logs to the pre-created log group. A word of caution: always create log groups in your infrastructure as code before AWS creates them on its own. Letting AWS create a log group by itself makes it difficult to regain control from an infrastructure as code standpoint after it has been created.

The reason I suggest creating log groups from the start mostly pertains to pricing and data retention. I brought up a similar point in the S3 conversation that AWS loves to retain our data by default and charges us for it. In the same way, we can set up automatic object deletion in S3, we can set up automatic log deletion in CloudWatch based on log groups. If we let AWS automatically create the log group for us, then they retain logs forever by default even though we can manually change that retention period. And let me tell you, AWS charges a pretty penny to store logs compared to other data storage options.

Owning log groups through infrastructure as code also allows us to easily define resources like subscription filters and metric filters. Subscription filters are a way to treat logs like events and trigger an action based on certain logs being written, but I will talk more about them in the Integrations section below. Metric filters are a way to parse logs and create custom metrics that will be treated like any other CloudWatch metric. I will discuss CloudWatch metrics more in the following section.

Log groups are a container for similar logs, but they are not the termination point where logs are normally written. Within log groups, there are log streams. Where log groups would represent a defined resource like a Lambda function, log streams would represent an instance that was spun up to handle traffic for that resource like an individual virtual machine where the Lambda's code runs. This might seem confusing at first, but after using these entities for a little while, it will all make sense.

Log streams make tracing logs through a system a little difficult because concurrent requests can result in interwoven execution logs. Imagine four virtual machine instances used to automatically scale up a Lambda function receiving lots of traffic. Each one of those virtual machines will write logs to their own log stream in the same log group. Finding which log stream a particular request's logs are written to ends up being a guess and check. Sometimes multiple executions handled by the same instance can intermingle, so determining which logs belong to which request is difficult. Getting around this situation becomes a little easier though with another CloudWatch service called Insights.

CloudWatch Insights is a better way to query logs across log groups. Insights is closer to resembling Splunk since it allows for more complex queries and querying across multiple log groups (or indices for Splunk) at the same time. Each request that hits a Lambda function is given a unique ID called a request ID, and every log written will automatically have the request ID injected into it. Finding and using the request ID is a great way to pick out specific logs from a single execution.

### Metrics

When we build applications, we create logs. When we provision infrastructure, AWS creates metrics. For almost every AWS service, there are corresponding metrics that are produced and available for us to consume. Metrics are the backbone of monitoring, and while they might not play as huge of a role in smaller projects, they are highly depended upon when an application services more and more users.

Most of the metrics are fairly standard and what we might expect to see from a normal monitoring dashboard. Metrics like requests serviced, latency, concurrency, memory consumption, and CPU consumption. The fun part with all of this is combining it together to pull out information. We can graph multiple metrics on the same graph to track what is happening at any given time. We can also take those graphs and make a dashboard out of them for quick reference. And all of this is offered without setting up a dedicated monitoring server and software like teams traditionally would with something like Prometheus or Grafana.

We can create custom, application-specific metrics by using metric filters on log groups like what I mentioned in the last section. These custom metrics can be a bit tricky at first because they use the log filter syntax to parse for correct logs and when they are found a configured "amount" is added to that custom metric. I suggest testing the filter syntax for a metric filter first in CloudWatch Insights before committing to it as the source of truth for a custom metric. These can also be tricky since they rely on log messages to be present in order to function correctly, so I recommend writing tests for specific log messages to prevent someone from changing a message that might seem inconsequential but is necessary for a metric.

That is about all for metrics. It is helpful having some sort of logging and monitoring experience before working with CloudWatch's metrics since the concept is fairly universal, but since metrics are fairly simple to grasp, do not worry if you have little experience.

### Alarms

Now that we have covered metrics we can discuss CloudWatch Alarms. Alarms are continuously monitored by AWS and are based on a single metric or a combination of metrics. The basic idea with alarms is that after a certain threshold or criteria is met, an alarm is triggered, which can subsequently trigger other actions.

Setting up alarms means defining what we want to monitor. An alarm can be as simple as checking that a Lambda's execution duration stays under 500 milliseconds or as complicated as a mathematical formula for determining the state of an entire system. The single metric alarms are fairly straightforward, using metric math does get a little complicated depending on the end goal. Find current AWS documentation for using metric math though since they do still add new functionality to it.

After an alarm is set up we can define what happens when metric data stays below the configured threshold over a period of time and when it stays above the threshold for a given period of time. We also need to tell alarms how to interpret missing data, but that piece is not near as difficult and is highly dependent on the alarm and its action. Whenever the metric crosses above or below the threshold we can trigger some sort of action like autoscaling (not necessary for serverless architectures) or sending an event through SNS (there is a chapter later on about SNS). Does that last action ring any bells?

I mentioned this integration in the Lambda chapter's Integrations section. Integrating CloudWatch Alarms with SNS and Lambda opens up a world of options. The Lambda that subscribes to events can read the event, know what alarm was triggered, then do whatever we want it to. That is the beautiful thing about Lambda. It is the glue that holds together AWS services. We can tell the Lambda to send us an email, a Slack message, an incident management ping, or anything else that could fit into an alarm response workflow.

With that, we have the basics for logging and monitoring down. We know where logs go, where metrics go, how to create custom metrics, how to create alarms, and what to do with those alarms. There is one final related piece to all of this though.

### X-Ray

AWS X-Ray is a standalone AWS service but it ties in well with the CloudWatch logging and monitoring discussion. X-Ray is a tracing solution, which comes in handy the larger a system gets. As more and more services are added to an application, tracing a request through the system can become tricky. Tracing services (AWS is not the only player in this field) is a common debugging tool used to follow a request through multiple services showing the inputs, outputs, and timing along the way.

Most services that I have discussed so far in this guide can be set up to integrate with X-Ray with the flip of a switch. Under the hood, X-Ray adds a header that is passed from service to service and reported back to X-Ray as requests come and go. Each service that is configured with X-Ray and reports back is shown as a "segment". Those segments are pieced together to form a final "trace". A trace is mostly what we are after because it shows the entire picture of which services handled a request, how long they took, and the result.

Other HTTP libraries can be patched to include the X-Ray tracing header. Some of those libraries include JavaScript's `http` and `axios` and Python's `requests`. The benefit of patching those libraries is seeing the full picture end to end. Since most applications nowadays use third-party APIs, X-Ray needs to patch the libraries in order to create segments for the non-AWS services used.

After all of the segments are stitched together to form traces, X-Ray combines the traces for various requests together to form a "service graph". The service graph is an awesome way to visualize a system and see which components interact. Not only is the service graph fun to look at, but it is also super helpful when debugging latency bottlenecks.

### Integrations

In addition to the CloudWatch Alarms integration with SNS and Lambda, I wanted to highlight a few other integrations including one that I have used and had success with. I mentioned subscription filters in the Logs section, and the reason was for easy integration with Kinesis. I have brought up Kinesis before in this guide and a chapter on it is coming up, but for now we can think of it as a pipeline where we can take in data, transform it to our liking, and deliver it to its final destination like S3. We can configure a subscription filter to integrate directly with Kinesis and push logs in batches as they are written. This allows us to push them to S3 for long-term storage that is queryable by Athena, while our log group can be configured with a short retention period to reduce cost.

Subscription filters can also be directly integrated with a Lambda function. While I have not personally used this integration before, I believe it is important to point out some of the possibilities. I imagine that this integration would be helpful for shortcutting an alarm. Instead of creating a metric filter, custom metric, alarm, and an SNS topic, we could simply subscribe a Lambda directly to the logs defined by a filter pattern and react.

### A Note

This is the end of the in-depth chapters. Thank you for hanging in since they were long chapters. If you have come this far, you should now know what IAM, VPC, Lambda, API Gateway, DynamoDB, S3, and CloudWatch are at a high level. With those seven services, you should be able to get pretty far in the AWS world. Everything else should be simpler to learn and understand after understanding these larger, multi-faceted services. The following chapters should be shorter in length but still, build on what was discussed in the earlier chapters.


[Next Chapter: CloudFront](/blog/gtbwsa-chapter-12-cloudfront)

[Previous Chapter: S3](/blog/gtbwsa-chapter-10-s3)
