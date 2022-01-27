---
layout: post
title:  "How To Use The DynamoDB Document Client"
author: Thomas
tags: [ aws, databases, dev, javascript, serverless ]
description: How to use the AWS SDK v3 DynamoDB Document Client
---

In my [Guide To Building With Serverless AWS](https://thomasstep.com/blog/gtbwsa-chapter-9-dynamodb) chapter about DynamoDB, I mention using the [Document Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html) to communicate with DynamoDB instead of some other alternatives like the lower-level client. In this post I would like to discuss and give code examples for some of the specific [DynamoDB APIs](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.API.html#HowItWorks.API.DataPlane). When I started using the Document Client I had a little bit of trouble translating the lower level client and APIs calls into Document Client calls but after seeing some examples and reading how I translate the payloads, I hope that all of that will be much easier for you. As a side note, what I will be showing in this post uses the AWS Javascript SDK **v3**. While the lower versions (and potentially future versions) will most likely look similar, this code is specifically for version 3.

Transforming a payload to include data types for DynamoDB calls can be tedious. For the sake of my own understanding, I have used the lower level SDK client to manually code the DynamoDB types, and having done that, I much prefer the Document Client for ease of use. The Document Client uses native Javascript types to conclude the data type for DynamoDB and then transforms the payload for us.

The Document Client in the SDK is a thin layer on top of the [lower-level/normal client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html) that does the transformation. It is available in the `@aws-sdk/lib-dynamodb` package but the `@aws-sdk/client-dynamodb` is still required.

Before I start showing the code examples I want to make note of a couple of assumptions that the code will be making.

First is that the DynamoDB table is created and the name of the table is available through an environment variable called `TABLE_NAME`. In the code examples, you will see `TableName: process.env.TABLE_NAME`.

The code also assumes that the table is configured to use a partition key with the name `id` and a sort key with the name `secondaryId`. This will be seen in examples looking like the following.

```
Item: {
  id: 'myId',
  secondaryId: 'mySecondaryId',
},
```

Both the partition and sort key names can be configured to whatever you would like. The `id` and `secondaryId` keys in the `Item` object would then need to be changed accordingly. I suggest not hardcoding either of these values like I am in the examples. For the partition key (`id`), I suggest using something like a generated UUID or a value unique to that item's data. The sort key (`secondaryId`) value will be more dependent on your data model, but some suggestions could be using a configured value pulled from a module, an environment variable, or a value specific to that item's data.

If you do not know much about data modeling, I highly suggest learning more and determining how to model your data before using DynamoDB. I lightly discuss modeling in [this post](https://thomasstep.com/blog/gtbwsa-chapter-9-dynamodb) but there are other great resources out there from Rick Houlihan (find his re:Invent talks on YouTube) and [Alex DeBrie](https://www.alexdebrie.com/).

Remember that these are simply examples and you can change your code however you would like. I simply want to show what the calls could look like.

**Table of Contents:**

1. [Creating the Document Client](#creating-the-document-client)
2. [PutItem](#putitem)
3. [BatchWriteItem](#batchwriteitem)
4. [GetItem](#getitem)
5. [Query](#query)
6. [UpdateItem](#updateitem)
7. [DeleteItem](#deleteitem)

---

## Creating the Document Client

Creating the Document Client first involves creating a normal client and then initializing the Document Client with the normal client. I like to use a single module and then export the client for use in subsequent modules.

```javascript
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const documentClient = DynamoDBDocument.from(client);

module.exports = {
  documentClient,
};
```

## `PutItem`

[AWS Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html)

Creating a new item in DynamoDB involves either a `PutItem` or [`BatchWriteItem`](#batchwriteitem) API call. An `Item` is passed in and the partition and sort key need to be present. Any additional values in the `Item` will be written as attributes.

```javascript
const myItem = {
  hello: 'world',
  value: 3,
};

await documentClient.put({
  TableName: process.env.TABLE_NAME,
  Item: {
    id: 'myUniqueId',
    secondaryId: 'secondaryId',
    ...myItem,
  },
});
```

## `BatchWriteItem`

[AWS Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html)

This API was slightly more confusing to me. The top level of the payload contains a `RequestItems` key. The values for `RequestItems` are key-value pairs where the keys are table names and the values are arrays of requests being sent to each table. The requests in the arrays are also key-value pairs where the keys are either `PutRequest` or `DeleteRequest` and the values are either `Item` (similar to [`PutItem`](#putitem)) or `Key` (similar to [`DeleteItem`](#deleteitem)), respectively.

```javascript
const myItems = [
  {
    hello: 'world',
    value: 3,
  },
  {
    hello: 'mars',
    value: 5,
  },
  {
    hello: 'saturn',
    value: 0,
    rings: true,
  },
];

const requests = [];
myItems.forEach((myItem) => {
  requests.push({
    PutRequest: {
      Item: {
        // Keep in mind that each partition and sort key will need
        // to be unique for each item
        id: 'myUniqueId',
        secondaryId: 'secondaryId',
        ...myItem,
      },
    },
    // Similar payload for DeleteRequest
    // DeleteRequest: {
    //   Key: {
    //     id: 'myUniqueId',
    //     secondaryId: 'secondaryId',
    //   },
    // },
  });
});
const batchWritePayload = {
  RequestItems: {
    [process.env.TABLE_NAME]: requests,
  },
};
await documentClient.batchWrite(batchWritePayload);
```

## `GetItem`

[AWS Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html)

Retrieving an item is fairly simple. We pass in the partition and sort key and get back a response containing some metadata and the `Item`.

```javascript
const res = await documentClient.get({
  TableName: process.env.TABLE_NAME,
  Key: {
    id: 'myUniqueId',
    secondaryId: 'secondaryId',
  },
});
const item = res.Item;
```

## `Query`

[AWS Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html)

There are some additional fields in `query` that might seem confusing at first. `KeyConditionExpression` for a `query` needs to define the value of the partition key and can optionally specify a comparison with a value for the sort key. In my example, the sort key is simply compared with equals (`=`) to the value (`secondaryId`) but I could have just as easily used any of the supported [key condition expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.KeyConditionExpressions).

The next confusing parts are the `ExpressionAttributeNames` and `ExpressionAttributeValues`. Each is a way to dynamically reference a value in the `KeyConditionExpression` without needing to do string substitution. With the Document Client, this is straightforward, but for some context, without the Document Client, we would have needed to add data types to the values in `ExpressionAttributeValues`. The strings to be referenced by `ExpressionAttributeNames` should be prefixed with a hash sign (`#`) and `ExpressionAttributeValues` should be prefixed with a colon (`:`). The prefix characters are not a convention, they are explicitly stated in the documentation.

After results have been gathered from the table, we can further refine the results by making DynamoDB filter what has been queried using the `FilterExpression`. This is a good place to go over results with a fine-toothed comb, but just know that a `query` consumes read requests units based on the results returned by the `KeyConditionExpression`, not only the results returned after further refinement using the `FilterExpression`. Again, this is a data modeling problem. The `FilterExpression` uses the same syntax as the `KeyConditionExpression` but can be written for any attribute in the `Item`.

Lastly, the `ProjectionExpression` is a comma-separated list of attributes that should be retrieved by DynamoDB and returned as a result of the `query`. If we were querying the items from the `BatchWriteItem`(#batchwriteitem) example, we would on retrieve `hello` and `value` but not `rings`.

We get back a response containing some metadata and the `Items` we match the `KeyConditionExpression` and `FilterExpression`.

```javascript
const res = await documentClient.query({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'id = :partitionKey AND secondaryId = :sortKey',
  ExpressionAttributeNames: {
    '#valueName': 'value',
  },
  ExpressionAttributeValues: {
    ':partitionKey': 'myUniqueId',
    ':sortKey': 'secondaryId',
    ':minValue': 3,
  },
  FilterExpression: '#valueName >= :minValue',
  ProjectionExpression: 'hello, value',
});
const items = res.Items;
```

## `UpdateItem`

[AWS Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html)

Updating an item is fairly simple. We pass in the partition and sort key as the `Key`'s value and any updates to attributes as key-value pairs at the top level of the payload.

```javascript
const updates = {
  hello: 'moon',
  value: 300,
};

await documentClient.update({
  TableName: process.env.TABLE_NAME,
  Key: {
    id: 'myUniqueId',
    secondaryId: 'secondaryId',
  },
  ...updates,
});
```

## `DeleteItem`

[AWS Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html)

Deleting an item in DynamoDB involves either a `DeleteItem` or [`BatchWriteItem`](#batchwriteitem) API call. Deleting is as simple as retrieving, we pass in the item's partition and sort key and DynamoDB handles the rest.

```javascript
await documentClient.delete({
  TableName: process.env.TABLE_NAME,
  Key: {
    id: 'myUniqueId',
    secondaryId: 'secondaryId',
  },
});
```