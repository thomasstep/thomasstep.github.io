---
layout: post
title:  "Pattern for Storing Time Series Data in DynamoDB"
author: Thomas
tags: [ aws, databases, dev, ops, serverless ]
description: Partition and sort key structure to store time series data in AWS DynamoDB
---

During the design phase before building my [calendar API](https://rapidapi.com/tstep916/api/calendar22), I started researching how to store time series data in DynamoDB. There is not much out in the world in the way of this type of use case. The most common use case for something like this would be IoT devices sending in data for metric aggregation. AWS also has a completely separate database service specifically for time series data called Amazon Timestream. I did not need all the capabilities of a full-blown, purpose-built time series database though, so I came up with a pattern for structuring partition and sort keys on a DynamoDB table that would give me similar capabilities of querying for data based on a time range.

Before I get too deep into this it is worth mentioning that this pattern comes with downsides. Depending on how the keys are structured and how granular some queries can become, a hefty `Scan` might be necessary to retrieve the correct data. This pattern also assumes that all data access patterns are related to time, but GSIs can also be created for secondary access patterns.

To implement this pattern the structure of the keys is a timestamp split at the broadest area of access. For example, the structure I used for my calendar API's partition key was `YYYY-MM-DD` and for my sort key `HH:MM:SS`. This works well for a calendar application because data is normally queried based on an entire day or multiple days. To query for a day's worth of events, I call a `Scan` on a specific day; to query for a week's worth of events, I call multiple `Scan`s on all 7 days; to query for a specific hour though, I still need to call a `Scan` and then add a filter expression to only return certain events. Anything more specific than the smallest unit of the partition day (`DD` in this case) still requires a `Scan` which can be a larger lift than need be. The key, like all NoSQL table designs, is to know your data access patterns.
