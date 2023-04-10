---
layout: post
title:  "API Pagination with DynamoDB"
author: Thomas
tags: [ aws, databases, dev, go, serverless ]
description: How to implement pagination in an API using DynamoDB
---

I recently posted about [reading from a paginated API in React](/blog/api-calls-with-pagination-in-react), and in this post, I wanted to write about the flip side of that: implementing pagination in an API with DynamoDB as the database. For these code snippets, I will be using Go but the same strategy and similar API calls will apply to any language dealing with DynamoDB. First I will discuss what my end goal was before I started implementing this, then I will break down the steps, and finally, I will add some code snippets to accompany the steps.

I wanted to implement pagination for my API because it was very easy to see how quickly a set of entities was going to grow and I wanted to add some sort of limit to my payloads. After reading about several strategies for implementing API pagination, I settled on using a token-based strategy. The idea around this is to return an opaque token to the user and when that same token is given back to the API, the result will continue based on where it left it as signified by the token. For my purposes, I wanted to add a `pagination` object to my payload with a `nextToken` field.

```json
{
  "other": "property",
  "pagination": {
    "nextToken": "thisisthenexttoken"
  }
}
```

Here are the steps that I broke this down into.

1. Update API to accept `limit` and `nextToken` query parameters where pagination is desired.
2. Have reasonable defaults for those parameters. For example, `limit = 20` and `nextToken = null`.
3. Decode the `nextToken` from base64 and unmarshal the JSON string into an object/struct. (This will make more sense by the end of the steps.)
4. Pass the values to the DynamoDB Query or Scan call (those are the only two that are paginated) using the `Limit` and `ExclusiveStartKey` values.
5. Read the resulting value in `LastEvaluatedKey` from the DynamoDB call. If it is empty, return the `nextToken` as `null`. Otherwise, marshal the `LastEvaluatedKey` to a JSON string then encode to base64.
8. Return the encoded string as the `nextToken`.

Hopefully that all makes sense. If not, I would suggest going back over it and making sure you understand the idea behind the code snippets. Also, these snippets assume that you are already familiar with the AWS SDK for Go. There is information that you will need to understand and be able to replace such as the table name. All that to say that these are not copy-and-paste ready.

### 1. Update API to accept `limit` and `nextToken` query parameters where pagination is desired.

This step is very API-specific, and not something that is probably out of scope for this post.

### 2. Have reasonable defaults for those parameters. For example, `limit = 20` and `nextToken = null`.

This step is very API-specific, and not something that is probably out of scope for this post.

### 3. Decode the `nextToken` from base64 and unmarshal the JSON string into an object/struct. (This will make more sense by the end of the steps.)

For some extra context, I am using the `"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"` package to help marshal and unmarshal generic maps.

```go
if nextToken != "" {
  exclStartString, decErr := base64.StdEncoding.DecodeString(nextToken)
  if decErr != nil {
    logger.Error("Failed to decode nextToken from base64",
      zap.Error(decErr),
    )
    return entries, "", decErr
  }

  logger.Debug("Base64 decode complete", zap.Any("exclStartString", exclStartString))

  /*
    type DdbPrimaryKey struct {
      Id          string `dynamodbav:"id"`
      SecondaryId string `dynamodbav:"secondaryId"`
    }
  */
  entry := &types.DdbPrimaryKey{}
  jsonErr := json.Unmarshal(exclStartString, entry)
  if jsonErr != nil {
    logger.Error("Failed to unmarshal nextToken",
      zap.Error(jsonErr),
    )
    return entries, "", jsonErr
  }

  logger.Debug("JSON unmarshal complete", zap.Any("entry", entry))

  marshalledStartKey, marshalErr := attributevalue.MarshalMap(entry)
  if marshalErr != nil {
    logger.Error("Failed to marshal entry to map[string]AttributeValue",
      zap.Error(marshalErr),
    )
    return entries, "", marshalErr
  }

  logger.Debug("AV marshal complete", zap.Any("marshalledStartKey", marshalledStartKey))

  startKey = marshalledStartKey
}
```

### 4. Pass the values to the DynamoDB Query or Scan call (those are the only two that are paginated) using the `Limit` and `ExclusiveStartKey` values.

```go
queryInput := &dynamodb.QueryInput{
  TableName:                 aws.String(config.PrimaryTableName),
  KeyConditionExpression:    expr.KeyCondition(),
  ExpressionAttributeNames:  expr.Names(),
  ExpressionAttributeValues: expr.Values(),
  Limit:                     aws.Int32(limit),
}

if len(startKey) != 0 {
  queryInput.ExclusiveStartKey = startKey
}

queryRes, queryErr := ddbClient.Query(context.TODO(), queryInput)
```

### 5. Read the resulting value in `LastEvaluatedKey` from the DynamoDB call. If it is empty, return the `nextToken` as `null`. Otherwise, marshal the `LastEvaluatedKey` to a JSON string then encode to base64.

```go
if len(queryRes.LastEvaluatedKey) != 0 {
  logger.Debug("Last evalualted key", zap.Any("queryRes.LastEvaluatedKey", queryRes.LastEvaluatedKey))
  lastEvalKey := &types.DdbPrimaryKey{}
  marshalErr := attributevalue.UnmarshalMap(queryRes.LastEvaluatedKey, lastEvalKey)
  if marshalErr != nil {
    logger.Error("Failed to unmarshal map[string]AttributeValue to entry",
      zap.Error(marshalErr),
    )
    return entries, "", marshalErr
  }

  logger.Debug("AV unmarshal complete", zap.Any("lastEvalKey", lastEvalKey))

  lastEvalString, jsonErr := json.Marshal(lastEvalKey)
  if jsonErr != nil {
    logger.Error("Failed to marshal last evaluated key json",
      zap.Error(jsonErr),
    )
    return entries, "", jsonErr
  }

  logger.Debug("JSON marshal complete", zap.Any("lastEvalString", lastEvalString))

  // lastEvalB64 will be returned as nextToken in the resulting payload
  lastEvalB64 := base64.StdEncoding.EncodeToString([]byte(lastEvalString))
}
```

### 6. Return the encoded string as the `nextToken`.

How you do this is up to you and your API framework.
