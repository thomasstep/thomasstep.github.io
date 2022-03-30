
---
layout: post
title:  "Title"
author: Thomas
tags: [ aws, dev, meta, ops, serverless ]
description: TBD
---

*This post is meant to be an openly published question to AWS.*

Why do Synthetics Canaries cost so much? As of this writing, the free tier includes 100 canary runs per month, but after that, I would have to pay $0.0012 per canary run.

Let's say I want to monitor an API. Nothing crazy. Just a little request and response to make sure everything is going fine. And I want to send that request every 5 minutes (or 12 times per hour). At the current prices (excluding the ever-so-generous free tier allotment) I would be paying `(24 hours/day * 12 runs/hour * $0.0012/run) = $0.3456 per day`. Added up over four weeks (about one month) that means I would be paying $9.6768. For what? A Lambda running as a cron? What else are you guys doing behind the scenes that justifies such a high cost?

Now look, I am a capitalist too. I understand Papa Bezos needs a yacht, but at these prices, he can buy the shipyard if AWS gets every user to start monitoring their APIs with this service. Maybe my use case is not exactly what you are attempting to solve. If a more complex scenario is being solved, then why is there a starting template for simply monitoring an API? The only reason I question the problem you are trying to solve is because that is the only way to justify the cost. A product or service must cost equal to or less than the value of the problem it solves and any other competition to be successful. To me, a Canary seems like a Lambda on a cron which costs significantly less than this service. Even with the frontend testing capabilities of baked-in Puppeteer or Selenium which are offered through Canaries, I still do not understand the price. Especially since there is a [blog post on your website](https://aws.amazon.com/blogs/devops/serverless-ui-testing-using-selenium-aws-lambda-aws-fargate-and-aws-developer-tools/) about running a Lambda with a headless browser. So what gives? Are you also spinning up a bitcoin mining rig in the background and charging the user for that resource?

My intent is not to be inflammatory. I simply do not understand how and why this service is priced the way it is. Please reach out to me if someone sees this and knows the answer. I am a huge fan of AWS and the pricing models, especially for serverless services, but this one threw me for a loop.

In the meantime, I like to compete as any capitalist should. I also have a slight chip on my shoulder about this, so I created an open-source CDK construct as an alternative to Synthetics Canaries. It creates a Lambda function (which can be set up to have [Puppeteer or Selenium](https://aws.amazon.com/blogs/devops/serverless-ui-testing-using-selenium-aws-lambda-aws-fargate-and-aws-developer-tools/) installed), triggers that Lambda on a schedule, and then sends optional alerts on Lambda failure. Pretty simple. And it captures what I believe to be the main use case for anyone in a similar position to myself. You can start using [Pidgeon](https://www.npmjs.com/package/cdk-pigeon) today. It even qualifies for the [Construct Hub](https://constructs.dev/packages/cdk-pigeon/v/0.1.0?lang=typescript).

And for anyone wanting this functionality without wanting to set up the infrastructure, contact me and I will personally set it up for you with white-glove service. At least until I get an answer from AWS.

```typescript
new Pigeon(this, 'pigeon-monitor', {
  schedule: events.Schedule.rate(Duration.minutes(5)),
  lambdaFunctionProps: {
    code: lambda.Code.fromAsset(path.join(__dirname, '/monitoring')),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
    environment: {
      'URL': url,
    },
  },
});
```