---
layout: post
title:  "Parameter Store and CloudFormation"
author: Thomas
tags: [ ops, aws ]
description: How to use AWS Parameter Store with CloudFormation templates
---
Lately, I have been playing around with AWS SSM Parameter Store, and I have found a fun way of creating and referencing parameters through CloudFormation.
Parameters help me stay organized throughout different environments by unifying all of my CloudFormation "variables" in one place.
I populate my parameters based on the environment I am in and then use those parameters in other templates that create infrastructure.
Of course doing this means that order matters; the Parameter Store CloudFormation template needs to be run before templates that reference those parameters.
I create all my stacks through CodePipeline, so I can define the order that they are created and updated, which means I always know my parameters are present before I use them in subsequent templates.
The strategies that I use can also be applied outside of CI/CD using CodePipeline as long as you make sure that your parameters template runs before you reference them in other templates.

The first example I want to walk through is populating parameters based on environment.
The way I like to go about doing this is with CloudFormation Mappings.

```yml
AWSTemplateFormatVersion: 2010-09-09
Description: Adds parameters to systems manager
Parameters:
  AWSEnvironment:
    Type: String
    AllowedValues:
      - dev
      - preprod
      - prod

Mappings:
  Environment:
    dev:
      DBHost: "dev.db"
      .
      .
      .

    preprod:
      DBHost: "preprod.db"
      .
      .
      .

    prod:
      DBHost: "prod.db"
      .
      .
      .

Resources:
  AWSEnvironmentParameter:
    Type: AWS::SSM::Parameter
    Properties:
      Name: /awsEnvironment
      Description: Current AWS environment
      Tier: Standard
      Type: String
      Value: AWSEnvironment

  LogFirehoseParameter:
    Type: AWS::SSM::Parameter
    Properties:
      Name: /dbHost
      Description: Database Host
      Tier: Standard
      Type: String
      Value: !FindInMap [ Environment, !Ref AWSEnvironment, DBHost ]
```

Hopefully it is easy enough to see what is happening here.
Under `Mappings` I am predefining the values for my parameters.
You can add as many mappings as you would like, which is what I was attempting to show with the extra `.`s.

Next up is showing how to use the parameters we just created in other CloudFormation templates.

```yml
AWSTemplateFormatVersion: 2010-09-09
Parameters:
  Env:
    Type: AWS::SSM::Parameter::Value<String>
    Default: /awsEnvironment
  DBHost:
    Type: AWS::SSM::Parameter::Value<String>
    Default: /dbHost

Resources:
  MyLambdaFunction:
    Type: 'AWS::Lambda::Function'
    Properties:
      .
      .
      .
      Environment:
        Variables:
          NODE_ENV: !Ref Env
          DB_HOST: !Ref DBHost
```

The parameters from Parameter Store are passed into the Lambda CloudFormation template like any other parameters; however, the `Type` and `Default` properties of the CloudFormation parameters matter here.
The `Type` is telling CloudFormation that the parameter input will be a value from SSM Parameter Store instead of a value that the user gives.
The `Default` property is giving CloudFormation the name of the parameter from which we want to pull a value.
The name here needs to coorespond to the `Name` property of the parameter in the Parameter Store template.
I prefer to use a `Default` property here instead of passing (manually or otherwise) the Parameter Store name, so I never have to worry about what parameter the value actually came from since it is defined in my template.
After you define the CloudFormation parameter, you can use the value like normal.
In this example, I am passing the DB Host I set in Parameter Store to my Lambda as an environment variable.
Now, if you ever need traceability into where a certain environment variable value came from, you can reference back to your templates, which can be version controlled.

Like I said before I use this in conjunction with CodePipeline, which I think is a match made in heaven.
My CodePipeline instance picks up my templates from a GitHub webhook that fires off at a push, builds the parameters stack, and updates the lambda stack.
I can add parameters and then reference them in a template, and after a simple push, they show up in AWS.
