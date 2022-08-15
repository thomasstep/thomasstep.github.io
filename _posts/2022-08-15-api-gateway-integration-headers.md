---
layout: post
title:  "API Gateway Integration Headers"
author: Thomas
tags: [ aws, ops, serverless ]
description: How to map integration response headers using AWS API Gateway
---

A recent AWS API Gateway integration forced me to learn something new about service proxy integrations. The situation was an integration between S3 and API Gateway where the `Content-Type` header of the S3 response was not properly sent through the API Gateway. In short, I needed to create a mapping in the Method Response and then fill in the value in the Integration Response. Here is a CDK example with some of the extra Integration and Method Responses taken out but I am sure the configuration is similar in CloudFormation.

```typescript
resource.addMethod(
      'GET',
      new apigateway.AwsIntegration({
        service: 's3',
        path: '{bucket}/script.js',
        integrationHttpMethod: 'GET',
        options: {
          passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
          requestParameters: {
            'integration.request.header.Content-Type': "'application/x-www-form-urlencoded'",
            'integration.request.path.bucket': `'${primaryBucket.bucketName}'`
          },
          integrationResponses: [
            {
              statusCode: "200",
              responseParameters: {
                'method.response.header.Content-Type': 'integration.response.header.Content-Type',
              },
            },
            ...
          ],
        },
      }),
      {
        methodResponses: [
          {
            statusCode: "200",
            responseModels: {
              'application/json': apigateway.Model.EMPTY_MODEL,
            },
            responseParameters: {
              'method.response.header.Content-Type': true,
            },
          },
          ...
        ],
      },
    );
```

The parts to look out for are the `integrationResponses.responseParameters` and `methodResponses.responseParameters`.

Simply adding `'method.response.header.Content-Type'` to the `responseParameters` is enough to create the mapping in the Method Response. The value indicates whether or not that header is required, so setting the value to `true` as I have means that S3 needs to return that header or the response will return an error.

Now that we have a mapping in place in the Method Response, we need to properly create the header in the Integration Response. For this example `'method.response.header.Content-Type': 'integration.response.header.Content-Type'` is saying that the Method Response should get it's `Content-Type` header from the Integration Responses `Content-Type` header. What is worth noting is that the key for both the Integration and Method Responses is the same (`method.response.header.Content-Type`) and that the value in the Integration Response does not necessarily have to come from the integration's response itself. The Integration Response mapping value can come from a stage variable, static value, or a few other places as can be [seen here](https://docs.aws.amazon.com/apigateway/latest/developerguide/request-response-data-mappings.html#mapping-response-parameters).
