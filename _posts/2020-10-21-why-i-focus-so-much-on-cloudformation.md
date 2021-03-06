---
layout: post
title:  "Why I Focus So Much On CloudFormation"
author: Thomas
tags: [ ops, aws ]
description: The benefits of putting AWS infrastructure into CloudFormation templates
---

I wanted to quickly go over the reason I focus on describing AWS infrastructure and topics through CloudFormation templates, both here and in day-to-day discussions.
The hugest benefit that CloudFormation offers is that no matter what, your infrastructure can be replicated.
When I was first learning about AWS, someone told me to treat infrastructure like a cow, not like a dog.
Cows live in feedlots and aren't given a name, they are given an ear tag with an ID number.
Dogs live inside, are given a name, and taken special care of.
If someone's pet passes, then they would probably be sadder than if a cow in a feedlot somewhere passes.
Infrastructure will come and go and when it goes it should not cause the maintainer to grieve.
If an EC2 instance dies (it's hardware, it can legitimately die), then it needs to be replaced.
Having a piece of infrastructure that is carefully looked after, named, and manually groomed can lead to tons of problems whenever it needs to be replaced.
This is one of the huge benefits of building in the cloud, we can create things on demand.
If an application relies on a single instance of hardware, then it might as well just be hosted out of a locally run server with manual changes applied willy-nilly instead of built with a cloud provider.
I would argue that any extra cost that is incurred from running something in the cloud compared to something that is maintained on a company's premise is from this exact benefit.
No longer does anyone have to worry about hardware failing, AWS worries about it.
No longer does anyone have to worry about a snowflake server, AWS offers services to keep track of configuration.
Infrastructure definition should be kept in CloudFormation templates in source control.
When infrastructure can be deleted and recreated on demand, there is one less thing to worry about in the development cycle.
Tearing down and rebuilding infrastructure is also an insanely fun thing to do and watch.
Instead of maintaining a data center, focus on defining a data center in CloudFormation templates and letting AWS provision it on demand.

Another huge reason I focus on CloudFormation templates is that they enable me to take on a DevOps process.
I am a developer, not an infrastructure guy (not throwing shade).
My current team does not have any "infrastructure guys".
I assumed that role quickly and semi-easily with the help of CloudFormation.
I try to treat templates like a function with the input being parameters and the output being infrastructure.
In my opinion, DevOps with AWS is not possible without CloudFormation no matter what application is being developed.
As a bonus, I can take the same template, DRY it out, and reuse it for another similar piece of infrastructure.
Whatever is defined in those templates more or less acts as a consumer of the AWS API and makes calls on the user's behalf.
Another area that I am getting into is using the AWS CDK, which is a library that outputs CloudFormation templates and it is IaC, but that's another discussion entirely.

About the first two weeks I was messing with AWS, everything I did was through the console.
All I did was create a Lambda function and API Gateway integration.
It was not the easiest experience for me to move that infrastructure to templates.
There are little details that just magically happen in the console.
If I was going to start all over again, I would focus on writing templates from day one.
There are small nuances that can't be controlled if the infrastructure is created through the AWS console.
If you are on the fence over whether or not to start using this service, please heavily consider it.
The documentation on AWS's website is pretty good and there are tons of example templates out there.
Just about any basic AWS combination of services will have an example template.
In short, CloudFormation is the way to go, and anyone who wants to call themselves a DevOps engineer needs to learn it.
