---
layout: post
title:  "GTBWSA Chapter 10: S3"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS S3 is and how to use it
date: 2021-10-04 09:00:10 # this is used to properly sort the chapters
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
9. [DynamoDB](/blog/gtbwsa-chapter-9-dynamodb)
10. [S3](/blog/gtbwsa-chapter-10-s3) (You are here)
11. [CloudWatch](/blog/gtbwsa-chapter-11-cloudwatch)
12. [CloudFront](/blog/gtbwsa-chapter-12-cloudfront)
13. [Route 53](/blog/gtbwsa-chapter-13-route-53)
14. [SNS](/blog/gtbwsa-chapter-14-sns)
15. [SQS](/blog/gtbwsa-chapter-15-sqs)
16. [Kinesis](/blog/gtbwsa-chapter-16-kinesis)
17. [Developer Tools Family](/blog/gtbwsa-chapter-17-developer-tools-family)
18. [Serverless Containers](/blog/gtbwsa-chapter-18-serverless-containers)

---

Amazon Simple Storage Service (S3) is a persistent file storage service and a really good one at that. While I am not privy to the actual inner workings of Amazon data centers, I imagine S3 is simply a huge cluster of hard drives spread out across every data center that Amazon owns. The generic name for a file storage solution like S3 is called Network Attached Storage (NAS), but I can not imagine another company having a storage solution quite as large, durable, or sophisticated as S3. I would not want to begin taking a guess at how much data is stored in S3 across all of the applications using it. AWS often touts that S3 has eleven nines of durability which means a file will almost never be lost.

When we interact with S3, we do so using foundational entities called "buckets" and "objects". Each S3 bucket is identified by a globally unique name (more on that later) and carries its own policies and isolated file structures from other buckets. I like to think of a bucket as a single hard drive although in actuality it is most likely a virtual drive or partition. However, that hard drive can scale from bytes to terabytes in a matter of seconds, practically never lose files, and provides quick reads and writes. Files are represented by their foundational entity called objects and can naturally be created, read, updated, and deleted. At its core, that is all S3 does; it reads and writes files. But just like any other AWS service, there are more options and features that can be enabled to make S3 do wonderful things.

### Versioning

Before we get too into the weeds, I want to bring up versioning. Most AWS services, including S3, that take in data will happily retain that data by default and charge us for storing it. There are ways to automatically delete old data that is not being used, and S3 versioning helps us do that. Another service that loves to retain data is CloudWatch, and I will also bring up a strategy to reduce storage costs with that service.

Versioning objects (or files) in S3 is useful outside of automatic deletion to save space and money. By enabling versioning we tell the S3 bucket to retain the history of a given object by name including when it was deleted. If an object is overwritten, we can still download or restore an old version. If an object is deleted, the deletion becomes a simple marker in time without deleting the entire history of the object.

I also prefer versioning deployment packages (which are simply `zip` files) for Lambda functions. We can pass the version ID to a CloudFormation template that builds the Lambda function, and Lambda grabs the exact version of its deployment package from S3. Doing this allows us to update a function only whenever we are ready and we declare the upgrade. Versioning deployment packages also gives us an easy option to roll back changes in the event of a fatal bug. In my opinion, versioning deployments no matter what the code is delivered in (`zip` file, Docker image, etc.) is a must because it allows developers to know exactly what code is running where, and it allows for easy rollbacks.

Out of preference, I enable versioning on almost every bucket I create now. Not only buckets that hold deployment packages, but also buckets where I store files in case one is ever accidentally deleted.

The space and cost savings comes into play with the introduction of lifecycles. Lifecycles in S3 pertain to objects and we can "expire" or delete those objects whenever they meet certain conditions. My favorite method of deleting objects is based on time and something that S3 calls "noncurrent versions." By setting an S3 bucket up this way, I automatically delete past versions of an object after a certain period of its inactive use. I normally set up the deletion of an object 30 - 90 days after it becomes the noncurrent version. This allows me to make sure that the new version of a file is valid and I do not need to roll back (especially in the case of a deployment package).

Lifecycles are useful for a wide variety of cases though. We can also use lifecycles to transition objects to different S3 storage classes. Objects are identified for a transition to a new storage class or expiration by either the object's name, path, or tags. I have used lifecycles to expire financial reports after they no longer need to be retained and to move large amounts of data to a deeper and cheaper storage class after they no longer need to be fresh for data analytics. As with any other AWS feature, the options are practically endless.

Storage classes are a new concept that I glossed over before bringing them up in the context of lifecycles, so I want to swing back around to those. The last paragraph might make more sense after reading this one. Storage classes are the way that S3 defines how readily available objects are. Objects can be stored in "deeper" levels of storage which makes persistent storage much cheaper, but retrieval times increase. If we needed to store a large amount of data for record-keeping but we rarely if ever access that data, then we can store it in a deep class of S3 (S3 Glacier or S3 Glacier Deep Archive) so it does not cost us as much.

### Hosting Websites

One extremely common application of S3 is to use it as a web server. Since web pages are really just HTML files and S3 is a great way to store files, it seems like a natural fit. Hosting a website out of S3 benefits from the globally diverse set of data centers that AWS runs, and end-user latency can benefit even more from the integration between S3 and CloudFront (more on that later in this section).

In the introduction section, I mentioned that all S3 buckets need globally unique names and website hosting is the reason. Unless a custom domain sits in front of the S3 bucket, AWS hosts the website using the bucket's name to give it a unique domain name. The unique bucket domain name can be the destination of a DNS CNAME entry either in Route 53 or any other DNS provider to add a custom domain instead of using the default AWS-assigned name.

One caveat of hosting a website out of S3 is that S3 only provides static file hosting with no compute behind it. That means that we are not capable of hosting a server-side rendered website out of the box. This is more relevant for old-school server-side scripts like PHP and ASP.NET and newer frameworks like Next.js. There is an AWS native way to support server-side rendered sites using a service called Amplify, but that is not something that I plan on covering in this guide.

With the server-side discussion out the way, S3 website hosting is still likely to cover most needs like static site hosting or single-page applications. I use Jekyll for my personal website, which is a commonly used static site builder. I run a build command and it spits out the HTML and CSS. Jekyll and Gatsby are two common static site builders that would integrate well with hosting a website out of an S3 bucket. Static site builders are simple to set up and hosting out of an S3 bucket is also simple to set up, so this is my recommendation for a straightforward website unless you need Javascript.

Single page application (SPA) frameworks like React and Vue can also take advantage of hosting their static build pieces out of an S3 bucket. The result of their build processes is what would live in S3 and then an API consumed by the front end would need to exist in something like API Gateway and Lambda. I have personally seen this type of setup work well with React, but I can not speak to any other front-end frameworks. If your front end needs an extensive amount of Javascript, then I recommend creating a SPA to host out of S3.

The last aspect of hosting a website out of an S3 bucket that I have mentioned is integrating with CloudFront. CloudFront (and all CDNs for that matter) is made for delivering static content quickly and at scale. Whether that static content is an image, video, or HTML file does not matter. For this integration to work, we need a new CloudFront distribution with our website's S3 bucket as content storage. That is it. S3 and CloudFront are about as easy to integrate as AWS services get.

### Data Analytics

S3 is a great platform that lends itself to a wide array of use cases, but one use case takes the cake for needing scale and that is data analytics. This is about as trendy as I want to get, but combing through logs and metrics at scale is a task that just about every well-used application will need at some point in its lifetime.

When applied to data analytics S3 can help us build a data lake for big data analytics, and we can then use another serverless service called Athena to write queries against that data. (Sorry for throwing all those buzzwords at you in a single sentence.) I have personally used this combination and had success with it. However, this is more applicable to large workloads with numerous users, so it might not be as easy to test out on a small-scale application since it works best with mountains of data.

Athena allows us to query against large datasets without needing to provision servers or write special software to parse through data. There are some caveats though. Data needs to be in a predetermined format like CSV, JSON, or Parquet. Pricing is also based on the amount of data scanned, so as a dataset grows so does the cost to query it.

Combining data into the correct format before writing it to S3 can be tricky depending on the data's source and what it looks like before it is written. When it comes to moving data at a large scale one service called Kinesis stands out. I will talk about Kinesis more later in the guide, but for now just think of it as a pipeline where we can take in data, transform it to our liking, and write to S3. Kinesis is my preferred way of moving and transforming data before it reaches its final resting point.

I have personally experienced two different ways of transformed data formats before writing to S3 and querying using Athena and they are JSON and Parquet. Both are file formats, but the advantage of Parquet is that the data can be better compressed due to it being a columnar file format. Both file formats are equally as flexible with Athena when it comes to updating schemas. My recommendation is to use JSON if you are not storing a ton of data or do not want to mess with a new file format because most people are familiar with JSON. However, I recommend using Parquet if you are storing enormous amounts of data like sensor records from IoT devices every second. The advantage Parquet has over other file formats is that the aforementioned Kinesis has a configuration setting that will convert JSON to Parquet for us and compress it automatically if we choose to enable it.

### Final S3 Remarks

There are some final remarks that are worth mentioning about S3, but probably do not deserve their own section headings. The first is using S3 in tandem with Lambda. Using S3 to store Lambda's deployment packages is a natural integration, but I have found success using S3 to store files written and read during Lambda function executions as well. Lambda has a fairly well-known limitation for file storage in the Lambda process itself under the `/tmp` directory. Since S3 has barely any file storage limitations and it integrates easily through the AWS SDK, I commonly use S3 as the final resting point for files that I either need to read or write during Lambda execution.

Another aspect of S3 is presigned URLs. A service or IAM entity can create what is called a presigned URL that grants anyone in possession of that URL read and/or write access to the bucket for which is presigned URL was created. This means that we can allow non-AWS users to access buckets without needing to give them full-blown permissions or require them to integrate with IAM. Presigned URLs make file uploading and downloading super simple for a non-developer end user.

Lastly, there are some fun physical data storage solutions that I wanted to bring to light even if they are not technically S3 services. As a disclaimer, I have not personally used any of these, but I always get a kick out of seeing them. AWS has something called the Snow Family, which is a series of physical devices meant to be used at the edge and to migrate data.

The smallest is called Snowcone, which is a 4.5-pound hard drive with 8 terabytes of storage.

The next largest is called Snowball, which is a larger device that supports S3-compatible storage, some EC2 instances, and Lambda functions. It is like a small subset of AWS that can be brought anywhere.

The last and largest of the Snow Family is the Snowmobile, which is a legitimate trailer that needs to be pulled by a semi-truck used to migrate up to 100 petabytes of data to AWS. It is crazy to me that this exists. There are obviously use cases where a traditional data center wants to migrate to the cloud and it makes more economic sense to ship that data rather than upload it over the internet.

S3 is a versatile, scalable, and extremely durable object storage solution. If the built-in durability is not enough, there is also a disaster recovery option by configuring S3 to replicate data across global regions. I have used S3 in just about every single one of my projects, and I imagine that I will continue using it just as heavily in the future. S3 also gets brownie points from me for being the first AWS service I ever used. For anyone that has not explored this service yet, it is definitely worth looking into.


[Next Chapter: CloudWatch](/blog/gtbwsa-chapter-11-cloudwatch)

[Previous Chapter: DynamoDB](blog/gtbwsa-chapter-9-dynamodb)
