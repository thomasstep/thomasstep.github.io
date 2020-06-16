---
layout: post
title:  "Graphene and Lambda Functions"
author: thomas
tags: [ dev, python, cloud ]
image: https://thomasstep.s3.amazonaws.com/seal1.jpg
featured: false
hidden: false
comments: true
---
I am about to start using GraphQL and Lambda functions for a project. I could not find any blog post or documentation that was easily readable about setting this up end-to-end. Overall, it was not difficult at all considering that I have practically zero AWS experience and have never used GraphQL or Graphene before. Graphene is a GraphQL library for Python that I am using.

Setting up Hello World for Graphene is pretty easy. I mostly just followed [Graphene's documentation for getting started](https://docs.graphene-python.org/en/latest/quickstart/). Combining this with AWS Lambda's Hello World code was pretty easy. To set up the Lambda function, you first need an AWS account. There is a ton of documentation out there about setting all this up so I won't talk about it. Once you are in the AWS Management Console, create a Lambda function for Python 3. You'll be greeted with some basic Hello World code for your new Lambda. I basically just took the code from Graphene and copy pasted it on top of what AWS gives you to come up with something that looks like this. You now have a Lambda function.

```
import json
from graphene import ObjectType, String, Schema

class Query(ObjectType):
    # this defines a Field `hello` in our Schema with a single Argument `name`
    hello = String(name=String(default_value="stranger"))
    goodbye = String()

    # our Resolver method takes the GraphQL context (root, info) as well as
    # Argument (name) for the Field and returns data for the query Response
    def resolve_hello(root, info, name):
        return f'Hello {name}!'

    def resolve_goodbye(root, info):
        return 'See ya!'

schema = Schema(query=Query)

def lambda_handler(event, context):
    result = schema.execute(event['query'])

    return {
        'statusCode': 200,
        'body': json.dumps(result.data['hello'])
    }
```

The next problem I ran into was the `import`. You can't just import something that doesn't exist. [AWS has documentation about creating Lambdas with dependencies](https://docs.aws.amazon.com/lambda/latest/dg/lambda-python-how-to-create-deployment-package.html#python-package-dependencies). The gist of that document is you pip install your packages while targeting something closer to your project and code so you can keep the packages' code easily available (i.e. in a packages folder). You can also use Python's `virtualenv` but I have never used that before. Whenever you want to deploy your code, you zip everything up (packages and your code) and upload it to AWS. I will personally probably just write my function in the same directory that I target with pip so I can zip up that entire directory and upload it. Make sure that your function's file is called `lambda_function.py` and the entrypoint function is called `lambda_handler`. AWS uses those names to know what files to look for and what function to run whenever the Lambda is triggered.

After you have zipped and uploaded your project, you can create a test event on the same page in the AWS Management Console. My test event looks like the following:

```
{
  "query": "{ hello(name: \"World\") }"
}
```

Once you test it, you will receive confirmation that it worked. Now you can setup an API Gateway to trigger the Lambda whenever someone hits a specific URL.

This was the least involved portion in my opinion. I pretty much just clicked through steps. I setup an API Gateway that triggers my Lambda whenever someone sends a POST to /graphql. None of what I did is new and there is (again) tons of documentation out there to help through this stuff. The only thing that got me a little stuck was that I originally configured my API Gateway as a "Lambda Proxy". For some reason, the `event` passed to the Lambda changed and I couldn't just use `event['query']`. I never figured out what the structure of the event was; I just unchecked the Lambda Proxy box and went on my way.
