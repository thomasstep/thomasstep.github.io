---
layout: post
title:  "CloudFormation Example for Kinesis Data Firehose and Lambda"
author: Thomas
tags: [ aws, javascript, ops, serverless ]
description: Building a serverless data pipeline on AWS
---

Using Kinesis Data Firehose (which I will also refer to as a delivery stream) and Lambda is a great way to process streamed data, and since both services are serverless, there are no servers to manage or pay for while they are not being used. I have used this combination a few times to mask or scrub logs as they are being streamed from multiple services. One of the great parts of Kinesis is that other AWS services directly integrate with it like CloudWatch. If there is no direct integration, then data can be directly pushed in using a PUT request.

Kinesis makes it easy to transform data once it has entered a delivery stream through integration with Lambda. The records come in, Lambda can transform them, then the records reach their final destination. That final destination could be something like S3, Elastisearch, or Splunk. There are other built-in integrations as well. While I was building my CloudFormation template for this, I decided on S3 since it is easy to create a bucket and there are tons of other great things to do with data sitting in an S3 bucket.

My base level template is available on GitHub in the [AWS CloudFormation Reference repository](https://github.com/thomasstep/aws-cloudformation-reference/blob/03191a5fb35154e64b4187f15577a29a0ad4e6ca/lambda/kinesis/data-transformation.yml) along with quite a few other templates that I have created as quick reference points and building blocks.

Starting with the Lambda function, there were not any tricky parts about building this out from the infrastructure side. For the IAM Role, I simply used a managed policy with the ARN `arn:aws:iam::aws:policy/service-role/AWSLambdaKinesisExecutionRole`. This had everything I needed to get up and running within a few minutes. The Lambda permission is still a tad bit confusing to me. The principal `events.amazonaws.com` needs permission to perform the `lambda:InvokeFunction` action, which did not make sense to me at first since Kinesis is what triggers the Lambda. At least, that's what I thought happened behind the scenes.

Next came the Firehose itself and its IAM Role. [Kinesis has multiple destination configuration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html) properties to choose from and each delivery stream only gets one. The options are Elasticsearch, S3, Redshift, Splunk, Kinesis Stream (which is different from Kinesis Data Firehose), or a generic HTTP endpoint. It is also worth noting that S3 has two destination configuration properties available: `S3DestinationConfiguration` and `ExtendedS3DestinationConfiguration`. From what I can tell, the extended destination allows for additional configuration like Lambda processing whereas the normal destination configuration is for simple forwarding to keep it easy. I decided to use `ExtendedS3DestinationConfiguration` because I wanted to use the Lambda integration. Integrating the Lambda is done under the `ProcessingConfiguration` property of `ExtendedS3DestinationConfiguration`, which ends up looking something like the following snippet.

```yaml
...
ExtendedS3DestinationConfiguration:
  ...
  ProcessingConfiguration:
    Enabled: 'true'
    Processors:
      - Parameters:
          - ParameterName: LambdaArn
            ParameterValue: !GetAtt LambdaFunction.Arn
        Type: Lambda
```

The trickiest part that got me stuck working on this template the longest was the IAM Role for the Data Firehose. After I figured out my problem, I found a page in AWS's documentation about the [different permissions required for various integrations](https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html), which would have helped out had I known about it beforehand. What I was stuck on were the Lambda permissions for Firehose. I initially only had something that looked like the following.

```yaml
- Effect: Allow
  Action:
    - 'lambda:InvokeFunction'
    - 'lambda:GetFunctionConfiguration'
  Resource:
    - !Sub "${LambdaFunction.Arn}"
```

This resulting in Firehose writing to my S3 bucket under the failed-to-send path. What I got back instead of clean records was something along the lines of the following message.

```json
{
  "attemptsMade": 4,
  "arrivalTimestamp": 1622242573374,
  "errorCode": "Lambda.InvokeAccessDenied",
  "errorMessage": "Access was denied. Ensure that the access policy allows access to the Lambda function.",
  "attemptEndingTimestamp": 1622242649990,
  "rawData": "eyJ0aWNrZXJfc3ltYm9sIjoiQU1aTiIsInNlY3RvciI6IlRFQ0hOT0xPR1kiLCJjaGFuZ2UiOi02LjU1LCJwcmljZSI6NzMzLjQxfQ==",
  "lambdaArn": "REDACTED"
}
```

After staring at this for too long and wondering what I had done wrong, I finally stumbled across something mentioning needing a wildcard on the `Resource` for the IAM Role's policy document. What finally did the trick for me was the following adjustment on that previous statement.

```yaml
- Effect: Allow
  Action:
    - 'lambda:InvokeFunction'
    - 'lambda:GetFunctionConfiguration'
  Resource:
    - !Sub "${LambdaFunction.Arn}*" # NOTE: there is an * after the Lambda's ARN
```

Make sure that there is a `*` after the Lambda's ARN. After that, all of my records started flowing through the data pipeline!

Now comes the open-ended portion of this integration, the code that the Lambda function runs. I have written about a previous experience I have had [writing code to process logs originating from CloudWatch and with a destination in Elasticsearch](/blog/cloudwatch-logs-to-elasticsearch-through-firehose). That code was definitely a more complicated version of what I wrote this time around. For this template, I wanted to keep the code simple. I wanted to decode the Base64 records from Firehose, print the contents, and return the records back to Firehose untouched. The goal was to simply make sure that everything was working as intended. Here is the code that I wrote in Node/Javascript:

```javascript
exports.handler = (event, context, callback) => {
  /* Process the list of records and transform them */
  const output = event.records.map((record) => {
    const plaintextData = Buffer.from(record.data, 'base64').toString('ascii');
    console.log(plaintextData);
    return {
      recordId: record.recordId,
      result: 'Ok',
      data: record.data,
    };
  });
  console.log(`Processing completed.  Successful records ${output.length}.`);
  callback(null, { records: output });
};
```

That code does not do much, but it is a good starting point. From here data can be transformed however it needs to be. Values can be added, values can be redacted, alarms can be triggered based on content. Once we involve Lambda, we're in the wild west where anything goes, so have fun with it!
