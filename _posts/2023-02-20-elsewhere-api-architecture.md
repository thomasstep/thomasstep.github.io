---
layout: post
title:  "Elsewhere API Architecture"
author: Thomas
tags: [ aws, databases, dev, go, meta, ops, serverless ]
description: Discussing the architecture of a microservice
---

I recently remade [Elsewhere](https://elsewhere.thomasstep.com/) from the [ground up](/blog/remaking-elsewhere). A huge part of that effort was to redesign and rearchitect the API. While there was nothing inherently surprising about this API, I want to cement what I did similar to my [calendar API](/blog/calendar-api-architecture) and [Papyrus](/blog/papyrus-architecture).

**Table of Contents:**

- [Data Model](#data-model)
- [API Design](#api-design)
- [Wrap Up](#wrap-up)

## Data Model

The data model for the Elsewhere API is fairly straightforward although I did add a slight bit of complexity around trip ownership, which I will cover last. At the start, there are two entities that the data model and API care about and they are trips and entries. Trips and entries both directly correspond to their attributes stored. A trip is identified by a primary key corresponding to its ID, which is a GUID generated on creation, and a simple string serving as the secondary key: "config". An entry is identified by a primary key of the trip's ID it belongs to and a secondary key which is also a GUID generated on creation. The trip and entry items each contain attributes that nearly directly correspond to the API schema.

As I said, the data model gets somewhat strange when it comes to ownership of the trips. Since trips can be shared amongst travel partners, there needed to be some way to identify the owner/creator of the trip and any collaborators. I also wanted a way to read all the trips that a user owns and collaborates on. The authentication uses the bearer token strategy so I would be relying on the `sub` claim in the token to identify users. (I wanted to have the option to switch authentication providers in the future and `sub` is a required claim in any JWT.) The data model contains an item for each trip and the collaborators (including the owner) on that trip with duplication across all of those items. Cumbersome, I know.

I debated how I was going to model this relationship in DynamoDB. There are existing patterns for many-to-many relationships and the one that was closest to what I wanted to do would be [using an adjacency list](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-adjacency-graphs.html#bp-adjacency-lists). My minor gripe with using an adjacency list is that I wanted to be able to verify that a user had access to a trip and get the trip information in one call to DynamoDB. Verifying access is possible with my model and an adjacency list using a GSI because we would simply attempt to get an item with a given trip ID and user ID to check that it exists. To get trip information, my model would simply look at the attributes of the read request that checked user authorization on a trip, since the trip information is duplicated across all of those items. Using an adjacency list with a GSI would mean that I need to make an additional read request for the trip-specific attributes or make a bulk read originally and throw out the trip-specific result if the user was not a collaborator (in the example from the earlier link in this paragraph, the item would have a key similar to PK: trip ID, SK: trip ID). With the GSI, I would also have additional writes to the GSI for any entry that is created, and there should be multitudes more entries created than trip updates since the only updateable attribute of a trip is its name.

My model is not unlike the adjacency list example, I just have more duplication. In short, I made a bet that there would be fewer overall writes by duplicating trip-specific information across all adjacencies compared to using a GSI like what is shown in the linked example. I want to make a clear disclaimer that I am far from a NoSQL master like Rick Houlihan or Alex DeBrie. I have a decent amount of exposure to different data models and I chose to take on the risk of blazing my own trail here. Is what I did a bad idea? Probably. Time will tell.

## API Design

I made an OpenAPI document for this API. I surprised myself with that. I didn't think I had it in me to be that formal with a side project. The API for Elsewhere is nothing special. There are two main entities: trips and entries. A user can own multiple trips and collaborate on multiple trips. Entries belong to trips and contain information such as location and time. I wanted to make Elsewhere super flexible so none of the properties are required for either trips or entries, which means that an entry can show up on the map view, the schedule view, neither, or both in the UI depending on how a user wants to represent something.

The operations that can be enacted on the entities are controlled by their respective HTTP methods: `POST` to create, `GET` to read, `PUT` to update, and `DELETE` to delete. Trips are a "top-level" entity so the endpoints are `/trip` and `/trip/{tripId}`. Since entries belong to trips, the endpoints help provide context for which trip entries are being worked on. The entry endpoints are `/trip/{tripId}/entry` and `/trip/{tripId}/entry/{entryId}`. Simple and straightforward.

## Wrap Up

As I mentioned in the beginning there is nothing inherently surprising about this API, which is fine by me. The API is self-explanatory, and the only slight complexity is around the data model and how I handle the many-to-many relationship of users and trip collaboration. Nonetheless, I am happy that I was able to come back to this project and improve the API so much. Cleaning the endpoints up and using a technology stack that I am now very familiar with helped a ton. Having a clean API also made thinking about the UI that much easier. I am not a frontend engineer, but I wanted the opportunity to try my hand at it. Knowing that the API was not fragile helped me when it came to making resilient components and designing how I wanted to display trip information.
