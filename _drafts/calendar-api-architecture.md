---
layout: post
title:  "Calendar API Architecture"
author: Thomas
tags: [ aws, databases, dev, javascript, meta, ops, serverless ]
description: Discussing the architecture of an microservice
---

A couple weeks ago I finished and deployed a [Calendar API](/projects). The idea to build this API started from a desire to create a scheduling SaaS. I naturally needed some way to keep track of events and places for users, so I decided to create a reusable service for that purpose that could also be used again in the future. I also have plans to add some sort of scheduling into Elsewhere in the future, which reinforced the reusability motivation.

As with most of my projects, I wanted this API to be built on a fully serverless stack. That meant defining my DynamoDB data model and access patterns (there were definite tradeoffs), introducing myself to new AWS integrations, and implementing authentication for both myself and Rapid API in a way that I felt I was not boxed in. I also spent extra time going over my code and purposefully making myself design and write it to implement a hexagonal architecture, which was actually fun and feels so much more complete.

**Table of Contents:**

- [Data Model](#data-model)
- [API Design](#api-design)
- [API Gateway Service Proxy Integrations](#api-gateway-service-proxy-integrations)
- [Authentication](#authentication)
- [Hexagonal Architecture](#hexagonal-architecture)

## Data Model

Data access patterns were some of the largest considerations I made while designing this service. The API itself is designed to lean into specific access patterns, but I also did not want to give up on anything that seem intuitive. Of course there were the natural and easy endpoints which help create calendars and events then read, update, and delete those entities by their respective IDs. The single biggest access pattern that I had to think through was grabbing multiple events from a single calendar (`GET /calendars/{calendarId}/events`).

Designing how I wanted to model and store events in DynamoDB ended up being about the trickiest part of architecting this whole service. I wanted to allow users the ability to read events within a given time boundary.

The simplest way to store events would be with their respective calendar's ID as the partition key and their ID as the sort key. As long as a user retains all of the unique IDs, then access should not be a problem. However, this model would put quite a bit of overhead on users because they would now need to store information related to every calendar and event that they create without an easy way to retrieve them after creation.

One way of crossing the barrier of event retrieval would be to store a list of a calendar's events in the calendar's data model itself as a sort of metadata. Whenever a user wanted bulk event retrieval, I could simply return that list. I decided against doing this because it does not complete the function of a calendar. When I think of reading events on a calendar, I think of looking at all events within a time frame like within the next seven days, next Wednesday, or the third week of November. All other events outside of that time are out of the current scope, which is why I knew I needed to model events in such a way that I could retrieve them based on a certain timeframe.

Designing DynamoDB keys can be a little tricky, but I like to think of keys going from a wide scope and narrowing into the specific entity we are searching for. The given pieces of information that I needed to store in my events' keys were the calendar ID that they belonged to, their IDs, and some way to sort them by time. I decided on something quite unique to anything I have seen online before. My partition key for events looks similar to the format `{calendarId}#{date}`. This design choice did include a caveat on how I construct event IDs, which I will discuss in four paragraphs.

The reason I decided to use this format for my keys was because sorting based on time was now a first-class citizen. I also made the assumption that reading from a calendar normally happens in increments of days. Either by one day, business week, seven day week, or month. Now, whenever a user attempts to read multiple events from a calendar I can run a series of `Query`s on partition keys including the calendar ID (which is known from the endpoint) and dates within which the timeframe falls (which are required query parameters). For example, reading events between `2022-01-01T00:00:01Z` and `2022-01-03T00:00:01Z` results in `Query`s to `{calendarId}#2022-01-01`, `{calendarId}#2022-01-02`, and `{calendarId}#2022-01-03`. The results from those `Query`s are then filtered to only include events that take place within that timeframe.

It is generally known in the DynamoDB community to limit the amount of `Scan` and `Query` calls made because that is not really what DynamoDB was made to do best. My argument is that my use of `Query` here is more or less the equivalent of a `BatchGetItem` because I am using most (if not all) of the items returned in the `Query`. Since I would be looking up and returning a batch of events by date anyway, a `Query` seems to make a lot of sense here without forcing me to come up with some other homebrewed data structure to keep track of events by day.

One piece of functionality I wanted to implement was returning events in `GET /calendars/{calendarId}/events` even if the queried timeframe started half-way through an event. For example, if I had a five day conference between Monday and Friday, I would want to see that event if I read events from my calendar between Wednesday and Thursday. If I simply wrote events in the partition where they started, I would not be able to read them with `Query`s on Wednesday and Thursday's dates. This led me to duplicate events across all the partitions during which they take place. For example, that conference would have a single event ID but the event object itself would be duplicated five times, once for each day it takes place.

Now to the caveat about the event ID mentioned four paragraphs ago. The discussion about `GET /calendars/{calendarId}/events` is complete, but what about `GET /calendars/{calendarId}/events/{eventId}`? Since events are stored in a partition key that includes a date (`{calendarId}#{date}`), there is a missing piece of information for a direct `GetItem` whenever this endpoint is called. I did not want to force users of my API to remember the dates when events started. Doing this would put quite a bit of overhead on users. Instead what I opted to do was encode an event's starting date in the event ID itself. This allows me to decode the date from the event ID after it is passed in through the path parameters to construct a valid partition key containing that event which enables me to call a simple `GetItem` to retrieve the event. I normally opt to use a simple UUID for entity IDs in my APIs, but this method deviated quite a bit from that norm. I am super happy with the outcome of this implementation though because I believe it opens up some interesting doors for future designs.

These two endpoints (`GET /calendars/{calendarId}/events` and `GET /calendars/{calendarId}/events/{eventId}`) were by far the trickiest but most rewarding to implement due to the abnormal data model I chose for my event entities. Calendars were quite the opposite data model because they were so standard. Simple key-value entities based on UUIDs as calendar IDs. I also added an endpoint for users to read all of the calendar IDs that they had created in case someone somehow forget an ID. Again, I wanted to minimize the amount of overhead for my API's users.

## API Design

When I set about designing the API's endpoints, I wanted it to feel RESTful and intuitive. Looking at the completed API, I believe I accomplished my goal. Using path parameters with API Gateway was new for me but they fit in perfectly well with [crow-api](https://www.npmjs.com/package/crow-api). I also needed to dive deeper into HTTP status codes and best practices surrounding what to return for various HTTP methods and the differences in synchronous and asynchronous endpoint statuses.

Using path parametrs with API Gateway is as easy as adding a resource with the path parameter name surrounded by braces `{}`, for example `/calendars/{calendarId}`. Once the API Gateway resources are correctly set up, the path parameters will be passed into the corresponding Lambda function as `event.pathParameters`. `pathParameters` is an object with key names being the name of the path parameter, so if the path parameter we were after was `calendarId`, we could access it with `const calendarId = event.pathParameters.calendarId`.

I had prior experience with the various HTTP methods so I knew how to use them in a RESTful API. For the sake of completeness, I did still want to outline how I used them though. When I think of an entity in software, I think of four operations that can be enacted on that entity: create, read, update, and delete (or CRUD). I use four main HTTP methods that all correspond to an action. `POST` corresponds to create, `GET` corresponds to read, `PUT` corresponds to update, and `DELETE` corresponds to delete. To operate on a calendar with the API the following HTTP methods can be use with intuitive endpoints. `POST /calendars` creates a new calendar and returns its ID, `GET /calendars/{calendarId}` reads the calendar; `PUT /calendars/{calendarId}` updates the calendar; and `DELETE /calendars/{calendarId}` deletes the calendar. Designing my API like this follows best practices and expectations much closer. The endpoints almost document themselves and it minimizes the amount of scrutiny that developers need to work with the API as a whole.

What I learned about status codes relates to HTTP methods, which is why I wanted to at least bring up the various HTTP methods. There are different status codes that work better or are more of a best practice to return for the different methods. Here is a list of all the different successful status codes that I used for the calendar API: `200`, `201`, `202`, and `204`. Most APIs have a `200`, but I have not experienced too many with the other three status codes. `200` is the standard `OK` status code, but is probably overused to simply mean that nothing went wrong while executing the endpoint. What I did not realize was that there are far more `2xx` codes that can give additional insight into what happened as a result of an endpoint being called. `201` means that an entity was successfully `Created`. A `202` means `Accepted`, which is more common in denoting that an endpoint is asynchronous, the request passed initial validation, and the request has been queued for action later on. `204` means the execution was successful but there is `No Content` and does not return anything. The error statuses that I used did not seem unfamiliar to me, but for some reason, I feel like most developers design APIs to simply return a `200` for every successful execution instead of giving a more specific success code.

Overall, this API was designed much better than ones I have created in the past for personal projects, which was completely intentional. I wanted to design a more intuitive API because I knew that I wanted to publish it on [RapidAPI](https://rapidapi.com/tstep916/api/calendar22). Since this service's availability goes beyond myself, I wanted to make sure that the developer experience was a good one.

## API Gateway Service Proxy Integrations

api gateway direct integrations

## Authentication

auth and api keys for rapid api and personal use

## Hexagonal Architecture

implemented lambdas using hexagonal architecture for the first time