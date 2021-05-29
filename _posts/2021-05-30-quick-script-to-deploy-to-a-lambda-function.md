---
layout: post
title:  "Quick Script to Deploy to a Lambda Function"
author: Thomas
tags: [ aws, ops, databases ]
description: "Deploy new code to a Lambda function"
---

I have written a version of this script multiple times over, so I finally made a generic enough version to hopefully fulfill my needs now into the future. There are some prerequisites/assumptions that I make. First is that there is an existing CloudFormation stack with a Lambda function that uses a versioned S3 bucket to grab its source. The template would look something like this

```yaml
Parameters:
  SourceBucket:
    Type: String
    Description: S3 bucket with source
  SourceKey:
    Type: String
    Description: S3 key with Lambda source code
  SourceVersion:
    Type: String
    Description: S3 version for source code

Resources:
  LambdaFunction:
    Type: AWS::Lambda::Function
    Properties:
      Code:
        S3Bucket: !Ref SourceBucket
        S3Key: !Ref SourceKey
        S3ObjectVersion: !Ref SourceVersion
...
```

The second is that the code has all dependencies installed and it is all contained in the same directory. (Something similar can be done with more complex projects/codebases and this would be a good starting point for building a script for something like that). The third is that `jq` is installed and the AWS CLI is installed and ready to be used.

```bash
#!/bin/sh
# NOTE: Requires jq and correctly configured aws cli

# Change these to the correct values
SOURCE_PATH= # i.e. ./src
SOURCE_BUCKET_NAME= # i.e. source-bucket
SOURCE_KEY= # i.e. my-application/service-name
TEMPLATE_PATH= # i.e. ./template.yml
STACK_NAME= # i.e. my-stack
STACK_SOURCE_VERSION_PARAMETER_NAME= # i.e. SourceVersion

zip -r9 deployment-package $SOURCE_PATH
aws s3 cp deployment-package.zip s3://$SOURCE_BUCKET_NAME/$SOURCE_KEY
S3_VERSION=$(aws s3api get-object --bucket $SOURCE_BUCKET_NAME --key $SOURCE_KEY getobjectoutfile | jq -r '.VersionId')
aws cloudformation deploy --template-file $TEMPLATE_PATH --stack-name $STACK_NAME --parameter-overrides $STACK_SOURCE_VERSION_PARAMETER_NAME=$S3_VERSION
```

After the six variables are properly filled in, the script should properly zip everything up, upload the deployment package to S3, grab the new version ID, and deploy the changes to the CloudFormation template. Voila!

For anyone reading this and wondering how to build all of this infrastructure, I do have some templates that would be a good starting point. For the versioned S3 bucket to hold deployment packages, I suggest using [this template](https://github.com/thomasstep/aws-cloudformation-reference/blob/03191a5fb35154e64b4187f15577a29a0ad4e6ca/s3/versioned-bucket.yml). For an API that uses a Lambda function for computing, I suggest using [this template](https://github.com/thomasstep/aws-cloudformation-reference/blob/03191a5fb35154e64b4187f15577a29a0ad4e6ca/lambda/basic/serverless-function-api.yml). It also contains the correct parameters to use a deployment package from a versioned S3 bucket. For anyone trying to learn AWS and wanting some additional help figuring things out, please don't hesitate to get in contact with me. I would be more than happy to help out where I can!
