---
layout: post
title:  "CloudFormation Example for Serverless RDS"
author: Thomas
tags: [ ops, aws, serverless ]
description: Example of a CloudFormation template that can be used to create a serverless RDS cluster
---

I have been updating my [CloudFormation reference repo on GitHub](https://github.com/thomasstep/aws-cloudformation-reference) lately, and I wanted to bring up one of the newly added templates. [This template](https://github.com/thomasstep/aws-cloudformation-reference/blob/1a50e0530093920bc3068486028df1b7e97dec0c/rds/basic/rds.yml) builds a serverless RDS instance, generates a password for that instance, adds a secret to Secrets Manager, and allows for an instance to be built off of an existing snapshot. I also took a screen capture of me building and debugging that template that is [available on YouTube](https://www.youtube.com/watch?v=-h6rKAWK6gA) if you care to watch how I built it.

I'll start by mentioning that there are conditions in this template that determine whether brand new database instances will be launched or if those instances will be based on a snapshot ([I recommend looking at the template if this is confusing](https://github.com/thomasstep/aws-cloudformation-reference/blob/1a50e0530093920bc3068486028df1b7e97dec0c/rds/basic/rds.yml)), but I will also include the snippet that sets those conditions up.
```yaml
Parameters:
  SnapshotArn:
    Type: String
    Description: Snapshot to build DB off of; leave as 'none' if new DB
    Default: none

Conditions:
  isNewDb: !Equals [!Ref SnapshotArn, none]

  isSnapshotDb:
    !Not [!Equals [!Ref SnapshotArn, none]]
```

Generating a password for the instance and adding a secret to Secrets Manager is done by the following portion of the template.
```yaml
Credentials:
  Condition: isNewDb
  DeletionPolicy: Retain
  Type: AWS::SecretsManager::Secret
  Properties:
    GenerateSecretString:
      SecretStringTemplate: '{"username": "admin"}'
      GenerateStringKey: "password"
      PasswordLength: 16
      ExcludeCharacters: '"@/\'
```

This is a similar snippet to what can be found in AWS references. First, I will remind you that there are conditions in this template that determine whether brand new database instances will be launched or if those instances will be based on a snapshot. If the instances are based on a snapshot, they will use the master username and password that was specified at the time of the RDS cluster's creation. For that reason, I am retaining the secrets created with new clusters with `Condition: isNewDb` and `DeletionPolicy: Retain` in case their stacks are deleted. If the stacks are deleted, this allows a new stack to be created that will launch instances using the old database's snapshot and credentials.

In actuality, the password generation is simply a randomly generated string that is later referenced by RDS to use as the password. The `SecretStringTemplate` portion is the baseline value for the secret, and the generated string is given as the value for the key with the name `password` as denoted by `GenerateStringKey`. However, this alone does not make that generated string a password. What does make it a password, is the following snippet from a property of the `AWS::RDS::DBCluster` resource definition.
```yaml
MasterUserPassword:
  !If
    - isNewDb
    - !Join
      - ''
      -
        - '{{resolve:secretsmanager:'
        - !Ref Credentials
        - ':SecretString:password}}'
    - !Ref AWS::NoValue
```

Now we are referencing the generated string to be used as the password. The condition for `isNewDb` exists because creating an `AWS::RDS::DBCluster` resource with a snapshot requires that the master credentials properties are not present. The snapshot property in my template looks like the following snippet.
```yaml
SnapshotIdentifier:
  !If
    - isSnapshotDb
    - !Ref SnapshotArn
    - !Ref AWS::NoValue
```

This references the snapshot's ARN if it was provided by the user. Lastly, there is an `AWS::SecretsManager::SecretTargetAttachment` resource which does some cool magic. This resource takes in the `AWS::RDS::DBCluster` and `AWS::SecretsManager::Secret` and adds the relevant database information to the secret like host, port, and engine.

While this template is not a full data recovery plan, it can help in a pinch by at least having everything set up to accept a snapshot and rebuild a database cluster if a stack is somehow deleted or a copy needs to be built.
