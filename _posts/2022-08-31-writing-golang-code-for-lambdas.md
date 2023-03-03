---
layout: post
title:  "Writing Go code for Lambdas"
author: Thomas
tags: [ aws, dev, go, serverless ]
description: Organizing and writing code for AWS Lambda
---

I recently refactored a service originally written in Node over [to Go](https://github.com/thomasstep/authentication-service/pull/9). That service is run on AWS Lambda and there were a few differences that I noticed while writing the service in Go that I wanted to jot down and highlight.

Starting with the AWS-specific difference, I used to lean on Lambda layers for sharing code across Lambdas in Node, but I quickly learned that layers are not necessary for use with Go. Not using Layers was actually a result of sheer differences in the languages themselves since Go is compiled and that binary is shipped off for the Lambda to run. That means that the shared code is bundled at compile time and does not need to make its way into the file system of the Lambda.

As a result of wanting to write up the differences in using Go over other common languages for Lambda, I created some CDK boilerplate to get started. It is a part of my [CDK reference repo](https://github.com/thomasstep/aws-cdk-reference/blob/main/lib/golang-lambda.ts) if anyone would like to use it.

After going through this process, I must say that I enjoy the typing system much more than I originally would have thought. My first programming language was C++. After C++, the next language I learned was Javascript, and after I learned Javascript I felt fast and free without a typing system. The same goes for Python. I had not looked back on strict typing until now. Between the typing system and needing to compile code before deploying to a Lambda, I feel like I saved a vast amount of time debugging code because so much was done ahead of deployment. While it is annoying to get compiling errors due to type mismatch, the overall benefit outweighs any negatives.

I would like to go over how I organize the code for my Lambdas and then I will discuss a few more technical details that I needed to watch out for while writing the code itself. From an organizational standpoint, I have all of my Lambda handlers in a `cmd/` folder. (Well actually at the root level of the repo I have two folders. The `infra/` folder is where all of my CDK app code lives, and the `src/` folder is where all my source code lives. Within the `src/` folder is the `cmd/` folder.) Each Lambda gets its own folder in the `cmd/` folder corresponding to the Lambda's name and purpose. For example, I have `cmd/createApplication/` and `cmd/createUser/` folders. Within each folder lives three files: `init.go` with all of my pre-execution code in the `init` func (this is a Go-language-wide construct, not something I implemented), `lambdaHandler.go` with all of my Lambda-specific incoming adapter code, and `logic.go` with all of my business logic.

The `init.go` file handles mainly two things. Initializing the logger for my package and retrieving config. [I use Uber Zap in my projects](/blog/initializing-uber-zap) because I like structured logging. I also have an internal config package (more on that later) that reads environment variables, sets constants, and organizes them into a struct to make life easier.

The `lambdaHandler.go` file starts to get a little more complicated. My `main` func lives in this file, so the mandatory `lambda.Start()` function is called in `main`. The argument I give `lambda.Start()` is part boilerplate, part code per endpoint. The boilerplate is coming from a wrapper function that follows the decorator pattern. That wrapper function takes in the endpoint-specific code as a function, runs that function, then handles the response if an error occurred, and adds mandatory headers to each response. The endpoint-specific function lives in the `lambdaHandler.go` function and is also decorated there before being given to `lambda.Start()`. (If this seems confusing, I suggest taking a peek at the [authentication service repo](https://github.com/thomasstep/authentication-service) where this is implemented.)

Finally, the `logic.go` file contains whatever business logic that Lambda needs to run including reaching out to outgoing adapters. Since I like to [write my projects](/blog/how-i-implement-hexagonal-architecture-in-aws-lambda) following [hexagonal architecture](blog/reinvent-evolutionary-aws-lambda-functions-with-hexagonal-architecture), this is essentially where the `domain` is implemented. The outgoing adapters which I mentioned are located in the `internal/` folder.

My internal folders (`src/internal/`) also show a few similarities across projects, and I have already mentioned quite a bit of the functionality that lives here. I have `internal/common/`, `internal/adapters/`, and `internal/types/` folders, which are all their own Go packages.

My `internal/common/` folder contains the config that I have already mentioned, the Lambda handler decorator that I have also mentioned, and a few other utility functions that are used throughout the project.

My `internal/adapters/` folder contains all outgoing adapters code. Whenever I need to call an outgoing adapter in my business logic, storing them all in this package makes the code intuitive, `adapters.CreateSomeRecord()`. Outgoing adapters include database operations, sending emails, emitting events, and the like. My connections and clients are [initialized](/blog/using-dynamodb-with-golang) in this package as well.

My `internal/types/` folder contains struct definitions for things like API payloads and database models. I have found it particularly easy to store these all in a central location. I also store things like custom errors here, which are used in the Lambda decorator to determine what status code should be returned to a user.

Here is a visual representation of what a project's folder structure might look like before I start filling in the business logic.

```
<repo>
  |_ src/
    |_ cmd/
      |_ <lambda operation folders>
    |_ internal/
      |_ adapters/
      |_ common/
      |_ types/
  |_ infra/
    |_ <all CDK code>
```

Now on to the more technical discussion.

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
