---
layout: post
title:  "How I Implement Hexagonal Architecture in AWS Lambda"
author: Thomas
tags: [ aws, databases, dev, javascript ]
description: TBD
---

At re:Invent 2021, I learned about hexagonal architecture. I am a curious person so I started looking further into it. Like most architecture concepts, I could not find many examples of hexagonal architecture implementations. I ran back into my own [article about hexagonal architecture](/blog/reinvent-evolutionary-aws-lambda-functions-with-hexagonal-architecture) or some copy and pasted content farm's article which took some buzzwords from [Alistair Cockburn's original post](https://alistair.cockburn.us/hexagonal-architecture/) and made it their own.

Fast forward to this week and I stumbled across a video on YouTube titled [Hexagonal Architecture by Example](https://www.youtube.com/watch?v=qZEMSK6S0QM). This is what I was originally looking for, and it spurred me on to finish out my understanding of this architecture. The video is helpful to watch through, but the [GitHub repo](https://github.com/onicagroup/hexagonal-example) they made available was my fast track to a better understanding. Having the good and bad versions of the same code right next to each other was a key for me. They also used slightly different names than the [code base demoed in the re:Invent talk](https://github.com/aws-samples/aws-Lambda-hexagonal-architecture) that I attended.

While I had never heard of `domains`, `ports`, and `adapters`, I did know about the `handlers` and `repositories` used in this newly found repo, which brings me to my first point of understanding: the naming is mostly arbitrary, the use and context boundaries are what matter. Both of these codebases did the same thing, but with slightly different naming. The idea was that a request could come into an `adapter`, that `adapter` would then communicate with business logic (`domain`) through a `port`. If the business logic needed to initiate communication with anything outside of its boundaries, then it would also communicate through a `port` to another `adapter`.

While I was able to start reading and understanding the code in both repos and understanding where the context boundaries lied, I was still slightly confused about why we needed `port`s at all. Both repos' examples showed `port`s as simply a passthrough, so why not just have an `adapter` call the business logic and the business logic call `adapter`s? The answer was something I had seen over and over again in the software engineering world.

[`SOLID`](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design) is a commonly used acronym which gives us principles for OOP. The `D` stands for [dependency inversion priciple](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design#dependency-inversion-principle), which means that code should rely on abstractions not code that implements the functionality. In the context of hexagonal architecture, `port`s are the abstraction and `adapter`s and business logic is the code that implements the functionality. A `port` is commonly implemented using an interface, but it is a conceptually a contract between an `adapter` and business logic for requests and responses similar to an [API model](/blog/api-gateway-models).

With my newfound understanding of hexagonal architecture, I looked back at some of my past projects and wanted to see how far off I was from implementing the architecture. It turns out that I was not far off. We can take a peek at a smaller Lambda real quick to get an idea of what I used to have, then I will refactor my code to fit a hexagonal architecture and highlight the changes I make along the way. For a slight bit of context, this code is a Lambda handler for a calendar API that I wrote. This particular endpoint creates an event for a calendar under the path `/calendars/{calendarId}/events` where `{calendarId}` is replaced by the user as the ID for a previously created calendar that they would like to modify.

```javascript
/**
 * File: index.js
 */

const events = require('/opt/database/events');
const { getDateRange } = require('/opt/getDateRange');
const { logger } = require('/opt/logger');

exports.handler = async function (event, context, callback) {
  try {
    const calendarId = event.pathParameters.calendarId;
    const body = JSON.parse(event.body);

    // Create Dates
    let startTime;
    let endTime;
    try {
      startTime = new Date(body.startTime);
      endTime = new Date(body.endTime);
    } catch (err) {
      logger.error('startTime and endTime are not ISO 8601 format.');
      const errorPayload = {
        statusCode: 400,
        body: JSON.stringify({
          errorMessage: 'startTime and endTime must be ISO 8601 timestamps e.g. 1995-12-13T03:24:00Z.',
        }),
      };
      return errorPayload;
    }

    // Check start comes after end
    if (!(startTime < endTime)) {
      logger.error('startTime is not earlier than endTime.');
      const errorPayload = {
        statusCode: 400,
        body: JSON.stringify({
          errorMessage: 'startTime must come before endTime.',
        }),
      };
      return errorPayload;
    }

    const dates = getDateRange(startTime, endTime);
    const eventId = await events.create(calendarId, dates, body);

    const data = {
      statusCode: 200,
      body: JSON.stringify({
        id: eventId,
      }),
    };
    return data;
  } catch (uncaughtError) {
    logger.error(uncaughtError);
    throw uncaughtError;
  }
}

/**
 * File: /opt/database/events.js
 */

const { documentClient } = require('./databaseSession');
const { generateToken } = require('../generateToken');

async function create(calendarId, dates, event) {
  const eventId = generateToken();
  const batchWritePayload = {};
  // Construct batchWritePayload
  await documentClient.batchWrite(batchWritePayload);

  return eventId;
}

module.exports = {
  create,
};
```

Luckily enough, I already had my database functionality completely separate from my business logic due to a [past experience](/blog/example-for-using-the-single-responsibility-principal). However, the database calls are the code implementing functionality, so my business logic should be communicating with it through an abstraction (`port`) not directly. My Lambda's business logic also knows about my data model and that I am using DynamoDB because the `getDateRange` call would only be used for a NoSQL database. (This is an implementation detail, and I do not believe that it is necessary for understanding the refactor. The main point is that my business logic knows about database-specific implementation details.)

My incoming `adapter` would be what transforms the Lambda-function-specific call into the parameters needed for my business logic to run and then communicate through a `port` to my business logic. Currently, there is no incoming `adapter` or `port`.

First, let's tackle the incoming `adapter` and `port`.

```javascript
/**
 * File: index.js
 */

const { InputError } = require('/opt/errors');
const {
  GOOD_STATUS_CODE,
  BAD_INPUT_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require('/opt/config');
const { logger } = require('/opt/logger');

const { port } = require('./port');

exports.handler = async function (event, context, callback) {
  try {
    const calendarId = event.pathParameters.calendarId;
    const body = JSON.parse(event.body);

    const eventId = await port(calendarId, body);
    const data = {
      statusCode: GOOD_STATUS_CODE,
      body: JSON.stringify({
        id: eventId,
      }),
    };
    return data;
  } catch (err) {
    logger.error(err);
    let statusCode = SERVER_ERROR_STATUS_CODE;
    let message = 'Internal server error';

    if (err instanceof InputError) {
      statusCode = BAD_INPUT_STATUS_CODE;
      message = err.message;
    }

    const errorPayload = {
      statusCode,
      body: JSON.stringify({
        message,
      }),
    };

    return errorPayload;
  }
}

/**
 * File: port.js
 */

const { InputError } = require('/opt/errors');

const { logic } = require('./logic');

exports.port = async function (calendarId, payload) {
  // Validate input format
  try {
    startTime = new Date(payload.startTime);
    endTime = new Date(payload.endTime);
  } catch (err) {
    throw new InputError('startTime and endTime must be ISO 8601 timestamps e.g. 1995-12-13T03:24:00Z.');
  }

  // Construct event based on contract
  const event = {
    title: payload.title,
    startTime: payload.startTime,
    endTime: payload.endTime,
  };

  const eventId = await logic(calendarId, event);
  return eventId;
}
```

While going about this refactor I decided to leave the Lambda configuration completely intact and only move code, so the incoming `adapter` will remain as the `index.handler`. Since this is the incoming `adapter` all it needs to do is parse out the required parameters for the `port`, call the `port`, and then return to the client. That is all it does. The other additions used to clean up this code were the `InputError` and `*_STATUS_CODE` constants. I wanted to be able to throw and handle custom errors as well as get rid of "magic numbers."

The `port` could have been an easy pass-through, but I also wanted to add a bit of validation before throwing the parameters at my business logic. The `Date` creation validation was present in the old handler. Constructing the `event` based on my contract with the `logic` function might be a little overkill since I also have a model set up for this endpoint in my API Gateway but I am going for reusability and proper abstraction. Completely validating and constructing the `event` for `logic` ensures that whatever is calling my `port` abstraction does not matter. This `port` should take care of any details thus becoming a proper abstraction.

The next chunk of code I looked at was the business logic itself.

```javascript
/**
 * File: logic.js
 */

const { InputError } = require('/opt/errors');
const { createEvent } = require('/opt/ports');
const { logger } = require('/opt/logger');

/**
 * Business logic
 * @param {string} calendarId
 * @param {Object} event
 * @param {string} event.title
 * @param {string} event.startTime ISO-8601 format
 * @param {string} event.endTime ISO-8601 format
 * @returns {string}
 */

exports.logic = async function (calendarId, event) {
  // Check that start comes before end
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  if (!(startTime < endTime)) {
    throw new InputError('startTime must come before endTime.');
  }

  const eventId = await createEvent(calendarId, event);

  return eventId;
}
```

Here I could move the `Date` creation validation out since `logic` now knows that it will be called with a properly formatted `event.startTime` and `event.endTime`. If I were using Typescript, I would have created an `interface`. Using Javascript means that I need to hold myself a little more accountable and enforce the contract in code on my own. `logic` only deals with value-specific validation since it can know the contract has been met, which we see with the start and end time comparisons. It also no longer deals with the database implementation details, but rather passes the relevant information on and lets the database `adapter` deal with constructing the data model.

Lastly, I refactored my outgoing/database `port` and `adapter`.

```javascript
/**
 * File: /opt/ports.js
 */

const events = require('/opt/database/events');
const { getDateRange } = require('/opt/getDateRange');

async function createEvent(calendarId, event) {
  const dates = getDateRange(startTime, endTime);
  const eventId = await events.create(calendarId, dates, event);
  return eventId;
}

module.exports = {
  createEvent,
};

/**
 * File: /opt/database/events.js
 */

const { documentClient } = require('./databaseSession');
const { generateToken } = require('../generateToken');

async function create(calendarId, dates, event) {
  const eventId = generateToken();
  const batchWritePayload = {};
  // Construct batchWritePayload
  await documentClient.batchWrite(batchWritePayload);

  return eventId;
}

module.exports = {
  create,
};
```

Notice anything? The code in `/opt/database/events.js` did not have the change. As I said, I luckily had the database functionality properly abstracted, the problem was that my business logic called the database functionality instead of an abstraction (the database `port`) to the functionality. This made the refactor for my database `port` and `adapter` simple. All I needed to do was move the `getDateRange` call outside of my business logic into my `port` and have my `port` call the database `adapter`.

Well, there we have it. I have been wanting to implement a hexagonal architecture, especially in Lambda functions, since I attended that talk at re:Invent a few months ago. After finding another few key resources on implementation, I am now much more confident that I understand the details and boundaries. As I have said in plenty of my other posts, I use kaizen in many aspects of my life. This is only my first pass at implementing a hexagonal architecture so take it with a grain of salt. I have implemented everything to the best of my knowledge but I am sure I will learn new and better ways in the future. For now, I hope this has helped someone else jump to implementation understanding quicker. Happy coding.