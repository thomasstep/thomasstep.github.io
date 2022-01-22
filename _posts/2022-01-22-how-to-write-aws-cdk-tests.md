---
layout: post
title:  "How To Write AWS CDK Tests"
author: Thomas
tags: [ aws, dev, javascript, ops ]
description: Examples of AWS CDK tests
---

Writing tests is a necessary nuisance. I would much rather spend my time writing functionality than writing code to verify what I wrote but mistakes happen and backward compatibility needs to be preserved. After I have finished writing tests I always feel much better about a codebase. For some reason, writing that code is simply not as enjoyable. That is one of the reasons why I dragged my feet for so long on writing tests for `crow-api`.

Another big reason I took so long to write tests is that testing infrastructure is a fairly new thing. How can we test a VM's configuration that was spun up by a different team in a data center that is homebrewed? Those scripts would also need to be tailored and probably not worth the effort. It would most likely be easier to write E2E or integration tests after code has been deployed onto the servers. I did not expect to find many resources online about testing CDK Constructs and Stacks simply because I figured it was new enough.

My assumption of a lack of documentation and examples was not too far off, but like the inspiration for many of my posts, I would like to contribute something back that I found missing.

Whenever we start a new CDK app, the tool automatically creates a `test/` folder, installs `jest`, and gives us a little bit of boilerplate code. AWS obviously wants us to write tests. I did find a serious lack of official documentation around the tools the CDK has to write tests. The [`aws-cdk-lib.assertions` module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions-readme.html) is about all I could find (someone please point me in the correct direction if I overlooked something). Even though that documentation ended up being about all I needed, it was still discouraging to not find much else.

The boilerplate code given to us with a fresh CDK app looks like the following.

```typescript
const app = new cdk.App();
  // WHEN
const stack = new ScheduleApi.ScheduleApiStack(app, 'MyTestStack');
  // THEN
const template = Template.fromStack(stack);

template.hasResourceProperties('AWS::SQS::Queue', {
  VisibilityTimeout: 300
});
```

The first line should look familiar (`const app = new cdk.App();`) because it is the same as initializing an app whenever we want to deploy something. The stack creation is the same as well, `const stack = new ScheduleApi.ScheduleApiStack(app, 'MyTestStack');`. Once we get to `const template = Template.fromStack(stack);` things start diverging. What I say from here on out is based on my best knowledge at the time of writing. It is possible that I am not following best practices, but I can not find anything about best practices.

It seems to me like the best way to test CDK code is to synthesize the code into CloudFormation stacks then run assertions against the huge string that is the template. This is what the boilerplate code that the CDK generates shows and the `aws-cdk-lib.assertions` module shows no other way of testing anything. This means that the `props` given to the stacks used in tests should be identical to the `props` given to the stacks being deployed to correctly test configuration.

The `Template` created from running `Template.fromStack()` can then be queried for resources, mappings, and outputs using the [`Template` class's methods](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html#methods). The methods starting with `has` will throw errors if the corresponding resource in the template is not found, and the methods starting with `find` will return the resources themselves as well as their logical IDs.

I am going to show some examples from the tests that I wrote for `crow-api`. (These tests might change but the exact [commit's file I am referencing is here](https://github.com/thomasstep/crow-api/blob/27b8cbebfafc0c98f78541ee747babaef63dc5b4/test/crow-api.test.ts).)

One of the [first and most straightforward tests](https://github.com/thomasstep/crow-api/blob/27b8cbebfafc0c98f78541ee747babaef63dc5b4/test/crow-api.test.ts#L132-L134) I wrote looks like the following.

```typescript
template.hasResourceProperties('AWS::ApiGateway::RestApi', {
  Name: 'testing-crow-api',
});
```

This call is simply asserting that the template contains a `RestApi` resource with the `Name` property set to `testing-crow-api`. Notice that the `Name` property is referencing the naming from the [CloudFormation template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html#cfn-apigateway-restapi-name) not the prop from the CDK code (`restApiName`).

The next tests that I wrote started getting more complicated. I wanted to start testing that the API Gateway `Resource`s were pointing towards the correct parents. With CDK this is simple, but there is more going on under the covers to make the CloudFormation work. A resource's logical ID is referenced in the CloudFormation template, but with CDK code, we do not interface with logical IDs. The question then turns into a matter of teasing the logical ID out of the CDK stack or the `Template`. For this [first example](https://github.com/thomasstep/crow-api/blob/main/test/crow-api.test.ts#L138-L149), I was able to grab the ID from the CDK stack.

```typescript
function getLogicalId(stack: cdk.Stack, resource: cdk.IResource) {
  return stack.getLogicalId(resource.node.findChild('Resource') as cdk.CfnElement);
}

const restApiLogicalId = getLogicalId(stack, stack.api.gateway);

template.hasResourceProperties('AWS::ApiGateway::Resource', {
  ParentId: {
    'Fn::GetAtt': [
      restApiLogicalId,
      'RootResourceId',
    ],
  },
  PathPart: 'v1',
  RestApiId: {
    Ref: restApiLogicalId,
  },
});
```

The [next example](https://github.com/thomasstep/crow-api/blob/27b8cbebfafc0c98f78541ee747babaef63dc5b4/test/crow-api.test.ts#L301-L330) become slightly more complicated. I first needed to use `Template`'s `findResources` using properties unique to a specific resource, then grab the logical ID from the result of the `findResources` call, and finally use the logical ID in a `hasResourceProperties` call.

```typescript
function logicalIdFromResource(resource: any) {
  try {
    const resKeys = Object.keys(resource);
    if (resKeys.length !== 1) {
      throw new Error('Resource is not unique.');
    }
    const [logicalId] = resKeys;
    return logicalId;
  } catch (err) {
    console.log(resource);
    throw err;
  }
}

const authorsPath = template.findResources('AWS::ApiGateway::Resource', {
  Properties: {
    PathPart: path,
  },
});
const v1AuthorsGetLambda = template.findResources('AWS::Lambda::Function', {
  Properties: {
    TracingConfig: {
      Mode: 'Active',
    },
  },
});

const authorsLogicalId = logicalIdFromResource(authorsPath);
const v1AuthorsGetLambdaLogicalId = logicalIdFromResource(v1AuthorsGetLambda);

template.hasResourceProperties('AWS::ApiGateway::Method', {
  HttpMethod: 'GET',
  ResourceId: {
    Ref: authorsLogicalId,
  },
  RestApiId: {
    Ref: restApiLogicalId,
  },
  Integration: {
    Uri: {
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':apigateway:',
          { Ref: 'AWS::Region' },
          ':lambda:path/2015-03-31/functions/',
          {
            'Fn::GetAtt': [
              v1AuthorsGetLambdaLogicalId,
              'Arn',
            ],
          },
          '/invocations',
        ],
      ],
    },
  },
});
```

There are some changes in the example code compared to the permalink but the idea is the same.

While the functions expose to use might not be the most comprehensive compared to what we might want to do, I was at least able to figure out some way of testing what I wanted to. I hope that my thoughts and examples have helped someone along their way. These examples are what the CDK authors intended to the best of my knowledge, but if I learn something different later, I will either update this post or make a follow-up post. For now, happy coding!