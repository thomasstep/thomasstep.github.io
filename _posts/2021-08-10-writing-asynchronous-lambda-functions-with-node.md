---
layout: post
title:  "Writing Asynchronous Lambda Function with Node"
author: Thomas
tags: [ aws, dev, javascript, ops, serverless ]
description: Using SNS and Lambda to create an event-driven architecture
---

When I first started diving into cloud engineering and learning about microservices, I kept hearing about "event-driven architecture". I understood how to write asynchronous code in Node.js, and I understood how to write code for Lambda functions. But I caught myself awaiting async code before I returned from a Lambda handler without using the result of that awaited function. Something felt off, but I did not know what else to do.

The way that async Lambda handlers work (at least with Node.js) is by running code and then "finishing execution" whenever the handler returns. The Lambda might finish execution, but if an async function was still running in the background (waiting on an API call for example) then that asynchronous execution may or may not finish before the Lambda itself shuts down. There are loads of explanations and documentation out there about the Node.js event loop and how it works with AWS Lambda. That documentation has better explanations of what is happening than I am prepared to offer at this time. The quick and dirty solution that most people use (myself included for a long time) is to simply await all async functions before returning from the Lambda handler. However, there is a better way to handle asynchronous execution. After all, we are talking about the cloud and Amazon, and surely they have run into this problem before.

My experience with async Node.js code and Lambda was limited to the above solution until I started working on a side project. I wanted to focus on speed and lower latency, so I naturally needed to learn more about writing asynchronous systems and code. After reading and experimenting I found a solution that was staring me right in the face this entire time: AWS SNS. For some reason, I had never completely connected the dots before, but SNS allowed me to call an async function without awaiting the result to make sure that execution finished. I had interacted with SNS before, but I failed to think of it as a convenient way to run code in the background without slowing down a Lambda function.

One thing that I knew but never completely put into practice was the fact that I was writing Lambda *functions*. Instead of writing an async function and running it in my critical path's Lambda, I could take that same async function, deploy it as its own Lambda *function*, create an SNS topic, make that Lambda a consumer of the SNS topic, and call my function asynchronously by publishing to SNS from my critical path.

Calling the SNS API in my main Lambda is faster than calling the async function and awaiting it, so my main Lambda is allowed to return to the user with minimum latency. My async function is then triggered by SNS to run without needing to worry about how long it takes. It's a win-win.

Lambda is great. SNS is great. For whatever reason, it took me a while to realize the power that combining Lambda and SNS provides. Learn from my mistake and enjoy this combination made in heaven. Use it. Love it. Create asynchronous, event-driven systems.