---
layout: post
title:  "Crow API Updates"
author: Thomas
tags: [ aws, dev, javascript, meta, ops, serverless ]
description: Discussing updates and enhancements to my AWS CDK Construct
---

The past few weeks I have been busy working on a personal project and I have been using `crow-api`, [my CDK Construct](/blog/i-made-an-aws-cdk-construct), alongside it. For this go-around with a new project, I wanted to use more of the API Gateway and Lambda features that I had not up until now. Since I started out using `crow-api` for my project from the start, I also ended up adding some functionality to the Construct as well as polishing the code.

One of my more recent posts talked about [refactoring my Construct](/blog/refactoring-my-cdk-construct-for-the-construct-hub) and I mentioned wanting to clean up the code and write tests for the existing functionality. My first exposure to Typescript was during that refactor, so I knew that some cleanup was on the menu. I also wanted to write tests to give myself and other users more peace of mind that the Construct works as intended and any future changes would preserve backward compatibility. Both of those items on my to-do list are now crossed off.

After going through multiple iterations and releases I have much more confidence in `crow-api` and feel as if it is turning into a fully-fledged package and Construct now. I have worked through quite a few problems and written tests along the way. The new additions include Lambda layers instead of copied files, less responsibility and complication instead of creating and managing unnecessary DynamoDB Tables and Lambdas, much more accepted configuration, and of course, tests.

For some reason, I had never used Lambda layers before I added them into `crow-api`. There was a decent amount of discussion around them at re:Invent, and after looking into what they are, I knew that I had a great use case for them. Before Lambda layers, `crow-api` would copy shared code from a specific folder into each Lambda's folder to share code. This is effectively what a Lambda layer does but in a much more elegant fashion. Code is packaged and can be associated with Lambdas without actually needing the shared code to be present in each Lambda's deployment package. The layer's code is accessible at the `/opt/` path (`const myModule = require('/opt/myFile');`).

At one point, I thought that `crow-api` would be more fun and powerful if it owned the creation of more resources, but now, the intent is to only have `crow-api` create an API Gateway, Lambdas, and associate the two together. Any other resources that are created are a result of those resources needing to be present during the creation and configuration of the API Gateway and Lambdas. For example, where `crow-api` used to configure permissions and environment variables for a Lambda accessing a specific DynamoDB Table, it now does not manage those resources to decrease complexity that did not need to be present. More complexity was not and is not the answer.

With the increased intricacy of my latest application using `crow-api`, I inherently exposed problems with how `crow-api` handled certain bits of configuration. The biggest missing pieces of configuration had to do with API Gateway methods. Before these changes, method configuration was completely missing and there was no way to configure the API Gateway integration with Lambda. This work was prompted by my wanting to start using schemas/models for certain endpoints in this new project. Using [models](/blog/api-gateway-models) was previously impossible with the way that `crow-api` handled certain configuration items.

The last large change that I wanted to bring up in this post was the addition of tests. I knew I should have written tests from the start especially since I published this code with the intent of others using it. I had not taken the time to look into how testing with the CDK even worked. While testing was not too complicated once I had a few working examples, it was slightly more difficult to start than I would have liked, and I plan on writing a post in the future about testing with the CDK.

That is all for now. Overall, I am much happier with the state of `crow-api` now compared to the state it was in when I wrote my last post about it. I plan on writing separate posts about certain topics that I have discussed in this one, and whenever I write those posts I will do my best to come back through and add some links in where they need to exist. Please check out [`crow-api`](https://github.com/thomasstep/crow-api) to see if it fits your needs, and if you have any questions or comments please send them my way through GitHub or even email.

EDIT: I backfilled a link for [models](/blog/api-gateway-models)