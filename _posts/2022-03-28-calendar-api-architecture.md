---
layout: post
title:  "Calendar API Architecture"
author: Thomas
tags: [ aws, databases, dev, javascript, meta, ops, serverless ]
description: Discussing the architecture of a microservice
---

A couple of weeks ago I finished and deployed a [Calendar API](/projects). The idea to build this API started from a desire to create a scheduling SaaS. I naturally needed some way to keep track of events and places for users, so I decided to create a reusable service for that purpose that could also be used again in the future. I also have plans to add some sort of scheduling into Elsewhere in the future, which reinforced the reusability motivation.

As with most of my projects, I wanted this API to be built on a fully serverless stack. That meant defining my DynamoDB data model and access patterns (there were definite tradeoffs), introducing myself to new AWS integrations, and implementing authentication for both myself and Rapid API in a way that I felt I was not boxed in. I also spent extra time going over my code and purposefully making myself design and write it to implement a hexagonal architecture, which was fun and feels so much more complete.

**Table of Contents:**

- [Data Model](#data-model)
- [API Design](#api-design)
- [API Gateway Service Proxy Integrations](#api-gateway-service-proxy-integrations)
- [Authentication](#authentication)
- [Hexagonal Architecture](#hexagonal-architecture)
- [Wrap Up](#wrap-up)

## Data Model

Data access patterns were some of the largest considerations I made while designing this service. The API itself is designed to lean into specific access patterns, but I also did not want to give up on anything that seem intuitive. Of course, there were the natural and easy endpoints that help create calendars and events then read, update, and delete those entities by their respective IDs. The single biggest access pattern that I had to think through was grabbing multiple events from a single calendar (`GET /calendars/{calendarId}/events`).

Designing how I wanted to model and store events in DynamoDB ended up being about the trickiest part of architecting this whole service. I wanted to allow users the ability to read events within a given time boundary.

The simplest way to store events would be with their respective calendar's ID as the partition key and their ID as the sort key. As long as a user retains all of the unique IDs, then access should not be a problem. However, this model would put quite a bit of overhead on users because they would now need to store information related to every calendar and event that they create without an easy way to retrieve them after creation.

One way of crossing the barrier of event retrieval would be to store a list of a calendar's events in the calendar's data model itself as a sort of metadata. Whenever a user wanted bulk event retrieval, I could simply return that list. I decided against doing this because it does not complete the function of a calendar. When I think of reading events on a calendar, I think of looking at all events within a time frame like within the next seven days, next Wednesday, or the third week of November. All other events outside of that time are out of the current scope, which is why I knew I needed to model events in such a way that I could retrieve them based on a certain timeframe.

Designing DynamoDB keys can be a little tricky, but I like to think of keys going from a wide scope and narrowing into the specific entity we are searching for. The given pieces of information that I needed to store in my events' keys were the calendar ID that they belonged to, their IDs, and some way to sort them by time. I decided on something quite unique compared to anything I have seen online before. My partition key for events looks similar to the format `{calendarId}#{date}`. This design choice did include a caveat on how I construct event IDs, which I will discuss in four paragraphs.

The reason I decided to use this format for my keys was that sorting based on time was now a first-class citizen. I also assumed that reading from a calendar normally happens in increments of days. Either by one day, business week, seven day week, or month. Now, whenever a user attempts to read multiple events from a calendar I can run a series of `Query`s on partition keys including the calendar ID (which is known from the endpoint) and dates within which the timeframe falls (which are required query parameters). For example, reading events between `2022-01-01T00:00:01Z` and `2022-01-03T00:00:01Z` results in `Query`s to `{calendarId}#2022-01-01`, `{calendarId}#2022-01-02`, and `{calendarId}#2022-01-03`. The results from those `Query`s are then filtered to only include events that take place within that timeframe.

It is generally known in the DynamoDB community to limit the amount of `Scan` and `Query` calls made because that is not really what DynamoDB was made to do best. My argument is that my use of `Query` here is more or less the equivalent of a `BatchGetItem` because I am using most (if not all) of the items returned in the `Query`. Since I would be looking up and returning a batch of events by date anyway, a `Query` seems to make a lot of sense here without forcing me to come up with some other homebrewed data structure to keep track of events by day.

One piece of functionality I wanted to implement was returning events in `GET /calendars/{calendarId}/events` even if the queried timeframe started halfway through an event. For example, if I had a five-day conference between Monday and Friday, I would want to see that event if I read events from my calendar between Wednesday and Thursday. If I simply wrote events in the partition where they started, I would not be able to read them with `Query`s on Wednesday and Thursday's dates. This led me to duplicate events across all the partitions during which they take place. For example, that conference would have a single event ID but the event object itself would be duplicated five times, once for each day it takes place.

Now to the caveat about the event ID mentioned four paragraphs ago. The discussion about `GET /calendars/{calendarId}/events` is complete, but what about `GET /calendars/{calendarId}/events/{eventId}`? Since events are stored in a partition key that includes a date (`{calendarId}#{date}`), there is a missing piece of information for a direct `GetItem` whenever this endpoint is called. I did not want to force users of my API to remember the dates when events started. Doing this would put quite a bit of overhead on users. Instead what I opted to do was encode an event's starting date in the event ID itself. This allows me to decode the date from the event ID after it is passed in through the path parameters to construct a valid partition key containing that event which enables me to call a simple `GetItem` to retrieve the event. I normally opt to use a simple UUID for entity IDs in my APIs, but this method deviated quite a bit from that norm. I am super happy with the outcome of this implementation though because I believe it opens up some interesting doors for future designs.

These two endpoints (`GET /calendars/{calendarId}/events` and `GET /calendars/{calendarId}/events/{eventId}`) were by far the trickiest but most rewarding to implement due to the abnormal data model I chose for my event entities. Calendars were quite the opposite data model because they were so standard. Simple key-value entities based on UUIDs as calendar IDs. I also added an endpoint for users to read all of the calendar IDs that they had created in case someone somehow forget an ID. Again, I wanted to minimize the amount of overhead for my API's users.

## API Design

When I set about designing the API's endpoints, I wanted it to feel RESTful and intuitive. Looking at the completed API, I believe I accomplished my goal. Using path parameters with API Gateway was new for me but they fit in perfectly well with [crow-api](https://www.npmjs.com/package/crow-api). I also needed to dive deeper into HTTP status codes and best practices surrounding what to return for various HTTP methods and the differences in synchronous and asynchronous endpoint statuses.

Using path parameters with API Gateway is as easy as adding a resource with the path parameter name surrounded by braces `{}`, for example `/calendars/{calendarId}`. Once the API Gateway resources are correctly set up, the path parameters will be passed into the corresponding Lambda function as `event.pathParameters`. `pathParameters` is an object with key names being the name of the path parameter, so if the path parameter we were after was `calendarId`, we could access it with `const calendarId = event.pathParameters.calendarId`.

I had prior experience with the various HTTP methods so I knew how to use them in a RESTful API. For the sake of completeness, I did still want to outline how I used them though. When I think of an entity in software, I think of four operations that can be enacted on that entity: create, read, update, and delete (or CRUD). I use four main HTTP methods that all correspond to an action. `POST` corresponds to create, `GET` corresponds to read, `PUT` corresponds to update, and `DELETE` corresponds to delete. To operate on a calendar with the API the following HTTP methods can be used with intuitive endpoints. `POST /calendars` creates a new calendar and returns its ID, `GET /calendars/{calendarId}` reads the calendar; `PUT /calendars/{calendarId}` updates the calendar; and `DELETE /calendars/{calendarId}` deletes the calendar. Designing my API like this follows best practices and expectations much closer. The endpoints almost document themselves and it minimizes the amount of scrutiny that developers need to work with the API as a whole.

What I learned about status codes relates to HTTP methods, which is why I wanted to at least bring up the various HTTP methods. Different status codes work better or are more of a best practice to return for different methods. Here is a list of all the different successful status codes that I used for the Calendar API: `200`, `201`, `202`, and `204`. Most APIs have a `200`, but I have not experienced too many with the other three status codes. `200` is the standard `OK` status code but is probably overused to simply mean that nothing went wrong while executing the endpoint. What I did not realize was that there are far more `2xx` codes that can give additional insight into what happened as a result of an endpoint being called. `201` means that an entity was successfully `Created`. A `202` means `Accepted`, which is more common in denoting that an endpoint is asynchronous, the request passed initial validation, and the request has been queued for action later on. `204` means the execution was successful but there is `No Content` and does not return anything. The error statuses that I used did not seem unfamiliar to me, but for some reason, I feel like most developers design APIs to simply return a `200` for every successful execution instead of giving a more specific success code.

Overall, this API was designed much better than the ones I have created in the past for personal projects, which was completely intentional. I wanted to design a more intuitive API because I knew that I wanted to publish it on [RapidAPI](https://rapidapi.com/tstep916/api/calendar22). Since this service's availability goes beyond me, I wanted to make sure that the developer experience was a good one.

## API Gateway Service Proxy Integrations

I have previously implemented API Gateway Service Proxy Integrations, but those prior configurations were nothing like what I did for the Calendar API. This time around, I wanted to get deeper into Velocity and implement full endpoints instead of the simple, internal-use-only endpoints that I had done before. Velocity might not be the nicest language to work with, but I set out to understand more of the capabilities of this feature, not with time efficiency in mind. For that reason, I do not recommend going the service proxy integration route for any endpoint with data transformation.

I wrote service proxy integrations for two main types of actions: reading from DynamoDB and putting events to an SNS topic. I had previously configured DynamoDB service proxy integrations, so I was not too worried about getting the integration working correctly. Especially with the CDK, the integration configuration is fairly straightforward and there is even an example on the `apigateway.AwsIntegration` class's documentation page.

The one part about setting up the DynamoDB integration that was slightly tricky was around setting default values. For example, if there is an optional attribute in an item, I wanted to either exclude it from a response or provide a default value. I could not find any solid examples of this when I looked. Instead what I ended up doing was setting a variable's value based on a condition that included looking for a value. There was a weird bit of Velocity syntax involved with casting an undefined value as a string, which you can see in the example.

```
#set($inputRoot = $input.path('$'))
#if ( "$!inputRoot.Item.optionalAttribute.S" == "" )
  #set($optionalAttribute = "defaultValue")
#else
  #set($optionalAttribute = $inputRoot.Item.optionalAttribute.S)
#end
```

Another nice lesson I learned from integrating with DynamoDB was how to override an integration response's status code, which is especially useful when querying for items by their keys. Let's assume that I had a data model with a simple key-value pair in DynamoDB with the key named `id`. If the `id` does not exist, then I would want to return a `404 Not Found`. However, DynamoDB will still return a `200` on a `GetItem` even if the item does not exist. What I ended up doing was checking for the `id` (much like the previous example) then overriding the status code without returning anything.

```
#if ( "$!inputRoot.Item.id.S" == "" )
  #set($context.responseOverride.status = 404)
#else
{
  "hello": "world"
}
#end
```

Configuring the SNS integration was not as straightforward as I had hoped it would be. Configuring any service proxy integration with anything other than DynamoDB is difficult because we need to reference the underlying API, which is not near as easy to navigate as the SDKs and CLI. To minimize the amount of duplicate content I post, [here is the post I wrote specifically about this subject](/blog/aws-cdk-example-for-api-gateway-and-sns-integration).

After all is said and done, I do not think that I would put a huge emphasis on service proxy integrations, especially for commonly used endpoints. The decreased latency benefit might exist, but I did not experience it except when dealing with Lambda cold starts. However, making requests to an endpoint using a service proxy integration compared to a warm Lambda showed negligible benefits in my opinion. Where I do still see service proxy integrations fitting in nicely is for smaller APIs that would not require Lambda otherwise to alleviate maintaining a codebase, or for infrequently used but still latency-sensitive APIs since cold starts are not a problem.

## Authentication

As I previously mentioned, before I started coding this service, I knew that I wanted to offer it on RapidAPI. I have [publish APIs on RapidAPI before](/blog/i-published-an-api-through-rapid-api), but this time I wanted to build out something much more than the earlier simple APIs. I like to iterate on things and this was just another iteration. While designing this API, I knew that it would require some form of authentication, which was not something that I had previously done or even looked into with RapidAPI.

Of course, I have [Crow Authentication](https://crowauth.thomasstep.com/) whenever I need it, but I did not like the idea of authenticating with a JWT for this API mostly because RapidAPI integrates with API keys. I do not believe that RapidAPI can be configured to follow a flow for getting a valid JWT. Unfortunately, API keys are not a great form of authentication especially not in the way that API Gateway offers them. API Gateway does not map many API keys to one unique identity, at least not that I know of, and I wanted to cover the use case of losing or rotating API keys without losing access to data which meant I needed to handle the many-to-one mapping.

What I ended up configuring on the API Gateway was both API key authentication and a custom Lambda authorizer. API Gateway first validates API keys before sending a request to the Lambda authorizer. I could then map the API key in my authorizer Lambda against a known entity in my database. The database items are simple key-value pairs with keys being valid API keys and the values being a unique entity being authenticated. I can now map any number of API keys back to a single entity and the authorizer Lambda will inject that context into the event.

For myself using this service, I simply need to create a new API key and map that key to an entity in my database to separate the new workload's resources from others'. However, if I authenticate for the Calendar API's resources based on API keys, wouldn't all RapidAPI users be able to access all other users' resources? This is where I needed to start leaning on RapidAPI's authentication. For every RapidAPI request, there are a few headers injected that get passed to downstream APIs. The headers that I rely on are `X-RapidAPI-Proxy-Secret` and `X-RapidAPI-User`. The proxy secret is only known to the API's publisher and the user is the authenticated RapiAPI user.

Those two RapidAPI-specific headers are the key to authentication in my authorizer Lambda. I have split logic depending on the existence of those headers. If they exist, I know that the request is from RapidAPI and I use the `X-RapidAPI-User` value as the entity I am authenticating. If those headers do not exist, then I follow the flow I had already outlined of getting the entity from my database.

I realize that this is not a standard way to authenticate. Another option that I had thought of was to duplicate the stack and determine the authentication flow using something like an environment variable for `IS_RAPID_API_AUTH` or something along those lines. Depending on the usage of this API, I might move to separate stacks later, but for now, this particular setup suits my needs.

## Hexagonal Architecture

The last area of the Calendar API that I wanted to discuss is the code structure. The theme of building out this API was iterating on what I have done in the past and making it "production-ready." I knew I wanted to offer it publicly and I knew that I would be reusing it, so it only made sense to make sure that the API was intuitive, self-documenting, well-architected, and easy to maintain. The easy maintenance piece is where hexagonal architecture came into play. Before this, I had never called code structure "hexagonal architecture." I had never heard of [hexagonal architecture before re:Invent](/blog/reinvent-evolutionary-aws-lambda-functions-with-hexagonal-architecture). After listening to that talk, I knew I wanted to learn more about it and implement something using a hexagonal architecture. This was my first real chance.

Having implemented this latest API with a hexagonal architecture I can say that I am pleased with the result and will continue using this style of approach in the future. All the code I wrote feels so much cleaner. My previously written code's structure was not far off from being considered hexagonal architecture, but there were a few areas that I had simply never bothered to implement, mainly the incoming adapter and all of the ports. Structuring that code slightly differently made all the difference though. I have a separate post about the [technical intricacies of implementing a hexagonal architecture](https://thomasstep.com/blog/how-i-implement-hexagonal-architecture-in-aws-lambda) in case that is of interest.

## Wrap Up

I am confident that maintaining this service will be easy. Not only is the API intuitive, but the code is clean and self-documenting as well. While I did design previous services and APIs that I have built, this one feels polished from the data model all the way to the user experience. It might not seem like much from the outside, but I would rather it seem like that than clunky, which is how I might describe something that I knew would only be used by myself.

The only real challenge that this API brought to the table was the [data model](#data-model). With less learning that I had to do, I got to spend more time iterating on what I already knew and polishing things up. That's where the better [API design](#api-design), experimental [service proxy integrations](#api-gateway-service-proxy-integrations), and cleaner [hexagonal architecture](#hexagonal-architecture) came into play. Building this service was a fun experience and a great teacher.