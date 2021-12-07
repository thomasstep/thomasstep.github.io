---
layout: post
title:  "re:Invent: Best Practices Of Advanced Serverless Developers"
author: Thomas
tags: [ aws ]
description: My notes about the 2021 re:Invent SVS402 session
---

This is an overview of a session that I went to during [re:Invent 2021](/blog/reinvent-2021). I start by providing the notes I took during the session, and then I will give my take and comments if I have any at the end.

Wednesday 13:00

SVS402-R1

Resources: [s12d.com/svs402-ri21](s12d.com/svs402-ri21)

## Agenda:
- Thinking in events
- Service-full serverless
- Fabulous functions
- Healthy serverless
- Dev workflow

## Thinking in events
- Lambda wasn't called "serverless" when it was introduced, just an event-driven compute platform
- When building there is often a reliance on synchronous execution which can get you into trouble
- With distributed apps, complexity grows which means extra failure paths
  - So who is responsible for retries with multiple consecutive synchronous requests
- Asynchronous would be synchronous with the client and asynchronous with the subsequent services
- Async friends: SQS, SNS, Eventbridge
  - [s12d.com/events-queues-topics-streams](s12d.com/events-queues-topics-streams)
- Event = a signal that a system's state has changed
  - Commands / APIs are directed to a target but events are facts that others can observe
- Event storming
  - [s12d.com/eventbridge-storming](s12d.com/eventbridge-storming)
- Deciding on event context - fat vs thin ([further discussion in last talk](/blog/reinvent-building-next-gen-applications-with-event-driven-architectures))
  - Sending too many events = more traffic and complexity
  - Sending only metadata = needing to contact an API which introduces a dependency

## Service-full serverless (configuring managed services instead of writing code)
- Use direct service integration from an event source
  - Use Lambda when transforming data not when transporting data
- How much logic is in your code? Too much means Lambda-lith
- How little logic? It is worth it? If not, use API Gateway with direct integration
- Use single-purpose Lambda functions
- Orchestration and choreography as config ([further discussion in last talk](/blog/reinvent-building-next-gen-applications-with-event-driven-architectures))
- The fastest and lowest cost Lambda function is the one you remove and replace with a native service

## Fabulous functions
- Invocation models: sync, async, event source mapping (polls stream/queue)
- Async
  - Lambda has an internal queue
- Event source mapping
  - Internal batch read by service pollers that invoke Lambda synchronously
- Execution environment lifecycle
  - Cold start/init stage
    - Create a new execution environment
    - Download your code/image
    - Initialize runtime
    - Run function pre-handler code
  - Warm start
    - Run function handler code
- AWS optimization up to initializing runtime, our job is to optimize code pieces
- Cold starts occur when
  - Our fault
    - Scaling up
    - Update code/config/new deploy
  - AWS - can't do anything about this
    - Environment refresh
    - Failure in underlying resources
    - Rebalancing across AZs
- Main optimization opportunity is pre-handler code
  - Get DB connections, secrets, import libs, etc.
  - Best practices:
    - Don't load it if you don't need it
      - Optimize dependencies
      - Minify production code
      - Reduce dependent package size
    - Lazy initialize shared libraries
    - Establish connections
    - Reuse state during execution environment reuse
    - Use provisioned concurrency
- Optimizing dependencies
  - Only use libraries that are specific to your workload
    - Certain ones in AWS SDK can significantly speed up depending on how they are initialized- DDB, XRAY
- Lazy initialization
  - Best for code used in multiple Lambdas so not all libraries are loaded on start
  - Set globals for the clients/libraries
  - If the global is not present, then initialize
- Concurrency is the number of requests that your function is serving at any given time
  - One event = one execution environment
- Concurrency across invocation models
  - Sync and async has a one to one mapping between events and instances
  - Event source mapping with queues is one per batch
  - Event source mapping with streams is one per shard which is kind of like a batch
- Reserved concurrency makes sure that a Lambda can always scale up to a certain concurrency limit
  - Can also be used to limit the number of connections to downstream components like DB
- Provisioned concurrency
  - Sets the minimum number of execution environments by pre-warming to reduce cold starts
- Scaling quotas
  - Burst concurrency quota and account concurrency quota
- Can base Lambda on Graviton 2
  - Configuration setting is something like: "target arm64"
- Lambda uses memory and the "power lever"
  - Increase in memory increases CPU and network bandwidth behind the scenes
  - Memory intensive workloads and compute-intensive workloads get a boost this way
- [AWS Lambda power tuning](https://github.com/alexcasalboni/aws-Lambda-power-tuning)
  - Uses Step Functions behind the scenes
  - Can also compare Graviton 2 to x86

## [IaC](/blog/gtbwsa-chapter-4-infrastructure-as-code)
- Make sure to bake in security best practices from the start
  - No `*` permissions
- [Serverless patterns collection on serverlessland.com](https://serverlessland.com/patterns)
- Making templates reusable with configuration
  - Added at stack creation
    - Template and environment params
  - Added at stack creation or runtime
    - Parameter store
    - Secrets manager
  - Added at runtime
    - Appconfig
      - Feature flags, log levels, etc
- Serverless service discovery
  - Create SSM Parameter in the template with value of a name needed
  - Then add that parameter into CloudFormation parameters
    - I'm not sure how this is better than [exports and imports](/blog/cloudformation-exports-and-imports)
- He suggests using multiple delivery pipelines (one for each service) instead of one large pipeline
- Tip: use multiple stacks - split mutable and immutable resources; a single microservice does not need to be in one template
  - This can help speed up deployments

## Healthy serverless
- "Everything fails, all the time"
- Retry and failure handling
  - Need to be able to handle duplicates - idempotency
  - Each serverless service handles this differently
  - Use DLQs where available
- Observability
  - Distributed apps make it difficult
- Observability is monitoring more than just failures
  - Is it working correctly?
  - What's the usage?
  - What's the business impact?
  - When was this code deployed to prod?
- Use structured logs
- [CloudWatch embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)
  - It is asynchronous so it will not create extra overhead
  - [s12d.com/cwl-emf-client](s12d.com/cwl-emf-client)
- Query logs with CloudWatch Insights
  - [s12d.com/loginsights-examples](s12d.com/loginsights-examples)
    - Lambda specific queries
- CloudWatch dashboards
- Lambda extensions
  - Easier to integrate existing tools
  - Can capture diagnostic info
  - Automatically instrument your code
  - Fetch config
- [CloudWatch Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started.html) - extra metrics on top of defaults
- Lambda powertools

## Development workflow
- Traditionally: write, save, run, validate
- Do not try to emulate native services, do mock event payloads (for unit testing)

## My notes:

I was surprised that barely any of this information was new to me. It makes me hope that I would be considered an "advanced serverless developer." I have seen stress on structured logging a couple of times during this week which makes me think that I should bring that back as a big key. Also while I did not necessarily enjoy this session as a whole, I did like the rapid-fire list of topics in the "Healthy Serverless" section.

