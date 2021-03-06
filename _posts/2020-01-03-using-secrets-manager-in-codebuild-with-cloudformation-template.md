---
layout: post
title:  "Using Secrets Manager in CodeBuild with a CloudFormation Template"
author: Thomas
tags: [ ops, aws ]
redirect_from:
  - /cloud/aws/infrastructure/2020/01/03/using-secrets-manager-in-codebuild-with-cloudformation-template.html
---
While I was trying to figure out how to add secrets from AWS Secrets Manager to CodeBuild, I could not seem to find a concrete example of a CloudFormation template that implemented this.
While it is not too complicated, I wanted to throw some actual `yaml` up on the internet in case anyone else was looking for the same thing.

```
Parameters:
  MySecretAsParameter:
    Type: String
    Description: My secret used in CodeBuild

Resources:
  MySecretResource:
    Type: 'AWS::SecretsManager::Secret'
    Properties:
      Name: MySecret
      Description: My secret used in CodeBuild
      SecretString: !Sub '${MySecretAsParameter}’
  CodeBuildProject:
    .
    .
    .
    Environment:
      EnvironmentVariables:
        - Name: “MY_SECRET”
          Type: "SECRETS_MANAGER"
          Value: "MySecret"
```

In your buildspec file you can use this as you would normally use an environment variable in a bash command: `curl -H “Authorization: $MY_SECRET” …`.
This will keep your secrets in a secure place but still enable you to use them in your pipeline all natively in AWS.

