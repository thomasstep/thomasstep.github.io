---
layout: post
title:  "CloudFormation Mappings and Conditions"
author: thomas
tags: [ aws ]
image: https://thomasstep.s3.amazonaws.com/penguin4.jpg
featured: false
hidden: false
comments: true
---
I have been trying to learn more about CloudFormation to make it easier to set up the infrastructure I manage.
Two fun pieces of functionality that I have been using more and more are mappings and conditions.
Both of these are more helpful when you put them in conjunction with the parameters that you give the template at creation.
Mostly, I have been trying to cut down on the amount of parameters the template requires and instead use more mappings.
Conditions help when you are trying to decide if you need to deploy something different depending a parameter that is passed in like environment.
I have gotten almost all of the templates that I use a lot down to using only one parameter, environment.
Learning about `Outputs` and `Fn::ImportValue` helped me out a lot while I was trying to simplify templates as well (I will write a specific post about this later).
For now I will focus on mappings and conditions, and here is an example of how I would set up a template for using those.
```yml
AWSTemplateFormatVersion: 2010-09-09
Parameters:
  Environment:
    Type: String
    AllowedValues:
      - dev
      - preprod
      - prod

Mappings:
  Domain:
    dev:
      ec2Name: 'unicorn'
      allocatedMemory: 1024
    preprod:
      ec2Name: 'nessie'
      allocatedMemory: 1024
    prod:
      ec2Name: 'yeti'
      allocatedMemory: 8192

Conditions:
  isProduction: !Equals [!Ref Environment, prod]
```

In this example, the mappings are worth more than the conditions in my opinion.
You can have all sorts of different "variables" defined based on the environment that you are in.
If you are noticing yourself enter the same parameter in for multiple different stacks, mappings may be able to help you trim that parameter out.
The way you would call a mapping is through the `FindInMap` intrinsic function.
`!FindInMap [Domain, !Ref Environment, ec2Name]` (I use `yaml`)
The first element in that array is referencing the map that you are looking in, the second element is first level object you are looking in, and the third element is the key corresponding to the value you are looking for.
By referencing the environment parameter that was given, we are able to conditionally set and use different "variables".

Conditions are helpful when trying to decide what resources you want to deploy.
For example, if you wanted to deploy an ELB in production but not in your preprod or dev environments, you could simply add a condition to your ELB resource to only build in production.
```yml
Resources:
  Type: AWS::ElasticLoadBalancing::LoadBalancer
  Condition: isProduction
  Properties:
    .
    .
    .
```

This means that the resource would only ever build if `Environment` is given as `prod`.
Diving in to these two simple areas of CloudFormation can open up a ton of cool possibilities to simplify your templates.
There is, of course, also good AWS documentation about both [mappings](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html) and [conditions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html).
