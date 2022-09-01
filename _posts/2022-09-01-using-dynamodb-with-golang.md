---
layout: post
title:  "Using DynamoDB With Golang"
author: Thomas
tags: [ aws, databases, dev, go, ops, serverless ]
description: How to use the DynamoDB SDK with Golang
---

- [Basics](#basics)
- [Marshaling](#marshaling)
- [Expressions](#expressions)
- [Representing Entities](#representing-entities)
- [String Sets](#string-sets)

I spent some time over the past couple of weeks [porting an existing service over to Golang](https://github.com/thomasstep/authentication-service/pull/9). If you have read my blog before, then you know I am a big serverless fan. It could come as no surprise that I based my service on serverless technologies like Lambda and DynamoDB. Learning to write Lambda code in Go was its own challenge and so was working with DynamoDB. Luckily the AWS SDKs across languages are fairly similar but languages all function slightly differently. In this post, I wanted to go over how I set up DynamoDB and used its operations.

Of course, all the [code is open source](https://github.com/thomasstep/authentication-service/blob/6e31fa728e7f5aeeea583bfc410f950b2762cc08/src/internal/adapters/dynamodb.go), so feel free to look at that instead.

### Basics

I will start with the basic initialization. I like to use [hexagonal architecture](/blog/reinvent-evolutionary-aws-lambda-functions-with-hexagonal-architecture), and I wanted to try to use the same architecture (or at least get close enough to a clean architecture as I could) in this refactor. To accomplish my architecture hopes, I stuffed all of my outgoing adapters into my `internal` folder and shared as much underlying and abstracted DynamoDB code as I could. The initialization looks different in Go than what I would normally code, but it involved returning a singleton instance of the DynamoDB client.

```go
package adapters

import (
  "context"
  "sync"

  "github.com/aws/aws-sdk-go-v2/aws"
  awsConfigMod "github.com/aws/aws-sdk-go-v2/config"
  "github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

var awsConfig aws.Config
var onceAwsConfig sync.Once

var dynamodbClient *dynamodb.Client
var onceDdbClient sync.Once

func getAwsConfig() aws.Config {
  onceAwsConfig.Do(func() {
    var err error
    awsConfig, err = awsConfigMod.LoadDefaultConfig(context.TODO())
    if err != nil {
      panic(err)
    }
  })

  return awsConfig
}

func GetDynamodbClient() *dynamodb.Client {
  onceDdbClient.Do(func() {
    awsConfig = getAwsConfig()

    region := config.Region

    dynamodbClient = dynamodb.NewFromConfig(awsConfig, func(opt *dynamodb.Options) {
      opt.Region = region
    })
  })

  return dynamodbClient
}
```

Now, whenever my outbound adapters needed to use the DynamoDB client, they only had to call `GetDynamodbClient`.

Next, come the basic DynamoDB operations. Those include `GetItem`, `PutItem`, etc. I quickly noticed repetition while calling those operations around how I marshaled data and handled errors coming back from the SDK. For that reason, I created basic wrappers for each of the operations which were subsequently called by my outgoing adapters. I think it would be best to just include a link instead of copying each one of those functions here. [Here is the link to those wrappers](https://github.com/thomasstep/authentication-service/blob/6e31fa728e7f5aeeea583bfc410f950b2762cc08/src/internal/adapters/dynamodb.go).

The main point of those wrappers is to show how much boilerplate is involved in most of these calls, and while 20 lines might not be a big deal to start with, it adds up quickly. These will most likely be a starting point for me in any subsequent projects that involve Go and DynamoDB, so I tried to make them as reusable as I could.

That's honestly about it for the lower-level DynamoDB topics. It was easy to get up and running. There are however two more specific areas that I wanted to discuss. One involves representing entities that are also transparent to users. The other is how DynamoDB handles `Set` types.

### Marshaling

Coming from Node, I heavily relied upon the Document Client to marshal DynamoDB types for me. I have manually marshaled in the past and it is not fun. I was worried that I was going to have to manually marshal or write a package to do it in Go, but luckily, [AWS provides a package](https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue) to handle that for us. It is called `attributevalue`. I tended to use the `MarshalMap` function the most. The idea of it is that we can feed in an arbitrary struct and `attributevalue.MarshalMap` will be able to tell the types of the struct's members and create an appropriate map of `AttributeValue`s that we can directly feed into a DynamoDB operation. Here is what that might look like in action.

```go
func dynamodbPutWrapper(item interface{}) (*dynamodb.PutItemOutput, error) {
  ddbClient := GetDynamodbClient()
  av, marshalErr := attributevalue.MarshalMap(item)
  if marshalErr != nil {
    logger.Error("Failed to marshal item",
      zap.Any("item", item),
      zap.Error(marshalErr),
    )
    return &dynamodb.PutItemOutput{}, marshalErr
  }

  putItemRes, putItemErr := ddbClient.PutItem(context.TODO(), &dynamodb.PutItemInput{
    TableName: aws.String(config.PrimaryTableName),
    Item:      av,
  })
  if putItemErr != nil {
    logger.Error("Failed to put item", zap.Error(putItemErr))
    return &dynamodb.PutItemOutput{}, putItemErr
  }

  return putItemRes, nil
}
```

### Expressions

AWS also distributes a nifty package that handles putting together expressions like update expressions. This package is very simple to use and comes with good examples. As of yet, I have not used it extensively nor do I have any unique spins on how I use it. Either way, here is an example of how it can be used to update something. (This example is incomplete because there is a lot of code surrounding an `UpdateItem` operation, but the point is to focus on the `expression` usage.)

```go
update := expression.Add(
  expression.Name("userCount"),
  expression.Value(value),
)

expr, builderErr := expression.NewBuilder().WithUpdate(update).Build()
if builderErr != nil {
  logger.Error("Failed to build update expression",
    zap.Error(builderErr),
  )
  return &dynamodb.UpdateItemOutput{}, builderErr
}

updateItemRes, updateItemErr := ddbClient.UpdateItem(context.TODO(), &dynamodb.UpdateItemInput{
  TableName:                 aws.String(config.PrimaryTableName),
  Key:                       av,
  UpdateExpression:          expr.Update(),
  ExpressionAttributeNames:  expr.Names(),
  ExpressionAttributeValues: expr.Values(),
})
```

### Representing Entities

One of the patterns that I have implemented in multiple services that I have written is to expose the same object that I am writing to DynamoDB as the result of a read or that a user can update. It keeps the API and code operations simple. The way I handled that in Node was to read an item from DynamoDB, use a spread operator to remove certain fields that I did not want to expose (like the partition and sort keys), and then return the resulting object. Go does not have one-to-one support for something like that. Instead, what I did was define one struct for my externally viewable object and another struct for DynamoDB operations that used the first as an embedded struct. Here is what that looks like.

```go
type UserItem struct {
  MethodsUsed []string `json:"methodsUsed" dynamodbav:"methodsUsed,stringset,omitempty"`
  LastSignIn  string   `json:"lastSignin" dynamodbav:"lastSignIn"`
  Created     string   `json:"created" dynamodbav:"created"`
}

type DdbUserItem struct {
  Id          string `dynamodbav:"id"`
  SecondaryId string `dynamodbav:"secondaryId"`
  UserItem
}
```

This next snippet is just Go syntax for how to create and access that embedded struct that I had to learn.

```go
func createUser(userId string) UserItem {
  item := DdbUserItem{
    Id:          "partitionKey",
    SecondaryId: userId,
    UserItem: types.UserItem{
      MethodsUsed: nil,
      LastSignIn:  time.Now().Format(time.RFC3339),
      Created:     time.Now().Format(time.RFC3339),
    },
  }

  // PutItem to DDB

  return item.UserItem
}
```

The `UserItem` is what I would return to a client and the `DdbUserItem` represents that same object but for DynamoDB. This keeps any implementation-specific details away from clients.

### String Sets

One problem I had that did not seem to have great coverage online was dealing with the DynamoDB `SS` (String Set) type. Go does not have a built-in Set type. So where in Node I could simply create a `Set()` and let the Document Client handle the marshaling, I had to jump through an additional hoop with Go.

The SDK allows string sets through two different methods. One was shown earlier in the `UserItem` struct definition. It involves tagging the struct with a special `dynamodbav` tag. This tells the attribute value marshaller that a `[]string` (a built-in Go type for an array of strings) should be marshaled as a String Set. The tagging options are shown in [this link](https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue#MarshalWithOptions) (which works as of this writing). So you do not have to scroll up, the tagging method is shown below. Note the `omitempty` tag, which is important because DynamoDB will not accept an empty String Set.

```go
type UserItem struct {
  MethodsUsed []string `json:"methodsUsed" dynamodbav:"methodsUsed,stringset,omitempty"`
  LastSignIn  string   `json:"lastSignin" dynamodbav:"lastSignIn"`
  Created     string   `json:"created" dynamodbav:"created"`
}
```

The second way involves manually adding a String Set into an operation that does not use the attribute value marshaller. An example of this method is shown below.

```go
update := expression.Add(
  expression.Name("methodsUsed"),
  expression.Value(
    &ddbTypes.AttributeValueMemberSS{
      Value: []string{signInMethod},
    },
  ),
)
```
