---
layout: post
title:  "CloudFormation for Serverless API Development"
author: Thomas
tags: [ ops, aws ]
description: Example of a CloudFormation template that can be used to start developing a serverless API in AWS
redirect_from:
  - /aws/2020/03/31/cloudformation-for-serverless-api-development.html
---
When I was first learning about AWS lambda and API Gateway (serverless), I spent quite a bit of time searching around for help and template snippets to help me build a CloudFormation template.
I have seen a lot about the [`serverless`](https://serverless.com/) framework and I know that there are easier ways to get into building serverless infrastructure on AWS, but sometimes learning what is happening behind the scenes helps me learn and understand the concepts better.
In order to create the documentation that I wish I had while learning this stuff, I decided to create a basic [CloudFormation template to spin up a serverless API on AWS.](https://github.com/thomasstep/aws-cloudformation-reference/blob/633abc282194c14faa0646e3c792d46a71e0de24/lambda/api-gateway-and-lambda.yml)
The idea behind this is that you can upload this template to AWS, tell CloudFormation to create a stack with it, and be ready to start developing your API without having to worry about creating basic infrastructure.
Of course there is additional knowledge that you would need to gather like how to upload code to your lambda function, create new methods and resources on your API Gateway, etc.
It's quite likely that I will post more in the future about how to do those things, but for now, I hope that this can be a good foundation for others to build off of while starting their serverless and AWS journey.

Again, here is the link to the starter template [api-gateway-and-lambda.yml](https://github.com/thomasstep/aws-cloudformation-reference/blob/633abc282194c14faa0646e3c792d46a71e0de24/lambda/api-gateway-and-lambda.yml).
