---
layout: post
title:  "GTBWSA Chapter 7: Lambda"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS Lambda is and how to use it
date: 2021-10-04 09:00:07 # this is used to properly sort the chapters
---

This is a chapter from the Guide To Building With Serverless AWS that I wrote. For more information about the guide's intent and focuses, please read the Introduction Chapter.

**Table of Contents:**

1. [Introduction](/blog/gtbwsa-chapter-1-introduction)
2. [Serverless Introduction](/blog/gtbwsa-chapter-2-serverless-introduction)
3. [Introduction to the Cloud and AWS](/blog/gtbwsa-chapter-3-introduction-to-the-cloud-and-aws)
4. [Infrastructure as Code](/blog/gtbwsa-chapter-4-infrastructure-as-code)
5. [IAM](/blog/gtbwsa-chapter-5-iam)
6. [VPC](/blog/gtbwsa-chapter-6-vpc)
7. [Lambda](/blog/gtbwsa-chapter-7-lambda) (You are here)
8. [API Gateway](/blog/gtbwsa-chapter-8-api-gateway)
9. [DynamoDB](/blog/gtbwsa-chapter-9-dynamodb)
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

AWS Lambda is the pinnacle of modern-day serverless. Some people even associate the term serverless directly with Lambda functions. However you choose to think about Lambda, there is no denying that it brought about a new paradigm in computing.

There is no real traditional alternative to Lambda. The closest idea to a Lambda function in the traditional sense would be a Virtual Machine (VM) that spins up whenever a request comes in then scales down to zero after a period of inactivity. AWS Lambda offers Functions as a Service (FaaS), which means that all we as developers need to do is tell Lambda what language our code is written in and it handles the rest. Leveraging Lambda is by far the quickest way to get code up and running in the cloud. Code can be delivered to Lambda in the form of a `zip` file or a container image, but my preference is to use a `zip` file. The best part about using Lambda is the built-in administrative features that are jam-packed into the service like auto-scaling, fault tolerance, high availability, efficiency, and flexible pricing.

### High-Performance Computing Features

Lambda scales on its own and as needed. It will not take long after diving into the world of serverless before encountering the concept of cold starts though.

A cold start is the time overhead that AWS (or any other cloud provider for that matter) requires to create the necessary resources to support a new instance of a Lambda function like spinning up compute resources and attaching network interfaces. AWS constantly improves their end of the cold start problem, but the other half is up to us. Keeping the deployment package size down, properly managing dependencies, and understanding which pieces of our code run at different points in a Lambda's lifecycle will all help reduce the amount of cold start time.

After nailing down the infamous cold start dilemma, nothing is holding Lambda back from handling massive amounts of traffic. It is worth noting here that code for Lambda functions needs to be written without requiring state and with horizontal scaling in mind. The key here is quick, lightweight, and idempotent code.

Reaching into high-scale territory comes with inevitable hardware failures. Errors will unveil themselves at the worst times, but Lambda functions are primed to handle that uncertainty. Idempotent code is a key consideration here. If clients are prepared to retry calls to your Lambda function, then a stray error will seem like a blip on the radar. If something does go wrong with the underlying infrastructure of a Lambda function, it will result in a new instance spinning up just like any other compute resource would while scaling up. We do not have to worry about tracking down failing hardware, that is Amazon's job and they do it quite well.

Code should be written and infrastructure should be configured with fault tolerance in mind. For both code and infrastructure, failed attempts should be retried after a given time. Any number of issues could spring up between resources; there could be networking, hardware, or application code issues just to name a few. If an expected response is not received within a given amount of time, a client should assume there was a fault somewhere along the way and retry.

One example of this that is easy to get working is the integration between Lambda and AWS Simple Queueing Service (SQS). Lambda polls SQS then processes the event. If the Lambda function times out or returns an error, then SQS keeps the event in the queue allowing another Lambda function to attempt processing it. After a preconfigured amount of processing attempts, SQS finally either rejects the event as a bad event or forwards the event to a Dead Letter Queue (DLQ) to be handled by some other manual or automated process.

High availability is an area that traditionally takes massive amounts of resources to implement because it involves geographically separated data centers and correctly configured networking equipment and servers. For small businesses and applications creating highly available services in a traditional sense is almost out of the question because it involves a lot of operational overhead. Luckily for us, AWS already took the liberty of setting up the necessary operational aspects and made the remaining configuration easy for us.

The operational overhead required to maintain AWS's services is evident for all of them not just Lambda. AWS owns numerous data centers in numerous geographic regions all over the world. Regions in AWS are specific states or cities around the world that are clusters of data centers also known as Availability Zones (AZs). Availability Zones are the discrete data centers within a Region and there are multiple Availability Zones in each Region. We can provision the same Lambda function (or sets of infrastructure for that matter) in various Regions or Availability Zones to implement geographic redundancy and promote high availability.

AWS services make it easy to provision duplicate sets of infrastructure or whole applications in multiple Regions, and specific services like Route 53 (AWS's DNS service) make it easy to fail over to working Regions if a certain data center or set of data centers become disconnected from the network.

While high availability might not be a concern for smaller businesses and applications, this becomes a definite concern as applications serve more and more users in various regions of the world.

Efficiency is near synonymous with Lambda. Just the idea of a serverless function promotes efficiency. There is no constantly provisioned hardware so other cloud users can share the same underlying resources. For our side of the equation, we need to keep code small and clean to make sure that the function runs quickly. Developers who know how to properly manage Lambda functions are also able to efficiently prototype and create new services as needed.

### Pricing

Pricing goes hand-in-hand with efficiency, especially from a hardware standpoint. Without provisioned servers, we only pay for server time while Lambda is processing a request. For me, this is one of the hugest benefits of using Lambda. I have created entire applications and never paid for servers. There is also a free tier which means even when my applications are being used, I only pay after a certain point. My life remains stress-free because I do not need to worry about paying for a server especially when it is not being used.

Another area of cost savings with Lambda is development time. Development time costs money. Ask any software engineering manager and they will tell you the same thing. Quality software engineers command a high salary, so whatever time they spend working on a project should be optimized. Developers spending less time fiddling with infrastructure and more time working on core business logic means a lower overall price for an application to be built. Even when I work on my side projects, I want to get straight to coding to see my idea come to life as quickly as possible. Using Lambda facilitates quick development and deployment cycles.

### Developing With Lambda

Speaking of development, developing for Lambda can be a bit tricky at times. At a high level, we need to give the Lambda function code that accepts two main arguments: `event` and `context` and configure the Lambda function with the correct file path to reach said function. Writing a synchronous handler in Node.js (I like to use Javascript where I can to make context switching a little easier) means that the Lambda function will be passed a third parameter which is the callback function. The `event` contains relevant information from the calling service or request. Each AWS service has a different calling signature or schema, which is best referenced in the AWS documentation. The `context` argument contains information relating to the Lambda function's configuration.

Writing Node.js functions changes the way that the Lambda function returns the result of its execution depending on whether or not it uses `async`/`await` or `Promise` style syntax. I prefer using `async`/`await` which requires the handler function to either return its result or throw an error. The alternative is to use the callback function provided as the third argument to the Lambda handler. There are some caveats worth mentioning when developing for Lambda and some specific to Node.js.

Firstly, Node.js uses an event loop so running async functions can lead to unintended execution. This was one of the largest surprises to me when learning to develop with Lambda. One specific example I have was trying to call an API in the background to notify it of an event. I did not use nor care about the result of the API call, so I did not `await` the result and returned from the handler function. I starting noticing weird behavior though. Despite the Lambda function completing every execution, the API call was not always executed.

The problem stemmed from the way that Lambda operates because it assumes that after the handler function returns, it can shut down the computing resource backing it. This means that if the API call was not sent before the handler function returned, the server that ran the code might have already shut down.

Another facet of developing with Lambda is that the Lambda function might continue to run on subsequent requests with the same "execution environment" which more or less means the same server or compute resource backing it. Reused execution environments might allow the previous event loop to continue, which would complete the asynchronous function execution as if the server had never shut down. This resulted in difficult tracings because I would see an API arrive multiple seconds after the originating Lambda (which had been shut down and now rebooted) had initiated the call.

Reused execution environments are not always bad though. Despite their sporadic nature, there is a possibility for saving time depending on how the Lambda function's code is structured. The same way a reused execution environment will continue to process the old request's event loop, all of the globally defined variables will be available in the reused environment. If there is expensive code that needs to be run at the beginning of every request, there is an option to run that code in a global scope and reuse it across contexts or requests. It is a little finicky, but it is called out by AWS as a best practice for reducing latency for end-users.

The way to reuse variables across execution environments is by declaring them at the global scope, which is a great low-cost way to cache those values. Of course, the locally cached values are not guaranteed to be present, so we need to build in a check before assuming the locally cached values are present and defining the values for those variables if they were not carried over from the last execution. In a way, we need to initialize the environment if it had not previously been initialized.

A bit of a disclaimer around all of this before I go any further. I have previously mentioned that Lambda functions are stateless and should be thought of as stateless environments. While we can cache values in memory, those values should not be associated with the state of an application since those values could vanish at any given time. For a more durable caching solution, I suggest using DynamoDB (although I am sure that will receive bad reviews since DynamoDB is not particularly a cache, please read through the DynamoDB section for more) or a more traditional cache like Redis.

Shifting back to the execution environment topic, while we can write code to help initialize a Lambda's environment and not pay for the time spent initializing, the downside is increased cold start times. What I am referring to is writing code before a Lambda's handler function is defined. This allows us to perform common tasks like checking for existing cached values from a previous execution environment, retrieving necessary secrets, and creating database connections. Nothing is without its drawbacks, so while we are advantaged by being able to initialize our environment without paying for it, we take a hit in cold start times which reflect in higher latency for users.

On the topic of cold starts, there is a fair amount of work that developers can do to ensure quicker cold starts. We have already explored one way which is to keep execution environment initialization time down which is a direct one-to-one in terms of increasing cold start times. Another bit of work is properly managing the size of a Lambda's deployment package.

I have seen a bit of back and forth online about the impact of deployment package size on cold starts, but from my personal experience, there is an effect. I try to keep my package sizes to a minimum.

My first suggestion to help with deployment package size is to make sure that only directly related code and files make their way into the deployment package. I once encountered a scenario that involved an entire codebase being deployed to a Lambda function including unrelated source code, tests, and CloudFormation templates. Tuning the Continuous Integration scripts to only package the appropriate source code decreased the overall size by half.

Another area that I keep my eyes on is the added size of code dependencies. I prefer writing code in Javascript, which has a terrible reputation for dependency bloat. Regardless of the language used, check the size of a dependency on the package management site before adding it because a single dependency might double the size of the final deployment package.

My latest area of improvement for decreasing cold start times is properly architecting and organizing Lambda functions. Lambda is a quick and agile platform, which means it is easy to simply create a new Lambda function instead of continually adding complexity to an existing one. A synchronously invoked Lambda means that a client experiences the execution length of that Lambda in the form of latency. Make sure that all latency is required latency, and make sure that all code being run is directly necessary for the returned value. If any code is unused, move it to another Lambda function and invoke that Lambda asynchronously through another service like AWS Simple Notification Service (SNS) (there is a chapter on SNS later in the guide).

When it comes to provisioning and deploying Lambda functions, the options to do so are endless. It is possible to package a Lambda function as a container image now; however, my personal preference is still to use zip files. Zipping files is simple and universally recognized, which means CI/CD and package storage is easily integrated with other AWS services as well as third-party services. One integration that I have successfully deployed multiple times over is using an AWS service called CodeBuild for Continuous Integration, AWS S3 for artifact storage, and AWS CodePipeline and CloudFormation for Continuous Deployment. (More on these services in later chapters.) However, for smaller projects, I believe that locally run scripts are perfectly capable of handling the job just the same as larger, more orchestrated integrations.

Running integrations between AWS's developer tools in the cloud is almost required in more elaborate and enterprise settings. CI/CD can be triggered by webhooks on pushes to GitHub or periodically and there is no human error when that process is automated. For smaller players or side projects, those complex integrations can be expensive in terms of development overhead and also the cost of the services themselves. It is important to note that just about every action for every service that AWS offers can be triggered through an API call. The AWS CLI exposes those API calls and is an incredibly useful tool not only for CI/CD tools but for every service.

### Integrations

There are a plethora of integrations between Lambda and other AWS services. I like to think of Lambda as the glue between AWS services. Any custom logic that needs to be injected into any series of events or flow of data will most likely be handled by a Lambda function. Stopping to think about it, it makes total sense. Lambda is a light and nimble platform that can be invoked by anything either synchronously or asynchronously. I wanted to bring up and highlight a few integrations between AWS services that I have deployed in the past to give an idea of what is possible.

The first integration is one of my favorites and a tried-and-true one that almost everyone knows about or has implemented. Lambda and API Gateway has got to be the simplest way to deploy an API today. There is no server set up only coding the business logic that lives inside of the Lambda. Since I have a section dedicated to API Gateway I will hold off on more discussion until then.

Engineers sometimes have trouble shifting to a serverless mindset because of the idea of ephemeral infrastructure. How are we supposed to execute a long-running job that we know would extend past Lambda's 15-minute timeout? The answer is AWS Step Functions. While there are other with Step Functions integrations besides Lambda functions, Step Functions allow us to orchestrate the execution of multiple Lambda functions. While this might not directly solve the issue of a single long-running job, it does allow us to break that job into multiple pieces or steps, create individual Lambda functions based on those steps, and orchestrate those Lambda functions. Deconstructing a long-running application like this is good practice and allows for fault tolerance and a better understanding of what is truly happening.

Cron jobs are commonly used in traditional operations settings, and the serverless cloud alternative to those is presented through AWS EventBridge. EventBridge allows us to create a periodically triggered rule using the same scheduling syntax as the traditional cron. I have had great success scheduling a Lambda function to run periodically to check statuses of other APIs, delete old database records, and replicate data to durable storage. EventBridge can be integrated with Step Functions to handle long-running cron jobs that are complex enough to require an orchestration tool.

Optimizing workloads in the cloud means learning about asynchronous processing and event-driven architecture. My preferred service for producing events for event-driven architectures is using SNS. SNS helps deliver and fan out events asynchronously. A pattern that I commonly use is emitting events from Lambda functions that I have integrated with API Gateway then I create Lambda functions as needed to handle the events in the background. This allows me to reduce latency for my API's critical path but also complete processing in the background.

Data science and analytics is a hot topic nowadays, and moving data around can be finicky. AWS Kinesis is a service that allows multiple data sources to feed into the same Kinesis stream, and Kinesis delivers that data to its final destination. Lambda comes into play if anything in the data needs to be transformed before reaching its final destination. Kinesis will invoke the configured Lambda function with a group of data records to be processed. The Lambda function can perform any custom logic needed before returning the transformed records to Kinesis and ultimately their final resting place. Some ways I have used Lambda functions to transform Kinesis records are by scrubbing data from logs, standardizing data, injecting information, and performing real-time analytics on that data.

The final integration that I want to highlight is CloudWatch Alarms. CloudWatch is AWS's logging and monitoring solution and it comes with a few spin-off services including CloudWatch Alarms. We can build alarms based on logs or operational metrics that trigger at a predetermined threshold. If you have read the previous sections this might sound like something familiar: an alarm is an event. Using alarms in an event-driven architecture is a natural next step and once those alarms are triggered we can set them up to invoke a Lambda function. After that, the sky is the limit. We can write code for the Lambda function that dispatches messages, tries to remediate the problem on its own, trigger another service like incident management alerting, or anything else we can imagine.

This concludes the Lambda function integrations that I wanted to highlight, but there are plenty of others that I have not used or potentially even heard of. Of all the services that are discussed throughout this guide, Lambda is my favorite. There is a cult-like following around it and for good reason. Lambda has shifted the way that we can write code and build applications. Serverless has opened a whole new door by creating a new paradigm and Lambda is the flagship function-as-a-service offering out of all the cloud providers. Learning how to effectively and efficiently write code for Lambdas and use Lambda functions is an incredible experience in and of itself.


[Next Chapter: API Gateway](/blog/gtbwsa-chapter-8-api-gateway)

[Previous Chapter: VPC](/blog/gtbwsa-chapter-6-vpc)
