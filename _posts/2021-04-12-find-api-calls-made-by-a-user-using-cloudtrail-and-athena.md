---
layout: post
title:  "Find API Calls Made By an IAM User Using CloudTrail and Athena"
author: Thomas
tags: [aws, ops]
description: Find least permissions based on CloudTrail data
---

The other day I had a situation in which I needed to restrict permissions on a given IAM user. That IAM user had temporarily been given fairly open permissions but I had the intention of coming back around and tightening those up. I could have very easily gone through the services that I knew it used and added a wildcard for the service similar to `s3:*`, but I wanted to be a little slicker with my solution.

CloudTrail came to mind since I knew that I would be able to see API calls the user had made through the event history and then restrict based on that. However, CloudTrail can be a little verbose, and on top of that, I noticed a nifty little button about making an Athena table based on a trail.

I had heard of Athena before, but I had not used it. It was one of those services that I always intended on learning about but had never carved out time for. This was my chance.

Athena works by building a SQL-like table and filling it with data based on files in an S3 bucket. It's our job to point it towards the S3 bucket and define the schema, and it's Athena's job to provide a way to query that data using SQL. Athena is also serverless, which means it is that much easier to get up and running and I only needed to pay when I used it.

The reason Athena and CloudTrail work well together is that CloudTrail can be set up to automatically pump data into an S3 bucket and the well-defined schema of those trails makes it easy to set up in Athena and query. From the CloudTrail console, there is even a nifty little code snippet to help set the Athena table up. It looks like this.

```sql
CREATE EXTERNAL TABLE [TABLE_NAME] (
    eventVersion STRING,
    userIdentity STRUCT<
        type: STRING,
        principalId: STRING,
        arn: STRING,
        accountId: STRING,
        invokedBy: STRING,
        accessKeyId: STRING,
        userName: STRING,
        sessionContext: STRUCT<
            attributes: STRUCT<
                mfaAuthenticated: STRING,
                creationDate: STRING>,
            sessionIssuer: STRUCT<
                type: STRING,
                principalId: STRING,
                arn: STRING,
                accountId: STRING,
                userName: STRING>>>,
    eventTime STRING,
    eventSource STRING,
    eventName STRING,
    awsRegion STRING,
    sourceIpAddress STRING,
    userAgent STRING,
    errorCode STRING,
    errorMessage STRING,
    requestParameters STRING,
    responseElements STRING,
    additionalEventData STRING,
    requestId STRING,
    eventId STRING,
    resources ARRAY<STRUCT<
        arn: STRING,
        accountId: STRING,
        type: STRING>>,
    eventType STRING,
    apiVersion STRING,
    readOnly STRING,
    recipientAccountId STRING,
    serviceEventDetails STRING,
    sharedEventID STRING,
    vpcEndpointId STRING
)
COMMENT 'CloudTrail table for [S3_BUCKET_NAME] bucket'
ROW FORMAT SERDE 'com.amazon.emr.hive.serde.CloudTrailSerde'
STORED AS INPUTFORMAT 'com.amazon.emr.cloudtrail.CloudTrailInputFormat'
OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION '[S3_BUCKET_URL]'
TBLPROPERTIES ('classification'='cloudtrail');
```

There are a few fields that we need to populate: `[TABLE_NAME]`, `[S3_BUCKET_NAME] `, and `[S3_BUCKET_URL]`. I created a new S3 bucket for this and I just named the table whatever I was feeling on that day. Instead of querying a trail that was set up to push to a specific S3 bucket, I simply downloaded existing events and manually uploaded them to the S3. This is where my approach probably differed from what I believe is normally done since it seems like Athena is typically set up once and queries can be run using continually evolving data being pushed into a bucket by CloudTrail. Since Athena queries are charged by the amount of data they are searching through, this proved to be a more cost-effective method for me at the time though. I also did not need to look through every API call, only the ones made by the specific IAM user in question.

To download the dataset for that specific user, I went to the `Event History` tab, filtered by `User name` on the user's name, and clicked `Download events` to download the data as a CSV. After I had that file, I reuploaded it to my new S3 bucket, set up the Athena table using the aforementioned query, and could start looking over my small subset of CloudTrail logs.

To get straight to the chase, the query I used to find all of the API calls made by that user looked like this.

```sql
SELECT DISTINCT eventtypes,
    eventsource,
    eventname
FROM [TABLE_NAME];
```

This query produces the services and API calls used for the IAM user in question. Since my goal was to give the IAM user the least amount of permissions it needed to operate as it had been, I was able to restrict those permissions based on the result of this query.
