---
layout: post
title:  "Concept Dump: DynamoDB"
author: Thomas
tags: [ concept dump ]
description: Demystifying and oversimplifying DynamoDB concepts and terms
---

- DynamoDB - "AWS-owned NoSQL database. Pretty much a big JSON document."
  - Table - "Similar to SQL table. Abstract representation for containing similar data."
  - Item - "Data entry full of arbitrary values known as attributes. Equivalent to a row in a SQL database."
  - Partition Key - "Main identifier for an item."
  - Sort Key - "Secondary identifier for an item."
  - Scan - "Reads through all items in a table and returns those that match certain filter criteria."
  - Query - "Reads through all items with a given partition key and returns those that match certain filter criteria."
  - Single Table Design - "Pattern of putting all required data for an application or service in a single table."