---
layout: post
title:  "re:Invent: Building Next-Gen Applications With Event-Driven Architectures"
author: Thomas
tags: [ aws ]
description: My notes about the 2021 re:Invent API304 session
---

This is an overview of a session that I went to during re:Invent 2021. I start by providing the notes I took during the session, and then I will give my take and comments if I have any at the end.

Wednesday 10:45

API304

Agenda:
- Enterprise integration patterns
- Event-driven architecture
- Taco bell order middleware service

Coupling: integration's magic word
- Coupling is a measure of independent variability between connected systems
- Amount of coupling is a matter of tradeoffs
- Decoupling has a cost in design and runtime (more complexity and latency)
- Location coupling: IP (coupled) vs DNS (decoupled)
- Temporal: synchronous vs asynchronous
- "The appropriate level of coupling depends on the level of control you have over the endpoints" - [Gregor Hohpe](https://www.enterpriseintegrationpatterns.com/)

Looking at various asynchronous models

Synchronous request-response model
- Advantages
  - Low latency
  - Simple
  - Fail fast
- Disadvantages
  - Around failure - receiver failure
  - Any errors in the backend are pushed to the sender
    - Need backoffs, retries, etc
  - Receiver might get throttled under too heavy of a load
    - Thundering Herd

Asynchronous point-to-point (queue)
- Advantages
  - Decrease temporal coupling
    - Things aren't happening at the same time
  - Resilient to receiver failure
    - Doesn't impact the sender
  - Receiver controls consumption rate
    - Buffers against heavy load/thundering herd
  - DLQ for errors
    - When DLQs are an option, heavily consider using them
  - Only one receiver can consume each message
- Disadvantages
  - Response correlation
    - How to determine the result of the request
    - Can use a correlation ID that can be read or put on another queue that the sender is listening to
  - Backlog recovery time
    - If a consumer goes offline, need to figure out how to handle the backlog
  - Fairness in multi-tenant systems
    - Noisy neighbor problem
      - Can sideline chatty tenant
      - Can throttle before the events are placed on the queue

Asynchronous point-to-point (router)
- Sender sends to different channels (I think multiple queues)
- Only listed disadvantages
  - Increases location coupling (need to know where all the channels are)

Asynchronous message router model (event bus)
- Advantages
  - Reduces location coupling
- Eventbridge
  - Events can come from AWS services, integrated SaaS, and our own services
  - Events are created and pushed
  - Rules match events for consumption
  - Personal question: What's the difference between Eventbridge and SNS?

Event-driven architecture
- Events are signals that a system's state has changed
- Events occur in the past e.g. `orderCreated` (notice the past tense verb for naming)
- Events cannot be changed (immutable)
- Decrease coupling by restricting information to key data
- Sparse events vs full-state descriptions
- Sparse events with a lot of subscribers can create a lot of traffic trying to get more context on the event
  - This is because those services will need to reach out to other services to find missing context from the event

Considerations with full-state descriptions
- Event schemas should be backward compatible
  - One-way door
- Cost to calculate values can increase over time (how much data needs to be pulled from various places to create the event)
  - Dollar and latency costs

Choreograph events between domains - loose coupling
- Event uniqueness - we're in distributed systems now which can be nasty
  - Idempotency
    - Events can be delivered multiple times ("at least once" delivery)
  - Use an idempotency key
    - Assigned to the event by the sender to simplify deduplication by the receiver
    - Can be put in metadata
- [Lambda powertools has idempotency](https://awslabs.github.io/aws-Lambda-powertools-python/latest/utilities/idempotency/) library for deduplication
  - Idea is to use an external datastore and a time period over which to respect idempotency
  - Store result with the idempotency key
  - [AWS builder's library](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

Orchestrate a business process within a domain resulting in a published event - tighter coupling
- Suggests using Step Functions for this
- Optimized integrations are the Step Function supported ones
- SDK integrations are newer (I'm guessing not as nice or easy to use)
- Request-response with Step Functions
  - Synchronous request and response for some services then asynchronous Eventbridge publishing
- Wait for a callback (`.waitForTaskToken`) with Step Functions
- Work happens asynchronously and the result is brought back to Step Functions for error or success handling
- Run a job (`.sync`) with Step Functions
- Uses pollers to act synchronously even though it really isn't

Better together: orchestration and choreography
- Orchestration within business domain and choreography to publish results to other business domains

Taco Bell guy takes the stage

Taco Bell's order middleware (no-VPC app)
- Orders come from delivery partners through webhook
- Challenges
  - Handle scale
  - Handle retries and failure
  - Stores being offline
  - Validate product being available
  - Ability to cancel orders

Used choreography approach
- Auth event in API Gateway which pushes an event to Eventbridge
- Event goes to order adaptation in Taco Bell format which creates another event
- A Lambda attempts to accept the order: if fails, hit delivery API with failure; if succeeds, create another event
- Another Lambda consumes the accepted order event and attempts to create an order which hits Taco Bell's established POS API
- Decided this workflow was too complex
- bit.ly/3nUmfbL helped them determine this

Then tried to use orchestration
- API Gateway to Eventbridge still but now Eventbridge starts a Step Function instead of Lambdas sending out all those events
- Wrote Lambdas very lean originally so the conversion to Step Function was easy
- Retries are easier to handle
- Much easier to understand and troubleshoot
- Used callback task token pattern (`.waitForTaskToken`)
  - Order workflow pauses to wait for delivery
  - Delivery partner sends release event when a driver is close
  - Callback token handler sends task token to workflow to resume order/cooking

Development process and CI/CD
- They use [serverless framework](https://www.serverless.com/) with a few plugins
- [Middy middleware](https://github.com/middyjs/middy) for NodeJS, helps pull and cache parameters and secrets
- Gitlab CI/CD
  - Each branch creates a new stack

Testing
- Unit tests on core business logic; not on every Lambda
- Integration tests against live AWS resources
- Mocked out external API calls to facilitate load testing and end-to-end happy path testing
  - Jmeter to pump in events
  - Mocks for delivery API (if order not accepted) and POS API
- Test Step Function workflows, run end-to-end, and validate results

Monitoring/observability
- CloudWatch Logs
  - Started out logging a lot but later tuned it down
- CloudWatch Insights
  - For querying logs at scale
- CloudWatch Alarms

Cost optimization
- "Utilized [express Step Function](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html) nested workflow"
- Removed unnecessary Step Function state transitions
- Used Lumigo to tune Lambda config

Taco Bell and Robbie (the speaker) has a ["This Is My Architecture" video](https://www.youtube.com/watch?v=sezX7CSbXTg)

My notes:

[Lambda powertools](https://awslabs.github.io/aws-Lambda-powertools-python/latest/) has been brought up in multiple sessions by now, so it would probably be worthwhile to familiarize myself with it. Unfortunately, it seems to only be written in Python for the time being, which is not what I normally write my side projects in.

I enjoyed learning about the distinctions between choreography and orchestration and when to use them. I have some experience with Eventbridge, but mostly I have worked with [SNS](/blog/writing-asynchronous-Lambda-functions-with-node) for distributed messaging. Just another topic to add to my research backlog.

This was potentially my favorite session at re:Invent mostly because of Taco Bell's presenter. I like real-world examples and I will definitely purposefully seek them out next year. I was excited when he mentioned that their workload was a no-VPC app. Going fully Lambda-based means that we can shed the overhead of a VPC. It is something that I brought up in my [Guide To Building With Serverless AWS](/blog/gtbwsa-chapter-6-vpc), so it was reassuring to also see it mentioned at a large engineering shop.