---
layout: post
title:  "Concept Dump: System Design"
author: Thomas
tags: [ concept dump ]
description: Demystifying and oversimplifying system design concepts and terms
---

- Distributed System Design - "Patterns for creating and piecing together services that make up a system."
  - [CAP Theorem](https://en.wikipedia.org/wiki/CAP_theorem) - "Consistency, Availability, Partition Tolerance. You can only have two of the three."
    - Consistency - "Reading following a write will return the value of the write."
    - Availability - "Every request is responded to."
    - Partition Tolerance - "Everything still works despite a faulty network."
  - [PIE Theorem](https://www.alexdebrie.com/posts/choosing-a-database-with-pie/) - "In a distributed system, we absolutely need Partition Tolerance, which means we now need to choose between Consistency and Availability (choose Consistency). Pattern Flexibility, Infinite Scale, and Efficiency are the new three choices that only allow us to have two."
    - Pattern Flexibility - "Database that enables querying for any data based on an arbitrary combination of identifying information."
    - Infinite Scale - "Database that can easily enlarge itself usually by scaling horizontally. (See below for horizontal scaling.)"
    - Efficiency - "Database that can respond to queries quickly at any amount of scale."
  - Databases - "Store data without ever (hopefully) losing it and be able to request that data programmatically."
    - NoSQL - "Schemaless data storage usually with better scaling capabilities but less query flexibility."
    - SQL - "Data storage using columns and rows that offers ACID compliance and query flexibility."
  - Load Balancer - "Facilitates horizontally scaling servers behind it by distributing requests evenly."
  - CDN - "Decreases latency for serving static files."
  - Security - "Keeps the h4ck3rz out."
  - Scaling Compute - "Allows us to accept higher amounts of traffic."
    - Horizontal - "Adding more servers."
    - Vertical - "Giving existing servers larger resources like CPU and memory."