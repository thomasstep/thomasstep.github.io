---
layout: post
title:  "CloudFormation Example for DynamoDB"
author: Thomas
tags: [ aws, databases, ops, serverless ]
description: Introduction to DynamoDB and its powerful configuration
---

A while back I wanted to create a CloudFormation template for a DynamoDB table because that seemed like a missing piece in my serverless stack. It seems like everywhere I turn someone new is extolling the beauty and efficiency that is DynamoDB. I'll add some more commentary below, but without further ado, here is a quick and easy example for a DynamoDB table.

```yml
AWSTemplateFormatVersion: 2010-09-09
Description: Basic template for DDB Table

Resources:
  Table:
    Type: AWS::DynamoDB::Table
    Properties:
      AttributeDefinitions:
        -
          AttributeName: id
          AttributeType: S
      BillingMode: PAY_PER_REQUEST
      KeySchema:
        -
          AttributeName: id
          KeyType: HASH

Outputs:
  TableName:
    Description: The created DDB table name
    Value: !Ref Table
    Export:
      Name: !Sub ${AWS::StackName}-ddb-table-name
```

Like I said, quick and easy. This template was an addition to my [CloudFormation reference GitHub repository](https://github.com/thomasstep/aws-cloudformation-reference/blob/1a50e0530093920bc3068486028df1b7e97dec0c/ddb/basic/ddb.yml) which lives alongside other templates to give people a starting point into AWS. When I started diving into AWS, I found templates and snippets scattered around and had a somewhat difficult time cobbling together a starting point for myself. For someone starting down the serverless path, I hope this template and repo can help you get something up and running that can then be altered to suit your needs.

Now for my commentary. There is a ton of configuration that I left out of this template. It is designed to be wildly simple and just get something up and running that can be added onto. When I started creating this template and looking into the different configurations that could be added to a template I was surprised how much can go into a table. I was also surprised to see the outcome looking so simple with only 3 properties. I also took a video of myself creating this template and it is [available on YouTube](https://www.youtube.com/watch?v=uYFy2GotL0U).

DynamoDB tables can be drop-dead simple or they can be complex beyond my current understanding. Anyone learning about Dynamo will most likely run into the name Rick Houlihan. His talks during re:Invent are informative and fast-paced. I have watched his talks from [2017](https://www.youtube.com/watch?v=jzeKPKpucS0), [2018](https://www.youtube.com/watch?v=HaEPXoXVf2k), and [2019](https://www.youtube.com/watch?v=6yqfmXiZTlM), and I recommend them all. He makes his passion for his work obvious and they are overall fun to watch. The reason I brought up Rick and his talks is that he dives into depths that a CloudFormation template can not. While designing a DynamoDB table there are more considerations than just what data you want to store in it. To unlock all the performance that a table has to offer, higher-level design choices need to be made. Access patterns and the primary and secondary indices that enable those access patterns should be thought about beforehand. Different event-driven streams can flow off of the table to enable background processing (think stored procedures in a cloud native flavor). Tables can also enable time to live on their data and auto-scale read and write capacities. There is a ton to learn about DynamoDB despite the template that I shared looking so simple.

I wanted to offer up a simple template for those looking to start down a path of learning DynamoDB, but my intention was not to stop at just this template. I brought up the other configuration to act as a catalyst for learning more about the power behind this technology. There is no one-size-fits-all database and there is no one-size-fits-all DynamoDB table. To gain the benefits of using Dynamo, we need to further inspect its capabilities.