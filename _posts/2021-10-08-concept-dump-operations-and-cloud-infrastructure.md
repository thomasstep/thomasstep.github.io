---
layout: post
title:  "Concept Dump: Operations and Cloud Infrastructure"
author: Thomas
tags: [ concept dump ]
description: Demystifying and oversimplifying operational and cloud infrastructure concepts and terms
---

- Operations and Cloud Infrastructure - "Data centers full of servers and hard drives that expose those resources to us."
  - Load Balancer - "Distributes requests to servers without stressing out a single one."
  - Database - "A way to store data without ever (hopefully) losing it and be able to request that data programmatically."
  - Cache - "A way to store data temporarily since it could be lost if the cache crashes. Much faster than a database just less reliable."
  - File Storage - "A way to permanently store files of arbitrary length or type."
  - CDN - "Bunch of file servers that sit close to end-users which help speed up websites."
  - Compute Resources - "Server that can run our code."
  - DNS (Domain Name Service) - "Mappings between domain names and either other domain names or IP addresses."
  - API (Application Programming Interface) - "Exposes a set of functionality or code that can be called from other code."
  - Serverless - "Cloud-based service that we do not have to manage or configure."
  - Queues - "Store and move data through a system to compute resources that can process it without a huge priority on time/latency."
  - Event-Driven Architecture - "System architecture that focuses on using generated events from a user or from our system to trigger processing."
  - Managed Service - "Service that has most configuration and routine maintenance done by the service provider (not us)."
  - Throughput - "Amount of events that can be processed in a given period of time."
  - High Availability - "System that will not go down if one or several of its servers go down."
  - Fault Tolerance - "System that knows how to handle a fatal error and self-heal."
  - Asynchronous Processing - "Computing is done without a user needing to wait on it."
  - Distributed Systems - "Group of code, servers, and services that work together without being on the same physical machine."
  - Microservices - "Small pieces of code that run quickly and are reusable running on lots of small servers."