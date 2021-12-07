---
layout: post
title:  "re:Invent: Inside A Working Serverless SaaS Reference Solution"
author: Thomas
tags: [ aws ]
description: My notes about the 2021 re:Invent ARC405 session
---

This is an overview of a session that I went to during [re:Invent 2021](/blog/reinvent-2021). I start by providing the notes I took during the session, and then I will give my take and comments if I have any at the end.

Wednesday 9:15

ARC405

## Tod Golding from the AWS SaaS factory team
- He has given talks and written content about various SaaS architecture concepts
- EKS reference architecture and serverless reference architecture; this one is serverless
- Will go over what the moving parts are and the design decisions
- It is a 400 level - so there will be implementation details

## Links:
- [github.com/aws-samples/aws-SaaS-factory-ref-solution-serverless-SaaS](https://github.com/aws-samples/aws-SaaS-factory-ref-solution-serverless-SaaS)
- [github.com/aws-samples/aws-serverless-SaaS-workshop](https://github.com/aws-samples/aws-serverless-SaaS-workshop)

## The fit between serverless and SaaS
- Agility
- Cost optimization
- Operational efficiency
- Smaller blast radius
  - Deployment and operational footprint is smaller which helps limit the blast radius
- Don't have to worry about forecasting consumption
  - Consumed compute infrastructure follows tenant consumption

## Key architectural considerations
- Design decisions for uniquely serverless architectures
- Which deployment models will you support? Tenants in silos with their own infrastructure, or use shared/pooled infrastructure
  - Influences authentication, authorization, and identity
- How will you automate tier-based deployments?
  - Basic vs advanced tenant
  - How to deploy all that for a tenant
- How do you manage noisy neighbor conditions?
  - Serverless stack gives a unique set of tools
- How will you isolate tenant resources?
  - Don't let one tenant access another's resources
- How will you support tiered tenant experiences?

## High-level architecture
- Control plane
  - They are dividing SaaS architectures into two planes
  - Control is services and capabilities
  - Registration, tenant management, user management, automated onboarding, identity, billing, metrics, analytics
  - Nothing multi-tenant in the control plane - it manages the multi-tenant environment
- Application plane
  - SPA hosted in S3, goes through API Gateway to access microservices on the backend
  - A lot of the multi-tenancy is in the API Gateway
  - The way the microservices are built and deployed has specifics to multi-tenancy
  - The microservices are a group of Lambdas - REST API with multiple Lambdas behind it

## Provisioning the control plane - this is in the reference architecture code
- There is a bootstrap template that creates the following
  - Tables that support multi-tenancy
  - User pools (AWS Cognito)
  - Microservices for control plane (reference architecture has a smaller set than what an actual SaaS would have)
  - API Gateway - routes, permissions, etc.
  - Web applications - SaaS app and admin app and landing page; this is S3 and CloudFront
  - Custom resources for CloudFormation

## Two distinct tenant deployment models (silos vs pools)
- They tell people to build a pool architecture and then whenever someone comes along and wants a silo, spin it out
  - Silos are for higher-end customers (he calls them "platinum")
- Platinum tenants get their own application plane stack and Cognito user pool
- Basic tenants get onboarded into the pooled app plane stack

## Registering new tenants (back into the control plane)
- One experience is for a tenant to hit the landing page, register, then get access to the SaaS app
- Another would be to have an internal process that isn't self-service from the landing page
- Request comes into the registration microservice which provisions tenant and configures settings (silo or pool)
  - Registration service hits user management service which creates user pool (silo) or user pool group (pool) and creates a tenant admin user
  - Registration service then hits tenant management service which creates tenant and stores their config
  - Registration service then hits tenant provisioning service which creates stack/infrastructure for siloed tenants

## Tier-driven onboarding
- Even with Lambdas, we can still have noisy neighbor issues due to concurrency limits
- Isolation experience for siloed tenants is also slightly different than pool tenants
- Siloed environments are clones of the pool environment, not just infrastructure but also code
  - Allowing variations is a step backward and away from the SaaS model

## Inside tenant provisioning
- The bootstrap template has a custom CloudFormation resource that adds an entry to a DDB table called "tenant creation pipeline table" which is picked up by a CodePipeline called "tenant provisioning pipeline" which creates/provisions the pool infrastructure
- Whenever a siloed tenant onboards, a new entry is added to the "tenant creation pipeline table" and the infrastructure is provisioned for them
- The tenant creation template sets up DDB tables, Lambdas, API Gateways, and provisions Cognito pools

## Mapping the deployments
- Need to know which tenants are using which deployment model (silo vs pool)
- Uses a "tenant stack mapping" DDB table
- Seems cumbersome to me
- There is currently no way to deploy blue/green but they are playing with it

## Now looking at a little bit of code

## Applying tiers and configuring tenants
- Setup API keys (this will come into play later in the code and my notes section "Tier based throttling policies")
- Not much else on this slide

## Triggering the tenant provisioning
- Putting an item into the tenant stack mapping table
- Then triggering the CodePipeline that provisions infrastructure
- ^^that's all in the REST API that registers users

## Managing tenants and users
- Tenants and users are managed in the admin console
- The SaaS application also gets access to the user management service

## Creating the user and tenant
- User gets custom claims and is mapped back to the tenant by the tenant ID
- Tenant gets info and then puts it into the DDB table

## Authentication and authorization
- Sign in through Cognito
- Lambda authorizer attached to API Gateway
- Tenant context gets injected and isolation is applied using that context

## Tenant routing
- Knowing which stack to point someone at
- When a user is logging in:
  - Get user pool mapping and then API Gateway URL which is stored in the tenant management DDB table
  - Then route the user to the correct user pool for authentication
  - JWT from authentication/Cognito is then used to authenticate with API Gateway

## Authorization with the two isolation models
- Siloed model is easier to isolate because the Lambdas can be scoped to a specific pool
  - Lambda is allowed to hit certain tenant tables so we don't need to worry about making sure it is valid
- Pool model needs to resolve isolation policy in Lambda at runtimes
  - Lambda authorizer dynamically allows certain DDB tables through the IAM policy returned (So does each tenant get its own DDB table in the provisioning process? He never actually answered this.)
  - Would have also been valid to auth in the Lambda business logic level instead of the gateway level but you wouldn't get the caching benefit of Lambda authorizer
    - Best approach probably depends on the complexity of what users would access

## Pool based partition with DDB
- Partition key is used as a shard ID
- Tenant ID is used to build the shard ID
- So the primary key would look something like `<tenant ID>-<another ID non-unique between tenants>`
- Multiple tenants' data in the same table

## Inside application microservices
- They use Lambda layers to handle tenant awareness so that microservice can handle business logic only then rely on the layer to handle any tenant-specific stuff
  - `log_with_tenant_context` passes in the event and log message, then layer handles the intricacies
- They use tenant IDs as XRay annotations

## Tier-based throttling policies
- Tenant doesn't know anything about the API key (see "Applying tiers and configuring tenants" section)
- The Lambda authorizer gets the API key from the tenant config table (was stored during provisioning/onboarding)
- Authorizer policy then applies API key to a usage plan
- I didn't know that a Lambda authorizer could dynamically apply an API key and usage plan
  - "API key can originate from Lambda authorizer"

## Takeaways
- Serverless and SaaS are a good fit
- Find the approach that best addresses your isolation and tiering needs
  - Being all pooled all the time is a completely valid option
- Embed all provisioning requirements in your onboarding automation
  - Create siloed infrastructure auto if needed
- Use API keys and usage plans to apply tier-based throttling
- Lambda layers to provide shared multi-tenant constructs
- Use the serverless model to reduce the operational and development complexity of your SaaS environments
- Use the serverless SaaS reference solution to jumpstart your development

## My notes:

The approach taken to create infrastructure (pooled or siloed) in the "Inside tenant provisioning" section was very interesting to me. First, I like (and always have liked) the idea of having infrastructure that can be replicated on-demand as many times as requested. Creating IaC in this way allows for anyone to come through and create their own stack and version without messing with anyone else or an "official" environment that is relied on by external users. Of course, this also lends itself perfectly to this application of replicating the production environment for siloed users. Second, provisioning multiple stacks using CodePipeline outside of a traditional CI/CD process involving code lifecycle-based webhooks sounded genius to me. I do not know why I had not thought about doing something like that before to dynamically create infrastructure stacks.

[Lambda layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) are something that I have thought about using before, but I ultimately did not use them because I was unsure of the proper use cases. After hearing about them in several sessions including this one, Lambda layers would have been the perfect fit for what I originally wanted to use them for: shared code amongst different Lambdas. I think a good application for layers would be [`crow-api`](https://www.npmjs.com/package/crow-api) where I currently copy code from the `shared/` directory to each of the Lambda's code directories, but that would be much easier to accomplish by creating a layer and then adding that layer to each Lambda.

My curiosity was piqued when he started talking about data modeling for a multi-tenant application. I believe that I have done something similar to the model that he was discussing in the past, which is reassuring and makes me feel good. However, I might try to dig through his code a little more to make sure that I correctly understood his approach. From where I am coming from a good way to handle multiple tenants is to simply prepend the partition key with a unique property of the tenant (email, ID, etc.) which then forces the tenant to only be able to query against partitions explicitly with their ID.