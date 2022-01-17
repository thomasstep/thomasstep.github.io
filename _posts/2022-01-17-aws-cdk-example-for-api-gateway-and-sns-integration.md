---
layout: post
title:  "AWS CDK Example For API Gateway And SNS Integration"
author: Thomas
tags: [ aws, ops, serverless ]
description: Explaining how to integration API Gateway with SNS using a service proxy
---

TL;DR: The CDK code I used to [directly integrate API Gateway and SNS is here](https://github.com/thomasstep/aws-cdk-reference/blob/b1ba815bbbe262530673a01c01e9bb5873223461/lib/api-gateway-sns-integration.ts).

While working on one of my more recent projects, I came across the need to create a completely asynchronous API path in API Gateway. I have [used SNS](/blog/writing-asynchronous-lambda-functions-with-node) in the past for asynchronous communication but in prior scenarios, I published messages to SNS using the SDK in a Lambda function. This time around there was no execution needed before calling SNS which made a good use case for an API Gateway integration directly with SNS.

Integrating API Gateway with other AWS services is possible, but I have read articles online claiming that the integration is not as easy as it could or should be. It seemed as if there were difficulties because the API Gateway integration more or less needs to be hardcoded with the proper API calls to the AWS service it is being integrated with. As someone who has configured this type of integration, I can confidently say that those articles were correct. I repeatedly needed to reference AWS documentation. The trickiest parts were needing a separate IAM Role (something I have not had to worry about since moving to the AWS CDK), the `path` and `action` properties, getting the `requestParameters` and `requestTemplates` to match up and work, and making the `requestTemplates` with [Velocity](https://velocity.apache.org/) work correctly because I wanted to pass in JSON.

The AWS CDK takes care of most IAM provisioning needed for resources to correctly operate. If actions are not configured out of the box, there are normally easy calls to make to get resources set up to complete their tasks. For some reason, API Gateway integrations do not come with that support out of the box. This problem was trivial to fix though since it only involved creating a Role resource and granting it the correct permissions. Either way, I think that this could be one area that the CDK could improve upon in the future.

```typescript
const apiGatewayRole = new iam.Role(this, 'integration-role', {
  assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com')
});
topic.grantPublish(apiGatewayRole);
```

Configuring the correct `path` and `action` prop was the next big hurdle that I had to cross. According to the [CDK docs for AwsIntegrationProps](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.AwsIntegrationProps.html), the `action` is "the AWS action to perform in the integration" and the `path` is "the path to use for path-base APIs." None of that information helped me out nor did it tell me that one of the two props is necessary for correct integration. I started with `action: 'Publish`. Nothing. So I started looking around the internet for answers. If it had not been for Alex DeBrie and his post about [API Gateway service proxies](https://www.alexdebrie.com/posts/aws-api-gateway-service-proxy/) I probably would have taken a week to figure this out through trial and error. If you read through that post, you will notice that there is no mention of `path` or `action` used as a configuration item, but he does include `Action=Publish` in the request template and the integration's URI includes `sns:path//`. From those two bits, I pieced together [something that works](https://github.com/thomasstep/aws-cdk-reference/blob/b1ba815bbbe262530673a01c01e9bb5873223461/lib/api-gateway-sns-integration.ts#L45-L56). Keep in mind that I am not sure what I did is correct, all I know is that it works. When API Gateway constructs the URL for SNS the double slash (`//`) is in the path, which looks ugly and is probably an indication that something is not optimally configured. For now, this will work, but I plan on revisiting it in the future.

Next on the list of hurdles was correctly configuring the `requestParameters` and `requestTemplates`. However, this was less a lack of documentation and more so a lack of me reading said documentation. The `requestParameters` are input to the integration, and in my case, I needed to set the `Content-Type` header to `application/x-www-form-urlencoded`. For some reason, it did not click with me until too late what `requestParameters` were for and that they should not be the same as the `application/json` that I used as the key in `requestTemplates`. Figuring out `requestTemplates` was easier for me. It is a mapping between a `Content-Type` header and a template used to transform the request into a payload for the backend. I think what tripped me up is that I thought the value used in `requestParameters` needed to be the same as the key used in `requestTemplates`, which is not the case.

Even though I said that figuring out the `requestTemplates` was slightly easier for me, figuring out the Velocity template syntax was difficult. I knew that I should be able to pass in JSON to SNS's Publish action, but since I had previously only used SNS from the SDK, I did not know how to translate what the SDK did into Velocity. My API had IDs in its path that I wanted to include in the payload to SNS. The biggest realization for myself was that I needed to manually write out and escape the JSON where I had previously thought that Velocity would do that for me. After I figured out that I needed to hardcode the JSON and inject the parameters where they were the values, I was off to the races.

```
Message=$util.urlEncode('{"someParam":"')$input.params('paramName')$util.urlEncode('"}')
```

Despite all the trouble that integrating API Gateway directly with SNS gave me, I am glad I went through it. This is a valuable integration and configuration to have set up. I have already implemented it more than once. I am sure that I will use it more in the future and iterate on top of what I already know to make the configuration run even smoother.
