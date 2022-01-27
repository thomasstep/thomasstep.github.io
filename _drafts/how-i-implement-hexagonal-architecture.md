At re:Invent 2021, I learned about an architecture called hexagonal architecture. I am a curious person so I started looking further into it. Like most architecture concepts, I could not find many examples of hexagonal architecture implementations. I ran back into my own [article about hexagonal architecture](/blog/reinvent-evolutionary-aws-lambda-functions-with-hexagonal-architecture) or some copy and pasted content farm's article which took some buzzwords from [Alistair Cockburn's original post](https://alistair.cockburn.us/hexagonal-architecture/) and made it their own.

Fast forward to this week and I stumbled across a video on YouTube titled [Hexagonal Architecture by Example](https://www.youtube.com/watch?v=qZEMSK6S0QM). This is what I was originally looking for, and it spurred me on to finish out my understanding of this architecture. The video is helpful to watch through, but the [GitHub repo](https://github.com/onicagroup/hexagonal-example) they made available was my fast track to a better understanding. Having the good and bad versions of the same code right next to each other was a key for me. They also used slightly different names than the [code base demoed in the re:Invent talk](https://github.com/aws-samples/aws-Lambda-hexagonal-architecture) that I attended.

While I had never heard of `domains`, `ports`, and `adapters`, I did know about the `handlers` and `repositories` used in this newly found repo, which brings me to my first point of understanding: the naming is mostly arbitrary, the use and context boundaries are what matter. Both of these code bases did the same thing, but with slightly different naming. The idea was that a request could come in to an `adapter`, that `adapter` would then communicate with business logic (`domain`) through a `port`. If the business logic needed to initiate communicate with anything outside of its own boundaries, then it would also communicate through a `port` to another `adapter`.

While I was able to start reading and understanding the code in both repos and understanding where the context boundaries lied, I was still slightly confused about why we needed `port`s at all. Both repos' examples showed `port`s as simply a passthrough, so why not just have an `adapter` call the business logic and the business logic call `adapter`s? The answer was something I had seen over and over again in the software engineering world.

[`SOLID`](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design) is a commonly used acronym which gives us principles for OOP. The `D` stands for [dependency inversion priciple](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design#dependency-inversion-principle), which basically means that code should rely on abstractions not code that implements functionality. In the context of hexagonal architecture, `port`s are the abstraction and `adapter`s and business logic are the code that implements functionality. A `port` is commonly implemented using an interface, but it is a conceptually a contract between an `adapter` and business logic for requests and responses similar to an [API model](/blog/api-gateway-models).

With my newfound understanding of hexagonal architecture, I looked back at some of my past projects and wanted to see how far off I was from implementing the architecture. It turns out that I was not far off. We can take a peek at a smaller Lambda real quick to get an idea of what I used to have, then I will refactor my code to fit a hexagonal architecture and highlight the changes I make along the way.

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
    console.error(uncaughtError);
    throw uncaughtError;
  }
}

/**
 * File: /opt/database/events
 */
const { documentClient } = require('./databaseSession');
const { constructUpdates } = require('./constructUpdates');
const {
  PRIMARY_TABLE_NAME: TableName,
  EVENT_ID_SEPARATOR, // See comment in config.js
} = require('../config');
const { generateToken } = require('../generateToken');

async function create(calendarId, dates, event) {
  const newEventId = generateToken();
  // The "event ID" is the earliest date plus the token
  const officialEventId = `${dates[0]}${EVENT_ID_SEPARATOR}${newEventId}`;
  const putPayloads = [];
  dates.forEach((date) => {
    putPayloads.push({
      PutRequest: {
        Item: {
          id: `${calendarId}#${date}`,
          secondaryId: `${date}${EVENT_ID_SEPARATOR}${newEventId}`,
          eventId: officialEventId,
          ...event,
        },
      },
    });
  });
  const batchWritePayload = {
    RequestItems: {
      [TableName]: putPayloads,
    },
  };
  await documentClient.batchWrite(batchWritePayload);

  return officialEventId;
}

module.exports = {
  create,
};
```

Luckily enough, I already had my database functionality completely separate from my business logic due to a [past experience](/blog/example-for-using-the-single-responsibility-principal). However, the database calls are the code implementing functionality, so my business logic should be communicating with it through an abstraction (`port`) not directly. My Lambda's business logic also knows about my data model and that I am using DynamoDB because the `getDateRange` call would only be used for a NoSQL database. (This is an implementation detail, and I do not believe that it is necessary for understanding the refactor. The main point is that my business logic knows about database-specific implementation details.)

My incoming `adapter` would be what transforms the Lambda-function-specific call into the parameters needed for my business logic to run and then communicate through a `port` to my business logic. Currently there is no incoming `adapter` or `port`.

First let's tackle the incoming `adapter` and `port`.