---
layout: post
title:  "GTBWSA Chapter 9: DynamoDB"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS DynamoDB is and how to use it
date: 2021-10-04 09:00:09 # this is used to properly sort the chapters
---

This is a chapter from the Guide To Building With Serverless AWS that I wrote. For more information about the guide's intent and focuses, please read the Introduction Chapter.

Table of Contents:

1. [Introduction](/blog/gtbwsa-chapter-1-introduction)
2. [Serverless Introduction](/blog/gtbwsa-chapter-2-serverless-introduction)
3. [Introduction to the Cloud and AWS](/blog/gtbwsa-chapter-3-introduction-to-the-cloud-and-aws)
4. [Infrastructure as Code](/blog/gtbwsa-chapter-4-infrastructure-as-code)
5. [IAM](/blog/gtbwsa-chapter-5-iam)
6. [VPC](/blog/gtbwsa-chapter-6-vpc)
7. [Lambda](/blog/gtbwsa-chapter-7-lambda)
8. [API Gateway](/blog/gtbwsa-chapter-8-api-gateway)
9. [DynamoDB](/blog/gtbwsa-chapter-9-dynamodb) (You are here)
10. [S3](/blog/gtbwsa-chapter-10-s3)
11. [CloudWatch](/blog/gtbwsa-chapter-11-cloudwatch)
12. [CloudFront](/blog/gtbwsa-chapter-12-cloudfront)
13. [Route 53](/blog/gtbwsa-chapter-13-route-53)
14. [SNS](/blog/gtbwsa-chapter-14-sns)
15. [SQS](/blog/gtbwsa-chapter-15-sqs)
16. [Kinesis](/blog/gtbwsa-chapter-16-kinesis)
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

---

Using API Gateway and Lambda together opens doors to a multitude of possibilities, but there is a missing piece in that simple integration which is persistent data storage. DynamoDB is my preferred service to store data just as it is for numerous other developers all around the world.

A traditional alternative to DynamoDB is a NoSQL database like MongoDB but MongoDB is not even "traditional" to most people. An old-school alternative to this is a SQL database like MySQL or PostgreSQL. The goal here is to allow our application to store user data without needing to rely on our application servers. DynamoDB and SQL databases share a common purpose of durably storing data, but be warned, modeling that data and the operations that can be performed on that data are completely different. DynamoDB is just as different from a SQL database as it is from MongoDB, so prior knowledge in using NoSQL databases does not necessarily preclude someone from the learning curve that is DynamoDB.

Before I go too in-depth with DynamoDB, I want to explain in simple terms how I use it. DynamoDB is marketed as a key-value and document database that is lightning quick at any scale. This is a purpose-built data store that runs some of Amazon's services, so it naturally has to be highly available, durable, and fast since they pride themselves on a low latency user experience. All of those benefits mean that there are some downsides though like trickier data modeling and inflexible querying. Luckily, there is enough of a community surrounding this technology that there are some methods and best practices to mitigate some of that downside.

While DynamoDB is a database when we interact with the service we do not provision a database. We can ask DynamoDB for new tables, but AWS handles the database cluster, autoscaling, throughput, and other lower-level database configuration. While this might seem like a downside to some I view it as an upside. I would rather provision a table and start storing data than have to worry about piecing together a database cluster.

### NoSQL

I assume that most people who have stumbled across this guide will have had some experience developing applications or provisioning infrastructure, and my guess is that databases have crossed anyone's path in the software and technology realm. The majority of database engines are SQL engines so switching from something like PostgreSQL to SQLite would not be too difficult since most of the querying concepts are the same. However, switching to a NoSQL database might involve some level of challenge.

The main difference between SQL and NoSQL databases is that NoSQL databases rely on querying by keys instead of any arbitrary column that could be matched like in SQL. While I do not want to focus on the differences between the two styles of databases, I do think it is important to point out that they are completely different ways of storing and retrieving data.

### Partition Keys, Attributes, and Scans

That main difference also brings up one of the most relevant observations I have had about DynamoDB, which is that all data needs to be queried by its key. This was one of the disadvantages and stickiest points for me while I was learning how to use DynamoDB. With a SQL database, I could match any data with a WHERE, but with DynamoDB, I always want a key (also called a partition key) to retrieve data. There are ways to grab items in bulk, but those methods are much more inefficient compared to querying by key. Using a partition key that identifies an item gives us the option to operate on that single item, and we have access to normal data operations like creating, reading, updating, and deleting those items.

Creating and operating on an item through its partition key is easy enough, but there is one aspect that I want to bring up about these simple key-value items before we go more in-depth. Thinking of keys is easy enough, but the way that DynamoDB handles the values associated with those keys is a little more difficult. Particularly there is no schema and the types are built into the value itself. I like to think of the value as a simple object or dictionary. This way of thinking makes not having a schema nothing out of the ordinary. In languages like Javascript or Python, we also do not need to declare the types of the values we want to store before we store them.

The trickier piece of DynamoDB values is encoding the data types of attributes. There are a select few data types including strings, numbers, booleans, lists, and maps, to name a few. The value of an attribute needs to be properly encoded for DynamoDB to accept it. One easy way around this is to use the AWS SDK for Javascript, which includes something called the Document Client. Document Client allows us to pass in a normal Javascript object and the client will encode the payload for us depending on the value's native Javascript type. There is more documentation online, but I highly recommend using Document Client over encoding the payloads yourself.

I would like to go a little deeper into how DynamoDB works before discussing bulk item retrieval methods. DynamoDB can scale horizontally which means it can take on a much larger scale than a SQL database. Because of its horizontal scaling, the data stored in a DynamoDB table is not necessarily all stored on a single machine. That data is "load balanced" in a way such that no single machine is taking all query requests (or at least that is the intent). The way that the data is partitioned is using an item's primary key, also known as its partition key. For this reason, using a partition key with DynamoDB is the fastest way to retrieve data, in the same way, using a hash map key is faster than iterating through all of the hash map's values looking for a particular match. One way that I think about DynamoDB is simply that: a huge distributed hash map.

With that knowledge, we can deduce why there is query inflexibility within DynamoDB. Querying without a partition key means DynamoDB has to search through all of a table's items to find items that match what we are looking for. It simply is not optimized for that kind of search and instead gains benefits when searching by key. Having a key to query by means DynamoDB will know exactly which machine the item is stored on and the machine, or partition, will know exactly where to find the data.

The `Scan` operation is one type of bulk item retrieval that DynamoDB offers. A `Scan` looks through all of the items in a table and returns those that match specific filters. Where a direct read of an item by partition key would result in a single item returned, a `Scan` can return multiple items based on partition key patterns or other attribute patterns. This is one way to get around the inflexibility of DynamoDB table design, but I highly recommend against using this operation. Since a `Scan` reads through all items in a table, we have to pay for each one of those read operations which adds up quickly. Reading each item in a table means that the cost (in time and money) of a `Scan` increases as the items in a table increase. If a `Scan` is required, try to make the operation run only periodically instead of per request.

### Sort Keys and Queries

It is possible to get far with only partition keys but eventually, data modeling and retrieval options will get too constrained using only the partition key. Another layer on top of partition keys is sort keys. Sort keys are also known as secondary keys and they are a way to store multiple items under the same partition key. What this means is that we can tell DynamoDB which items we are looking for with more granularity.

With the introduction of sort keys complete, there is another DynamoDB bulk retrieval operation that is worth bringing up to highlight a little more flexibility. A `Query` operation allows us to look through all of the items under a given partition key. `Queries` are a compromise that tries to inject more query flexibility while also keeping speed a top priority.

As a side note, so far when I have said "query" I mean simply requesting DynamoDB for data. With the introduction of the `Query` operation, I can see how the concept of querying and the DynamoDB-specific operation of `Query` could get confusing, so I will capitalize the operation (`Query`) and keep the concept lowercase (query).

`Query` operations in DynamoDB are similar to `Scans`, but instead of reading all items in a table, a `Query` will only read the items with a given partition key. This adds flexibility to queries and reduces the number of read operations in comparison to `Scans` because we only read a subset of items in a table. For a `Query` to properly work, we need to pass it the partition key for the items we want to read through and any filters or expressions we want to match the secondary key or attributes against. I like to think of a `Query` like a miniature `Scan` on a partition key instead of an entire table.

One strategy that developers including myself have used to create useful sort keys for `Queries` is concatenating multiple pieces of identifying information to create a sort key. Conventionally, that information is joined with hash signs (`#`) to create some sort of division that uses an uncommonly used character.

For example, let's say we wanted to keep track of a user's orders and we wanted to be able to retrieve completed orders for given time bounds. For this example, I will assume that there are different states that an order can be in such as pending or completed. Our partition key could be an identifying piece of the user's information like a unique ID or email address. Our sort key could be the state that an order is in, appended with a hash (`#`), appended with a timestamp. This allows us to `Query` our given partition idea looking for sort keys starting with the order state and beginning of the desired time and ending with the order state and end of the desired time.

Some of the compromises that come with DynamoDB are brought out with that example and are worth discussing. The `Queries` that can be made on those items with that data model are limited. For example, it would be difficult or expensive to `Query` for all types of orders on a given date since `Queries` do not have an "ends with" filter. It would also be difficult to find an order based on its order ID since the order ID is part of neither the partition nor the sort key. These are compromises that can be worked around with properly defined access patterns and a data model to fit.

`Querying` for all order types based on timestamps would be difficult. The brute force method would involve `Querying` for all possible states between a timeframe, which is similar to the original example with the added expense of performing this operation for every potential state. While a brute force effort could work, this is a better example of needing to clearly define access patterns before modeling our data. It should be known that this type of access pattern would not be as well supported as others.

`Querying` for an order based on an order ID could also be worked around by adding that order ID to the beginning of the sort key. The downside to this approach is that locating orders would require an order ID from the start instead of less specific information like the state of the order. Again, these are known downsides that should be discussed before implementing a data model.

I have found success by thinking of partition keys and sort keys as a form of scope that narrows. A partition key needs to be the largest and highest order abstraction in a data set. It needs to be in the highest order because it is the entry point for us `Querying` our dataset. After the partition key is determined, I like to create sort keys in order of narrowing scope. In the original example, the partition key of user ID would always need to be known and is the highest order abstraction in our dataset. Luckily, if a user is logged in, then we will be able to grab their ID from the context of the user's request. After that, the sort key was created with the order state being the next most narrow scope followed by the timestamp based on the access pattern. The narrowing scope of a sort key needs to be factored into the access pattern we want to enable.

DynamoDB table design for keys and proper access patterns is a deep deep hole. There are books written entirely about this subject that have the scope to go into much more depth than I want to in this guide. As your familiarity and use case complexity increase I suggest seeking out that information. For now, this should be a good primer and get you on your way to working with DynamoDB.

### Global Secondary Indexes and Data Duplication

Access pattern options are limited based on partition and sort keys. DynamoDB does offer another feature to help get around access pattern deficiencies though. Global secondary indexes (GSI) are a way to create a new set of partition and sort keys. The idea is that DynamoDB will automatically replicate data but use different attributes to create the partition or sort keys and fill those new items with whatever attributes are configured to copy over.

What this means is that we are not entirely constrained to the limited access patterns offered by a single partition and sort key combination because we can create multiple combinations based on the same set of data. As of yet, I have rarely used GSIs, but I do know that they have their place especially in more complex services. This feature would not be offered if there was not a valid use case.

Global Secondary Indexes also highlight another mindset shift for data storage which is not giving effort to data deduplication. Rick Houlihan is an idol in the data world, and he works on DynamoDB at AWS. He has given priceless talks at AWS re:Invent (which I heavily suggest watching to learn more about DynamoDB), and one of the more interesting pieces of one in his talks was about the evolution and pricing in computing that led to NoSQL. He explains that at first storage was expensive, but now storage is cheap and commoditized. SQL databases were great for expensive storage because that data only needed to be written to disk once and then provided numerous ways to query against itself. Cheap storage dissolves that requirement, so duplicating data is feasible from a financial standpoint.

Duplicating data in a SQL database is considered a bad design, but duplicating data in DynamoDB is natural and supported in native features. Instead of issuing multiple queries to retrieve all the data needed in an operation, duplicate the data in a way that only requires one `Query`. While this might sound counterintuitive it is an AWS best practice.

### Global Tables

While we are on the subject of replicating data, there is a DynamoDB feature that enables geographically diverse database replicas. DynamoDB Global Tables handle replicating data written in one AWS region to all other AWS regions in which the Global Table configuration is set up. The table name and APIs are the same as a non-replicated DynamoDB table. Using my suggestion of interacting with DynamoDB through the SDK Document Client means that enabling this feature is as simple as configuring it in DynamoDB and pointing the SDK to the region closest to where the code is deployed.

While Global Tables are not always necessary, growing applications with a global user base will most likely need it or at least see a performance benefit from using it. Deploying API Gateways and Lambda functions into the regions where a Global Table is replicated means that we can give users the best latency by bringing a copy of our application to them. Since our Lambda functions should be written without state, DynamoDB is the only data that we need to make sure is consistent, and luckily, Global Tables offers us that consistency out of the box. Keep in mind though that we are talking about eventual consistency. Amazon (and therefore AWS) prefers low latency which is why Global Tables replicate asynchronously. For more information about what that means, I suggest looking into the CAP theorem.

### DynamoDB Streams

I have brought up event-driven architecture already in this guide, and I want to extend that discussion to DynamoDB. DynamoDB Streams is a feature that helps enable event-driven architecture and is necessary for Global Tables. Streams are a way to emit events about data manipulation on a table. Global Tables use Streams to know when data needs to be replicated, which is understandable once you think about it.

Streams can be thought of as SQL triggers in a sense. Whenever an event occurs on an item in a table, a record is written to the DynamoDB Stream which can be consumed by another service such as a Lambda function. This further enhances the possibilities of what a fully serverless architecture can become. The Lambda that reads from a Stream can trigger a notification for another Lambda function to run asynchronously, push that data to long-term storage, or anything else we could come up with. As I have mentioned before, Lambda is the glue between AWS services, and Streams are another example of just that.

While I have not come across a use case for using Streams in my projects, I feel that it is worthwhile to bring it up. A use case that I am keeping my eye out for is something along the lines of triggering an asynchronous workflow based on specific written data from a Stream instead of triggering that notification or event from a critical path Lambda. This method would reduce latency by not needing to produce the event in a user-facing Lambda, but instead produce the event based on data written to DynamoDB.

### Integrations

Now that we have discussed Lambda, API Gateway, and DynamoDB, we have the basic underpinnings for building serverless application infrastructure. These three services can take anyone a long way, and in the serverless AWS world, these are the trifecta of serverless technologies. Lambda integrates well using DynamoDB as its datastore. Since they are both quick and flexible pieces of infrastructure, a Lambda function can be spun up with a DynamoDB table much quicker than more traditional infrastructure like an EC2 instance and an RDS cluster. We simply need to tell AWS that we want a new lightweight compute platform and database table and AWS handles the rest. Since the AWS SDK is built into Lambda runtimes, we only need to import DynamoDB SDKs to start building with both technologies.

I briefly mentioned using DynamoDB as a cache in the Lambda section, and I wanted to expound more on that here. First, DynamoDB is not a cache, it is a database. There is a native service called DynamoDB Accelerator (DAX) which is a purpose-built, in-memory cache that plugs right into DynamoDB. However, there is no such thing as a serverless cache (at least as of me writing this). The closest that I have come to seeing a serverless caching solution is simply using DynamoDB. It comes with single-digit millisecond latency, which my projects have shown me to be true in practice. When the scale that DynamoDB can reach is taken into consideration, that kind of speed is wild. So while it might not be an actual cache, DynamoDB is probably the fastest and most durable datastore out there while also being fully managed and priced like a real serverless product.

The final integration that I want to bring up is the direct integration with API Gateway that I mentioned in the API Gateway section. API Gateway can integrate with quite a few other AWS services out of the box, but the DynamoDB integration is a useful one. I have seen projects that involved writing code for a Lambda function that sat between an API Gateway and DynamoDB table that read in the API Gateway data and wrote it to DynamoDB, which could have been completely circumvented with this integration. Using DynamoDB as a cache can also be slightly easier by using an API Gateway in front of that "cache." I have personally used a setup of an API Gateway directly integrated with DynamoDB to be used as a common cache. It functioned as its service because I used a Lambda on a cron to populate the DynamoDB table so that the values were always updated whenever another service needed that "cached" data.

And just like that, we are done with our DynamoDB discussion. Since we have discussed the serverless trifecta, anyone who has read this far should have a decent foundation for creating serverless application backends. This might be the extent of the necessary discussion for the majority of engineers out there, and if that is the case for you, congratulations. I hope that you can take this knowledge, stitch it together in your own unique way, and create wonderful services.


[Next Chapter: S3](/blog/gtbwsa-chapter-10-s3)

[Previous Chapter: API Gateway](/blog/gtbwsa-chapter-8-api-gateway)
