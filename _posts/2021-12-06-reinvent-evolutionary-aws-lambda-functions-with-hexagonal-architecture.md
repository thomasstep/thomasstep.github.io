---
layout: post
title:  "re:Invent: Evolutionary AWS Lambda Functions With Hexagonal Architecture"
author: Thomas
tags: [ aws ]
description: My notes about the 2021 re:Invent ARC302 session
---

Edit: I have since written a post about [implementating hexagonal architecture](/blog/how-i-implement-hexagonal-architecture-in-aws-lambda) if you would rather see code.

This is an overview of a session that I went to during [re:Invent 2021](/blog/reinvent-2021). I start by providing the notes I took during the session, and then I will give my take and comments if I have any at the end.

Tuesday 16:15

ARC302-R2

## Agenda:
- Problem space
- Anatomy of hex arch
- AWS Lambda with hexagonal architecture
- Additional use cases
- Wrap up

## Evolving an application in the cloud.

## Modularity in code and infrastructure.

- "Almost from day one, we knew that the software we were building would not be the software that would be running a year later." - Dr. Werner Vogels
- Code and infra should evolve together
- Three-tier architecture: presentation layer, application, data
  - A lot of time those boundaries bleed over to one another
- Moving to AWS Lambda
  - Moving from EC2 or ECS
  - Sometimes there is no drag and drop option
- Lack of boundaries in domains
- "Hexagonal architecture allows an app to equally be driven by users, programs, automated tests, or batch scripts, and to be developed and tested in isolation..." - Dr. Alistair Cockburn (hexagonal architecture creator)

## Anatomy of hexagonal architecture
- Picture:
  - Domain logic is a hexagon, surrounded by ports, surrounded by adapters
  - Looks like layers with one inside of the other
- Domain logic calls ports that call adapters
- A port is an interface
- An adapter is wrapping an entire integration
- There are "primary actors" that interact with our code/Lambda which are services, front ends, message queues, etc.
- There are "secondary actors" that our code/Lambda interacts with which are databases, third-party APIs, etc.
- Benefits:
  - Independent business logic from the outside world
  - Inside out programming
  - Easier to test in isolation (take business logic and test it without the need of testing the adapters and everything else)
  - Low tech debt
- Drawbacks:
  - Building more layers upfront
  - Loose implementation details for the business logic (could also be an opportunity)
- "The hexagon...allows the people doing the drawing to have room to insert ports and adapters as they need" - Dr. Cockburn

## Lambda with hexagonal architecture
- Example stocks API
- API Gateway, Lambda that calls DDB and third party service for currency exchange
- Request comes in, adapter picks it up, through a port to domain logic, domain logic uses a port to call adapter which calls DDB and third party service
- Has example code too
- app.js has handler that calls adapter `getStocksRequest`
  `getStocksRequest` calls port `HTTPHandler.stockHandler`
  `HTTPHandler.stockHandler` calls domain logic `retrieveStockValues`
  `retrieveStockValues` contains actual business logic that calls ports which call adapters which reach out to ddb and 3rd party
- I don't know why the ports are needed...
  - Answer:
    - Needed to decouple the business logic and the adapters
    - Ports are meant to be passed through

## Additional use cases (I think all of these are just proper logic separation so that changing something becomes simply changing the logic that interfaces externally)
- Unit testing business logic in isolation
- Changing trigger (instead of API Gateway use SQS) becomes only a change in the adapter that is used as the Lambda handler
- Adding another trigger becomes creating a new adapter
- Cache-aside pattern (checking a cache first before going to DB) becomes adding the logic in the adapter only, not the business logic
- Migration to AWS managed service (from self-managed Redis to Elasticache)
- Web app modernization
- Hybrid architectures (AWS Lambda and Kubernetes) becomes dragging and dropping the business logic and letting each arch (Lambda vs k8s) implement its own adapters

## Is this the definitive arch for Lambda?
- Depends
- Example of a SaaS project
  - Want to start deploying and then it evolves with new features and business use cases
    - In this case, using hexagonal architecture would be better and the upfront investment would be worth it
- Example of a short running project or something that would never evolve
  - No because the upfront investment would not be worth it

## Key takeaways
- Strong separation of concerns
- Infrastructure decoupled from business logic
- Easy to test (especially unit testing)
- Many use cases simplified

## Resources: [go.aws/3EWz4Kf](https://go.aws/3EWz4Kf) (his blog post about this)

## My notes:

I think this pattern makes sense. I dug a little more and did find the [code that he presented](https://github.com/aws-samples/aws-Lambda-hexagonal-architecture) which might help others understand the different roles are for each layer. The code is about the stocks example. Either way, I feel like most teams I have worked with so far use an architecture similar to this one with proper separation of concerns, but I have never given it a particular name. I could see something like this being beneficial by creating my own packages which are adapters, then reusing that common code across projects. For example, have adapters for Lambda handlers being invoked by various services and others for interacting with common other services like DDB and SNS.

