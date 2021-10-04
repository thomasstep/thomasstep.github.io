---
layout: post
title:  "GTBWSA Chapter 8: API Gateway"
author: Thomas
tags: [ guide to building with serverless aws ]
description: Explaining what AWS API Gateway is and how to use it
date: 2021-10-04 09:00:08 # this is used to properly sort the chapters
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
8. [API Gateway](/blog/gtbwsa-chapter-8-api-gateway) (You are here)
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

Creating a Lambda function is great, but once it is created, we need to create entry points for clients to access it. Normally, software is exposed to users through APIs, and naturally, AWS has a service that makes exposing resources as APIs easy. Enter Amazon API Gateway. API Gateways are a concept on their own, and AWS offers an implementation of an API Gateway bearing the same name. The concept behind API Gateways is to create a single entry point for all of an application's APIs. The API Gateway then routes traffic to the appropriate service.

Of course, the depth and full capabilities of an API Gateway are defined by the implementation itself. Amazon's implementation is simply called Amazon API Gateway. Another well-known API Gateway implementation was created by Netflix and is called Zuul.

As with any AWS service, Amazon API Gateway (from here on out I will refer to Amazon API Gateway as simply "API Gateway") is easy to integrate with other AWS services including Lambda. I would argue that API Gateway is the most used entry point to a Lambda function, and it is the go-to for creating APIs.

The way that I choose to use API Gateway and Lambda is similar to how a lot of boilerplate code for basic servers is set up. When creating a server the routes and methods are defined and functions are attached to them to handle their requests. I like to think of API Gateway as being the boilerplate code that sets up routes and methods, Lambda functions as being the logic that handles each request, and the integration between them as being the function wrapper or decorator.

API Gateway has a few resources that are the building blocks for an API's structure. An API resource itself (the resource is also called a Rest API or HTTP API) is an entity that separates a particular API Gateway instance from other APIs and is accessible by its own URL. The API is made up of various resources which correspond to API paths. Each path resource has methods attached to them which define which HTTP verbs can be used to manipulate the resources held behind it.

### API Gateway Building Blocks

API Gateway starts with a logical entity of an API. In my example which parallels an API Gateway and Lambda function API to a traditional server, provisioning an API resource would be the equivalent of starting a new server without any routes to handle requests. There is beauty in the orchestration behind this though. Before cloud providers and the easy services that they offer, provisioning the equivalent of an AWS API Gateway API resource would include finding a suitable server in a (most likely on-premises) data center; creating a new VM; installing the necessary libraries, languages, and packages; opening up ports; configuring DNS servers and networks to point to your new server; writing boilerplate API server code; packaging and deploying that code onto the VM; and finally running that code. I am positive that I am overlooking multiple steps for a more traditional scenario, but the point is for us to realize just how easy AWS makes these things.

After we have provisioned a new API resource within API Gateway, we can start defining the resources that make up the API. API design is a guide unto itself, so I will assume you already possess that knowledge or will acquire it elsewhere. There should not be any tricky parts here unless proxy resources are thrown into the mix. Proxy resources are a way to catch any routes like a slug route would. I have used proxy/slug resources in the past, but I try to stay away from them out of personal preference. While configuring a proxy resource on an API Gateway is not necessarily difficult, it does add a little extra overhead in the Lambda function that needs to handle the request.

The last resource needed in API Gateway before we can finally integrate with a Lambda function is the method resource. Method refers to any HTTP verb that will be used to interact with an API resource like GET or POST. The method itself is what integrates with a Lambda function because the method has all of the context required to finally know what action a user wants to take on a resource. API Gateway also allows us to configure a single integration with all HTTP verbs if that is desired. At this point, our API will have been designed and provisioned in API Gateway; however, there are still a few more actions we need to take before our API is live.

By the time we have a designed API, we will be ready to deploy that API into the world. Provisioning the API in API Gateway and configuring its resources and methods does not mean that your endpoints are live yet. To handle going live, API Gateway provides two more concepts: stages and deployments.

Stages are meant to represent an API during different phases of development. For example, an API could have dev and prod stages that are integrated with different Lambda functions. The dev stage could be mapping to experimental code or new features, while the prod stage could be mapping to the last known stable state. The name of the stage will be a path component preceding all other defined resources. For example, an API with a single `/user` path would have a dev stage path that translates to `/dev/user` and a prod stage path as `/prod/user`.

While stages can be useful, the way that API Gateway's pricing works (I will discuss pricing later) there is no penalty to creating two APIs with one being a dev instance and one being a prod instance. I prefer having two separate instances rather than two separate stages. Continuing along the route of having two separate APIs still means we need to create stages, but we would only need one stage per API instead of multiple stages on one API.

Deployments are the final piece of the puzzle before an API goes live. Stages and deployments must be associated together so that a deployment knows what API configuration needs to be deployed. A deployment is considered a resource in AWS, but what it really does is take the current state of an API and deploy it. My guess as to why AWS considers the deployment itself a resource is because those deployments are immutable. Immutability in AWS must mean that internally they need to capture and store it as a resource with a certain set of configurations.

If an API's configuration is changed by adding new resources or methods, or changing which Lambda functions are integrated with the API, then the API will need to be redeployed. This is simply a caveat of the deployment resource in API Gateway and its immutability. This used to trip me up because I could make a change to an API, see that change reflected in the console, but not experience the change as a user. The reason was that I needed to create a new deployment. The new deployment will not overwrite any URLs, but there is an option to change the stage that a deployment is associated with. The new deployment can be associated with the same stage, a different but existing stage, or a completely new stage. Remember that what will change is the stage name being reflected in the API's path, so a new deployment associated with a different stage could be a breaking change.

### API Gateway Endpoint Types

Since we now know how to deploy an API, there are a few options related to deployments that are worth discussing. As I have previously discussed AWS maintains data centers all over the world. With that type of infrastructure in place, deploying a customer-facing application can be more complex than simply "making it available on the internet." There are three geographically important ways to deploy an API Gateway and they are privately, regionally, and at the edge.

A private API Gateway deployment is not something I recommend or use often. I have created a few private APIs, but there are downsides to privately deployed APIs. The largest downside to me is that privately deployed APIs are only available from within a VPC. Remember the small VPC section that we discussed earlier? It was small for a reason and that is because VPCs require more maintenance and overhead to get going and cost more money depending on the VPC setup. If security concerns are what make privately deployed APIs attractive, there are security layers that can be added to API Gateways like API keys and Lambda authorizers, which I will go over soon.

Regional APIs are publicly available APIs with domain names. Regional APIs are a great option for customer-facing APIs and they are deployed on a per-region basis. Deploying regional API Gateways in multiple regions is a great use case for CloudFormation since CloudFormation Stacks are also created on a per-region basis. We also have the option to give regional APIs custom domain names, which are not available for privately deployed APIs. A custom domain name needs to be mapped to a specific API and stage to be accepted by the API Gateway. A CNAME DNS entry can then be made pointing to the API Gateway, which can either be handled by AWS Route 53 or any other DNS service.

The last API Gateway deployment option is an edge-optimized API endpoint. Edge-optimized APIs are automatically deployed to AWS's edge locations, which also exist all over the world. This is the default API deployment type and is best suited for APIs with a global user base. There are no different billing models associated with the different deployment options, so I suggest sticking with the default edge-optimized option. Edge-optimized endpoints can have custom domain names similarly to regional ones with the one custom domain being routable to any edge location. AWS does perform some magic here, and this is one clear example of the power that anyone can wield while using AWS.

### API Keys

Generating API keys as a way of providing some level of security for an API is a common enough practice that AWS made it into a service. I want to stop and note that API keys do not solely make an API secure, so make sure that you know and understand potential security concerns before only relying on API keys. To associate API keys with an API we need to run through a few steps first.

Our API Gateway methods first need to know that they should be expecting calls to include an API key, so there is a simple switch that we need to turn on telling methods to require API keys. Remember that if this change is being made after having already deployed an API, that API will need to be redeployed. This is the first piece of the puzzle.

Next, we need to create something called a usage plan. This resource is exactly what it sounds like. We can configure plans with quotas and throttling limits that we can give clients. Keep in mind that "clients" here can be customers or developers. Usage plans will need to be associated with an API's stage so that API will ideally already have a stage created before going down the path of creating keys for it. I like to keep usage plan limits somewhat restrictive at the start in case anything is ever compromised, and I scale those limits up as needed whenever traffic starts coming online for a particular API.

Finally, we can create our API keys. AWS will generate a random string to serve as the API key and will be expected to be passed to the API as the value to a header called `X-Api-Key`. An API key will need to be associated with a usage plan before it will be accepted. What this all means is that a deployed API can require API keys for certain methods. Those methods which require keys will employ throttling and quota limits on the users that own those keys.

I create API keys for all of my APIs because it gives me an added layer of comfort knowing that attacking my APIs would be a little more difficult. Again, I am talking about security lightheartedly here, so when it comes to building APIs at an enterprise level, be sure to check with a security team before thinking that simple API keys are the only security measures that need to be taken.

### Lambda Authorizers

While API keys are a nice built-in way to check that a user is allowed to access an API, AWS offers an option for a more custom approach. This is yet another way to integrate Lambda functions between AWS services called Lambda Authorizers. The idea here is that a request first invokes a Lambda function, which either accepts or denies the request based on some sort of custom authorization scheme. If the request is denied, then API Gateway returns an error code to the caller. If the request is accepted, then API Gateway forwards the request to the appropriate resource and method to be handled normally. Authorizers also grant us the option to cache the Authorizer Lambda's response, which puts less load on the Lambda authorizer, reduces latency, and reduces costs.

Two different types of authorizer event payloads can be configured which use different parts of a request to authorize a user and cache the response. The first type of event payload is called "token," and token types are configured to look at a configurable header value. The second type of event payload is called "request," and request types can be configured to look at other parts of a request such as header values, query string values, stage variables, and other context. Both types cache based on the value they are configured to look at. For example, requests that come in with the same authorization header values will first be checked against the cache for the last decision against the same header value and only forwarded to the Lambda Authorizer if there is no cache hit.

Authorizers even let us write a regex for initial validation before sending it to the Lambda, so if a malformed token is sent in it is automatically rejected without using Lambda execution time. Authorizer Lambdas receive the configured values and must construct and return an IAM policy, which probably sounds more complicated than it is. There are numerous examples online from both AWS and third-parties with proper code to handle IAM policy construction, so do not be deterred from using Authorizers because they involve IAM.

My personal preference when it comes to Lambda Authorizers is using the token type of event payloads configured to look at the standard Authorization header. This pulls out the Authorization header for my Lambda and caches the exact token so my Lambda does not need to run every time the token's owner calls my API. I use Bearer Tokens to authenticate users, so I pull the JWTs out of those header values to be verified. Once a user is verified, I pull any additional context in to construct the IAM policy and return it.

Another fun bit about Authorizer Lambdas is that we can return extra context which will subsequently be passed to the Lambdas integrated with our API. I find that any code or information that all of my handler Lambdas need is best found in the Authorizer Lambda, which is cached and passed down to subsequent Lambdas. Since that code would have to be run anyway, I might as well run it once and then let API Gateway's cache take over for a performance boost.

### API Gateway Proxy Integrations

API Gateway and Lambda are a match made in heaven, but API Gateway can integrate with other AWS services directly like DynamoDB or SNS. Options open up for quicker development times and easier maintenance if there is no custom code between the API Gateway and the end service. It is not uncommon to see the trinity of serverless operating together: API Gateway, Lambda, and DynamoDB. Sometimes we don't even need to write code for a Lambda function though. If our code is simply translating the request to a DynamoDB row and inserting that item, then we have a great use case for a direct API Gateway proxy setup.

All AWS services are exposed through APIs, so we can expose the AWS APIs to our users with a thin layer between being API Gateway. We can restrict access to those AWS services and offer a more intuitive interface. An API in API Gateway can be set up the same way as we would with a Lambda function except that we instead configure the API's integration type as an AWS Service Proxy.

Once the API is configured as a proxy, we can map user input to the other AWS service's API input using special syntax for this purpose, so there is a slight learning curve here with the mapping template syntax which is called Apache Velocity Template Language.

It is worth pointing out that a proxy integration without server-side code (i.e. a Lambda in between) means that we lose the ability to validate and scrub input. This is simply one of the trade-offs that come with the simplicity of an integration like this. Nevertheless, I have still had success implementing these types of integrations.

My personal preference regarding API Gateway Proxy Integrations is to use them sparingly and for internal use. The largest downside for me is the lack of input validation, so I prefer to present a user with an API that allows me to validate input, then use a proxy integration for non-user-facing-services. This makes sure that I will have had the chance to validate and scrub input by the time it gets to an internal service that works as a proxy integration. The largest benefit to the proxy integrations is that they allow us to provide a thin translation layer of sorts instead of dealing with AWS's APIs, which can sometimes be confusing especially to developers who are not familiar with them.

### Pricing

Pricing for API Gateway is similar to Lambda where we only pay by valid requests. I mentioned earlier that I like to provision one stage per API in API Gateway. I can provision those extra API resources without any extra cost because I still only pay by request instead of provisioned API.

The pay-by-use model is what makes serverless extremely attractive to me as well as a multitude of other developers and teams. A traditional setup would most likely charge me by instance because one API means one VM and I would be charged per VM since it would need to be up and running in a data center at all times, which costs money. AWS and its serverless offerings make much better use of their overall computing power, which is passed down to us in the form of more efficient billing models.

I mentioned that with API Gateway we only pay by *valid* requests. This is the reason why I brought up some of the authentication features of API Gateway like API keys and Lambda Authorizers. If a user hits an API with invalid keys or a Lambda Authorizer denies access, then that request does not get charged against us. Granted with a Lambda Authorizer, we would still pay for the Lambda's execution time. However, I see this as a great benefit to us. I can sleep well at night knowing that if some web crawler or rapid-fire script finds my URL, it will not go against me if I have set up API keys or a Lambda Authorizer.

Keep in mind that while serverless offerings like API Gateway provide attractive prices for sporadic traffic, they may or may not be better in the long run with more stable traffic levels. The cost of serverless over the long run is something that is debated online, so it is up to you to determine whether or not you and your traffic will see a price benefit.

For such a seemingly simple service, API Gateway has a lot to offer. As an entry point for your clients into AWS and as a tool to enhance internal workflows. There is more to be learned about API Gateway, but this is probably more than enough information to get anyone up to speed and off to the races.


[Next Chapter: DynamoDB](/blog/gtbwsa-chapter-9-dynamodb)

[Previous Chapter: Lambda](/blog/gtbwsa-chapter-7-lambda)
