---
layout: post
title:  "Handling DynamoDB Validation Exception For Maps"
author: Thomas
tags: [ aws, databases, dev, javascript, ops, serverless ]
description: How to fix Validation Exception while updating properties in maps
---

TL;DR: you need to create a map before you can set nested properties of that map

Lately I have been working on a site analytics service in response to [one of my recent posts](/blog/building-a-site-analytics-application). ([I am also streaming everything as I go if you want to follow along.](https://www.youtube.com/watch?v=veCyV07dsg4&list=PLzcYUWwW5dVDA6mja1de7d2A2L9gppkFL)) I have been using DynamoDB as my database and came across a problem that I had not before.

In my [data model](https://github.com/thomasstep/site-analytics#data-model) I am storing site statistics for different categories as maps where the attribute name is the category. For example, storing page views falls under an attribute called `pageViews` and the statistics are stored as a map where the keys of the map would be pages and the value for those keys would be the total count. I wrote some code for an `UpdateExpression` that simply incremented the current count of a certain key, the result would look something like `SET #pageView.#pagePath = if_not_exists(#pageView.#pagePath, :zero) + :one`. As these things go, when I first started testing this out I recieved a `ValidationException` error saying `The document path provided in the update expression is invalid for update`.

The problem that I ran into was that the attribute (`pageViews`) did not exist and so was not of type `Map`. I hoped it would automatically infer its type during the update and let me set a property value without needing to initialize anything. That is the behavior with other attribute types, so that is what I based my assumptions on. As it turns out, a map type needs to first be initialized before any of its values can be set. My solution was to catch the validation error, create the attributes as empty maps, and then retry the original update. Here is what that might look like.

```javascript
try {
    await documentClient.update({
      TableName,
      Key: {
        id: myId,
        secondaryId: mySecondaryId,
      },
      ...mapUpdateParams,
    });
  } catch (err) {
    if (
      err.name === 'ValidationException'
      && err.message === 'The document path provided in the update expression is invalid for update'
    ) {
      // If one of the attributes has not yet been created,
      //   create them as empty maps...
      const emptyMapUpdateParams = constructEmptyMapUpdates(stats);
      await documentClient.update({
        TableName,
        Key: {
          id: `${id}#${date}`,
          secondaryId: statsSecondaryId,
        },
        ...emptyMapUpdateParams,
      });

      // ...then retry the updates
      await documentClient.update({
        TableName,
        Key: {
          id: `${id}#${date}`,
          secondaryId: statsSecondaryId,
        },
        ...mapUpdateParams,
      });
    } else {
      throw err;
    }
  }
```
