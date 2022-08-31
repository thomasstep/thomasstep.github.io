---
layout: post
title:  "Writing Go code for Lambdas"
author: Thomas
tags: [ aws, dev, go, serverless ]
description: TBD
---

I recently refactored a service originally written in Node over [to Go](https://github.com/thomasstep/authentication-service/pull/9). That service is run on AWS Lambda and there were a few differences that I noticed while writing the service in Go that I wanted to jot down and highlight.

Starting with the AWS-specific difference, I used to lean on Lambda layers for sharing code across Lambdas in Node, but I quickly learned that layers are not necessary for use with Go. Not using Layers was actually a result of sheer differences in the languages themselves since Go is compiled and that binary is shipped off for the Lambda to run. That means that the shared code is bundled at compile time and does not need to make its way into the file system of the Lambda.

As a result of wanting to write up the differences in using Go over other common languages for Lambda, I created some CDK boilerplate to get started. It is a part of my [CDK reference repo](https://github.com/thomasstep/aws-cdk-reference/blob/main/lib/golang-lambda.ts) if anyone would like to use it.

After going through this process, I must say that I enjoy the typing system much more than I originally would have thought. My first programming language was C++. After C++, the next language I learned was Javascript, and after I learned Javascript I felt fast and free without a typing system. The same goes for Python. I had not looked back on strict typing until now. Between the typing system and needing to compile code before deploying to a Lambda, I feel like I saved a vast amount of time debugging code because so much was done ahead of deployment. While it is annoying to get compiling errors due to type mismatch, the overall benefit outweighed any negatives.

One slightly random bit that stuck out to me was singletons. Node exports values from a module as singletons, so I never had to worry about creating too many DynamoDB sessions on imports or making a new logger instance every time I imported my logging module. Go does not do that. To avoid those types of situations, I learned how to use a neat feature of the standard library called `Once`. Initializing a value inside of `Once` means that the value is only ever created, you guessed it, once. Go does a great job handling concurrency and this is just one example of that. Here is a snippet that shows what I am talking about.

```go
package clients

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

One last thing. I just mentioned that Go does a great job at handling concurrency. Running Go in a Lambda might not fully utilize the array of benefits that Go boasts. Since the code is running in a short-lived environment implementing things like worker pools and long-running goroutines might not be the right choice. However, writing Go for Lambda functions is still worthwhile and I am slightly upset with myself for not doing it sooner. Lambdas run faster with Go compared to other common languages like Node or Python. When I refactored my service from Node to Go, I saw cold starts decrease by over 1 second and warm requests took sometimes less than half the time of their Node counterparts. These are some of the benefits of using a compiled language over an interpreted one. And I am starting to enjoy strict typing. Thanks, Go.
