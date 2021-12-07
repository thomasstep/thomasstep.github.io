---
layout: post
title:  "re:Invent: Beyond Five 9s: Lessons From Our Highest Available Data Planes"
author: Thomas
tags: [ aws ]
description: My notes about the 2021 re:Invent ARC326 session
---

This is an overview of a session that I went to during [re:Invent 2021](/blog/reinvent-2021). I start by providing the notes I took during the session, and then I will give my take and comments if I have any at the end.

Monday 13:45

ARC326

There is also an amazon Builder's Library series for this.

[https://aws.amazon.com/builders-library/beyond-five-9s-lessons-from-our-highest-available-data-planes/](https://aws.amazon.com/builders-library/beyond-five-9s-lessons-from-our-highest-available-data-planes/)

## 10 things to go over:

## 1. Insist on the Highest Standards
- From code reviews to architectural patterns
- "At the scale of billions/second, even 1 in a billion will happen all the time" - Dr. Werner Vogels
- One particular area is deployment safety
  - Minimize the amount of risk with each code change
  - New code means risk
  - Use CI/CD staged deployment process
  - Run tests during promotion and monitor at every stage with automated rollbacks in place
    - We want fast and reliable rollbacks (preemptive rollback on the slightest falter)
- Deployment safety:
  1. Code review
  2. Check-in
  3. Promote to pre-prod
  4. Deploy to prod in widening scope
    1. One box/instance
    2. One AZ
    6. One region
    7. Any further abstractions

## 2. Cattle vs. Pets (How To Manage Systems)
- Use resources as abstractions instead of knowing certain boxes or hosts
- Deployment systems should be able to clone infrastructure between regions
- Operators do (should) not have access to all regions (some are through automation only)
- Use bastioned systems: limited access to recovery via "bastions"
- Cloistered systems: systems with no general-purpose, interactive, or administrative access (like AWS Nitro)
- Reduces the possibility of any untracked changes, improves security

## 3. Limit the Blast Radius
- Design with failure in mind
- Regional isolation
- Zonal isolation (AZs): use zonal isolation to link regions (incoming traffic is routed to healthy AZ)
- Cellular isolation: isolated software stacks
  - Assign each customer to a cell
- Shuffle sharding: each customer is given multiple partitions (or cells) for redundancy
  - If one partition fails, the customer's second partition begins to handle the traffic

## 4. Circuit Breakers
- Load shedding
  - Run load testing to find limits of components then embed load shedders around the bottlenecks
  - Load is shed whenever capacities are being reached
- Bullet counters
  - If a service does look unhealthy, bullet counters preemptively replace it
  - Bullet counters know max amount of nodes that it is safe to replace at once so not every node is replaced at once

## 5. Raising the Bar in Testing
- 1000s of unit tests, 100s of integration tests, preprod environments, roll-forward, and roll-back testing
- AWS contributes ridiculous amounts of investment to testing
- [S2N project](https://github.com/aws/s2n-tls) is a good example of how AWS devs operate since it is open source
- Tests for interoperability, power utilization, etc.
- Beyond testing:
  - Automated reasoning and [Formal Verification](https://en.wikipedia.org/wiki/Formal_verification)
    - Can prove that code is correct for any possible set of inputs (mathematical proofs)

## 6. Lifecycle Management (Credentials Management)
- Common case for outages
- Credentials need to be frequently rotated and expired
  - Using expired or mismatched credentials can be a source of outages
- It is important to decouple expiry and alarming
  - An alarm after expiration is useless
- Use "time to expiry" metrics for anything that expires
- Metrics are both server and client-side
- Alarm before any problem (before expiration)
- Additional protection from fail-safe canary scanning
- Make sure that new credentials are available before expiring credentials

## 7. Modular Separation
- Common example: control plane and data plane
- Kinesis has a control plane API that deals with provisioning a Firehose/instance
  - Data plane is ingesting data
  - Control plane uses async workflows
  - Data plane uses a record store
  - Async workflows and record store are separated so that one going down does not affect the other API (data vs control)

## 8. Static Stability (I missed some of what this actually is)
- The availability of a system relies on the availability of its dependencies
- Managing dependencies
- In the Kinesis example from #7: a metadata store used by both control and data plane APIs could take down both
  - Instead have a metadata store relied on by the control plane and a metadata puller (copy of metadata) relied on by the data plane API
    - Almost like a smaller copy/cache of persistent metadata

## 9. (Principal of) Constant Work
- Biggest risk in any system is change and dynamism
- Dynamism can be new code, new code paths not executed, unexpected scaling
- Risk is often proportionate to rates of change in systems
  - A spike can cause cascading effects in addition to slowing it down in the short term
- Reducing dynamism in systems is a great way to make them simpler
- Run the systems at max load all the time, every time
- Sometimes not the best due to cost but it is a good pattern
- Example:
  - Implementing a workflow that pulls a dynamic amount of data and changes is prone to slowing down as the dataset grows
  - Instead, change a config file that contains all the data in S3 which always takes the same amount of time
  - There is no scaling because it always runs at scale (seems quite cumbersome and inefficient to me)
  - He claims that doing something like this is only a few thousand dollars per year for a couple of thousand config files in S3...
  - I am not sure that this example was a good one

## 10. Retries
- Side effect: thundering herd
  - System is overloaded, clients retry, the system sends failures because it is overloaded
  - Vicious cycle
  - Our goal is to make sure our retries are successful
- Solution: exponential backoff and jitter
  - Distribute calls during a given time
- Solution: client throttle
  - Keep track of the status on the client-side
  - Whenever the failure rate increases, the client should stop retrying
  - As service starts recovering again, the client can start sending and retrying again
  - AWS SDKs have this and it can be enabled through the config

## My notes:

I am 100% onboard with Cattle vs. Pets. I think naming things gets finicky and makes it more difficult to replicate certain resources. My preference is to let CloudFormation generate names for as many resources as it can. For resources that require a name, I try to use a unique string like the CloudFormation Stack's name in the resource's name.

In Limit the Blast Radius they mentioned cell-based architecture, which was brought up in multiple of my sessions. I have a feeling that this is starting to become an AWS best practice instead of simple regional or zonal isolation. For a completely serverless architecture, implementing something like this might not be too difficult to reason through, but I can only imagine the cost increase that a cell-based architecture would bring to a workload using compute resources like Fargate or EC2.

The Circuit Breakers that they brought up were both new to me. I find it interesting that neither one is an AWS service yet unless I do not know about them. They talked about load shedders and bullet counters as if they would need to be custom-created.

I do not completely agree with Raising the Bar in Testing. 1000s of unit tests sounds like a nightmare. I would have personally invested more of that effort into functional or integration tests.

Credential Lifecycle Management is somehow still such a large problem in computing and distributed systems. Why have we not figured out a better, more uniform way of rotating credentials? Maybe that is something I can look further into or work on.

The Constant Work section was confusing to me. I must have missed something. Everyone always talks about autoscaling and efficiency, so it seemed strange to me that they were suggesting purposefully writing less efficient code.