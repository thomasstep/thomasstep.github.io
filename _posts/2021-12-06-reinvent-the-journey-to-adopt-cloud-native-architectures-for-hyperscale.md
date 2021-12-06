---
layout: post
title:  "re:Invent: The Journey To Adopt Cloud-Native Architectures For Hyperscale"
author: Thomas
tags: [ aws ]
description: My notes about the 2021 re:Invent ARC314 session
---

This is an overview of a session that I went to during re:Invent 2021. I start by providing the notes I took during the session, and then I will give my take and comments if I have any at the end.

Tuesday 14:00

ARC314-R1

Agenda:
- There are certain best practices and architectures when reaching this scale
- Why do you need a journey to adopt cloud-native architecture?
- How to address hyperscale
  - How to improve resilience and scale in monoliths
  - How to leverage domain-driven design for decomposing monoliths to achieve independent scaling of services

- "Hypergrowth happens at the steep part of the growth curve after the initial product or service offerings are defined and before the business matures"
  - Curve looks like an S so hypergrowth would be the steepest gain in revenue (revenue y-axis, time x-axis)
- Key challenges: time to market, scaling limits, inflated blast radius, increased dependencies, and complex deployments
  - Won't touch on all but two stand out: scale (start with monolith then hit a bottleneck) and inflated blast radius

- Journey to adopt cloud-native architectures
- They have published four blogs so far in a series with the name "The Journey To Adopt Cloud-Native Architectures For Hyperscale"
  - go.aws/32cCgCD
- It's a journey so you need to have a long-term vision/goal
- Focusing on cell-based architecture and domain-driven design (they haven't published these two concepts yet)

Cell-based Architecture
- Attempt at decentralizing arch
- Instead of a load balancer routing to multiple nodes have a "cell router" that routes to a cell that contains a load balancer with multiple nodes
- A cell should have minimum dependencies (no shared infra)
- A cell is a wholly contained application stack
- An AZ can be considered a cell
- Geo-based cells (AZs and regions) or shuffle sharding
  - Depends on what type of failure you are trying to avoid and what the business requirements are
- "Cell router" can be Route 53 based on geography-based routing
  - For shuffle sharding, you would need to create your own router, but keep in mind that it should be resilient in the same way the cell-based arch is
  - Should have very little logic, only route to shard/cell
  - Needs to be predictable
- Benefits of cell-based:
   - Control of scale
   - Reliable and resilient
   - Easier error detection
   - Contained blast radius
- Tradeoffs for fine-grained or rough-grained cells in terms of cost, complexity, resiliency
- Check out Route 53 Application Recovery Control

Domain-driven, cloud-native architecture
- "Monolith is not a bad design if it meets your needs"
- When are microservices right?
  - When you need to independently scale certain features
  - When multiple teams are collaborating on the same workload
  - When you have different resiliency requirements for different service components
- Microservices challenge:
  - Service boundaries
  - Data consistency and integrity
  - Network congestion and latency
  - Monitoring and managing complexity
  - Build, deploy, and run at scale
  - Decomposing a monolith -> domain-driven design
- DDD (domain-driven design)
  - Focus on end-to-end customer journeys
  - Ubiquitous language understood by domain experts and tech experts
  - Two types of DDD:
    - Strategic DDD ensures arch remains focused on business capabilities
    - Tactical DDD provides design patterns to build microservices
- How to approach this:
  - Identify business domains
  - Use customer journeys (bounded contexts)
    - Don't create too many microservices (more services means more latency)
  - Prioritize domain
    - Invest first in core domains, see how it goes, then move on
  - Apply tactical DDD
  - Identify microservices iteratively
    - Think about patterns
    - Don't always create a new microservice
    - Reuse what has already been created
  - Measure outcomes and apply patterns
    - Define success criteria (higher throughput, decreased latency, etc.)
- Example eCommerce company
  - Customer logs in
  - Customer finds a product that fits their budget
  - Product added to cart
  - Select payment method
  - Customer provides shipping information
    - Need to validate
  - Order submitted and sent to back-office for fulfillment
  - Each one of these is a domain event
- In his example, he prioritizes ordering
  - Should ordering be one microservice or multiple?
    - Could be multiple: checkout, shipping address validation, order pricing and taxation, order qualification, order management, order notifications
    - Could have also been a single service
  - Now apply tactical DDD
    - Checkout microservice has a root entity of cart and a value object of item
    - 3 layers: business logic, application, infrastructure
    - Identify data access pattern
- Start small, learn, and iterate: take functionality out of a monolith, put into microservice
  - Sounds like the strangler pattern

My notes:

Once again cell-based architectures came up, so this is a topic to look into and at least make sure would be possible with architectures moving forward.
