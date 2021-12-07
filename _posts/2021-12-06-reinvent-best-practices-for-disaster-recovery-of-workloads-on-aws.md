---
layout: post
title:  "re:Invent: Best Practices For Disaster Recovery Of Workloads On AWS"
author: Thomas
tags: [ aws ]
description: My notes about the 2021 re:Invent ARC317 session
---

This is an overview of a session that I went to during [re:Invent 2021](/blog/reinvent-2021). I start by providing the notes I took during the session, and then I will give my take and comments if I have any at the end.

Thursday 11:30

ARC317-R2

Seth Eliot and Jennifer Moran

## Agenda:
- Disaster Recovery (DR) and DR objectives
- DR strategies

## DR and DR objectives
- "We needed to build systems that embrace failure as a natural occurrence" - Dr. Werner Vogels
- Disaster events are natural, technical, or human error
- Planning for how we recover, what it costs, what it looks like, how long it takes
- DR strategy per workload based on business needs and objectives
- Understand the business impact
  - Risk assessment - which risks and how likely are they
  - Business impact analysis - what is monetary, reputational, and customer trust loss
  - Business continuity plan - if something happens, how will the business continue to operate
- Recovery objectives - last known good state
- Time between the last known good state and disaster is "recovery point objective" (RPO)
- Time between disaster and recovery is "recovery time objective" (RTO)
- AZs are close enough that sync replication can happen but far enough apart that a minor disaster should not affect both
  - Each AZ is one or more data centers
  - 90% of workloads are fine with multi-AZ strategy
- High availability (HA) with multi-AZ
  - VPC across AZs
  - Compute is replicated across AZs and uses a load balancer to point to different instances
  - Data (depending on DB engine) can have primary, standby, and read replicas in different AZs
  - S3 and DDB are replicated on their own across AZs
- Disaster event scope: AZ goes out
  - With multi-AZ, there shouldn't be an issue with compute
  - For data, anything that is a single AZ replica needs to be replicated to another AZ
  - DDB use point in time backup
  - Use versioning on S3 buckets
- Disaster event scope: region goes out
  - Have active and passive regions
  - During a disaster, standby becomes active
  - Traffic would need to be rerouted
  - Another option is active-active where both regions are taking on traffic

## Strategies for DR
- Think about DR in layers - not only multi-region, could be multi-AZ then only data backup is multi-region
- Different strategies with varying RPO and RTO
  - From long to short times: backup and restore, pilot light, warm standby, and active-active
- Backup and restore
  - Backups in S3 are default multi-AZ replication
  - For regional redundancy, replicate S3 across regions
- Pilot light
  - Active-passive strategy across regions
  - Both regions are also multi-AZ within the region
  - Passive region is ready but scaled to zero so it's ready to scale up and cheap-ish but it takes longer to go
  - DB would need multi-region replication enabled
  - Would need automated detection with alarms or something and automated scale-up; switch over may or may not be automated depending on comfort
  - He suggests putting a human in the middle unless you are sure you can create ironclad mechanisms because there is a cost to failing over
- Warm standby
  - Pretty much the same thing as pilot light but the passive region has a minimal amount of instances ready to go
    - Greater than 0 but less than production-ready amount
    - It can already accept requests just not at scale
- Multisite active-active
  - Multiple regions up
  - Routing using something like Route 53 with geography-based routing
  - Fully scaled out compute in both regions
  - DDB global tables - all tables accept writes and handle replication
  - "Replication is your friend until it's not" (deletions will be replicated) so use point in time backups

## Failover is one thing, what about failback?
- Two ways to do that
- If possible, blow away original primaries and remake the original DB in the first region out of the failed-over region
- With huge datasets that is not good so you will need to set up some sort of automation to replicate the failover region (which is now handling traffic) to the original region

## I wonder what architectures for fully serverless apps looks like
- He actually went over this
- Route 53 to API Gateways in both regions with Lambdas and global DDB tables
- So pretty much stacks in each region for failover you want with Route 53 handling routing
- Can also use reserved concurrency and provisioned concurrency depending on how you want to handle cold starts

## Game days - simulate failure or event to test systems
- Planning -> execution -> analysis
- Get people involved, give an overview and team member roles

## Links:
- bit.ly/DR_AWS
- wellarchitectedlabs.com/reliability
- bit.ly/aws-dr-blog

## My notes:

I thought that this session gave good alternative architectures compared to cell-based architectures for failover reasons. I do not think that anything I heard here was necessarily groundbreaking or new for me personally, and it was also unfortunate that these architectures were focused less on serverless architectures. This will be a great reference point whenever I directly need it in the future for non-serverless workloads.

I found it interesting that they suggested a simple multi-AZ architecture for most workloads unless explicitly needed. I can imagine that this gets difficult with less-managed (non-serverless) database options. I always get spooked whenever I need to mess with production data, so a managed replicated database would be my go-to for one of these architectures.

