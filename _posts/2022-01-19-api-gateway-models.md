---
layout: post
title:  "API Gateway Models"
author: Thomas
tags: [ aws, ops, serverless ]
description: Description of API Gateway Models, JSON Schema, and how to use them
---

As almost anyone in software knows, iteration is key. Kaizen has proved itself over and over again, and I like to apply the same concept to my projects. My earlier projects started fairly rudimentary and simple but have grown more complex with larger scopes over time. One of the areas in particular that I have set out to consciously improve is my infrastructure. For some reason, AWS and infrastructure have continued to be fun and of interest to me over the years.

I have written many APIs and configured many API Gateways to go with them. What once started as CloudFormation templates evolved into CDK code and my [CDK Construct](https://www.npmjs.com/package/crow-api) which makes iteration even easier. The latest improvement that I have taken to is using API Gateway models to define my endpoints' schemas. Using models is something that I have wanted to work on for a while now, but I had not taken the time to properly learn what they are or how they can be configured up until now.

Models are a way to define the accepted body using JSON and a syntax called [JSON schema](https://json-schema.org/). That is about as complicated as they are. Once you have a schema in mind, the syntax is also fairly straightforward. I will show an example of a JSON schema that I wrote for a CDK application and then explain the different pieces.

```typescript
{
  schema: apigateway.JsonSchemaVersion.DRAFT4,
  title: 'mySchema',
  type: apigateway.JsonSchemaType.OBJECT,
  required: ['startTime', 'endTime'],
  properties: {
    startTime: {
      type: apigateway.JsonSchemaType.STRING,
      format: 'date-time',
    },
    endTime: {
      type: apigateway.JsonSchemaType.STRING,
      format: 'date-time',
    },
    title: { type: apigateway.JsonSchemaType.STRING },
  },
  additionalProperties: false,
}
```

To start, we need to define the JSON Schema version we are using. At the time of my writing this, draft 4 is the current most up-to-date version. Then comes the title. The other keys are starting to define the schema. Since my endpoint was a POST that accepted a JSON object, I needed to define my root property type as `apigateway.JsonSchemaType.OBJECT`. Since my root type is an object, I can then use the `properties` key to define what the object's body looks like. The "type" for each property in my parent object is also a JSON Schema, so this is a sort of recursive syntax.

My schema accepts three and only three potential properties: `startTime`, `endTime`, and `title`. The `additionalProperties: false` piece tells API Gateway to return a 400 error if the caller supplies keys outside of what I have defined. The `required: ['startTime', 'endTime']` piece also tells API Gateway to return a 400 error if the caller does not supply either of those required properties. For the time being, the `additionalProperities` and `required` properties are the only behavioral properties I needed.

Once the root object's properties are configured, we can move on to each of the children. The type and format for `startTime` and `endTime` are defined so that a small amount of pre-validation can occur. This eases the burden on my code for light validation so I can focus solely on deeper validation. This brings me to the main reason I wanted to start using models: API Gateway validates payloads for me and rejects those that do not conform without me spending a cent. In a similar fashion to authorizers, AWS will front the bill of validating that a call is "up to snuff" before spinning up a Lambda and charging me for it.

Once we have a JSON Schema written up, configuring it becomes a matter of applying the JSON to the correct property on the API Gateway Method and configuring a Request Validator to validate the body. I wish I would have started using models earlier because they save my time writing code to validate payloads before executing business logic on them. I plan on going back to some of my older projects and APIs to refactor in using models. I hope this convinced you to start using models, and if you have any further questions, including implementation-specific questions, feel free to reach out to me.