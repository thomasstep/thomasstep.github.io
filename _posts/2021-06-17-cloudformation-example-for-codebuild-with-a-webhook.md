---
layout: post
title:  "CloudFormation Example For CodeBuild With A Webhook"
author: Thomas
tags: [ aws, dev, ops, serverless ]
description: TBD
---

While building out a small project not too long ago, I ended up wanting to implement my CI/CD using only CodeBuild. I have created pipelines using CodePipeline before that automatically pull the latest changes from a given GitHub repository and act on them. I knew that CodeBuild could be configured to do something similar based on webhooks, but I had never implemented it. The setup is not too difficult, but I did run into one minor problem that I wanted to highlight and explain in this post.

The following paragraphs have some important information about AWS account setup, so please don't skip to the bottom for the templates.

The CodeBuild instance and template are nothing out of the ordinary. An IAM Role tells CodeBuild what I can do and then the CodeBuild project itself is defined. The one thing that caught me was configuring the [source credentials](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codebuild-sourcecredential.html).

When I originally implemented this, I had the source credentials defined in the same template as my CodeBuild project. Whenever I wanted to spin up another instance (say, for a new environment), I encountered errors on a template that I knew worked. It turns out source credentials need to be unique per provider per AWS account. That means that the `AWS::CodeBuild::SourceCredential` resource type should only be used once per `ServerType`. Unfortunately, I spent close to an hour searching around and trying to figure this out. The error that held me up looked something like this

```
Failed to call ImportSourceCredentials, reason: Access token with server type GITHUB already exists. Delete its source credential and try again.
```

If someone stumbles across this problem in the future, just know, it's not your fault that AWS has bad error messages.

To wrap this all up, I wanted to first give a template of how to create a source credential, and then I will give the template for the CodeBuild project itself. The templates are also available at my [AWS CloudFormation Reference GitHub repository](https://github.com/thomasstep/aws-cloudformation-reference/tree/0d6d79f9db33e8ff3f07c9588a822ddff5ad5109/cicd/codebuild) along with some other helpful templates.

First up is the source credential creation. Remember this only once per account. I currently have the `Parameters` set to assume an SSM parameter exists called `codebuild-github-token`. This can be changed to whatever name you would like, but I do not recommend copy and pasting a personal access token directly into the CloudFormation parameters.

```yaml
Parameters:
  GitHubAccessToken:
    Type: AWS::SSM::Parameter::Value<String>
    Description: Name of parameter with GitHub access token
    Default: codebuild-github-token
    NoEcho: True

Resources:
  CodeBuildCredentials:
    Type: AWS::CodeBuild::SourceCredential
    Properties:
      ServerType: GITHUB
      AuthType: PERSONAL_ACCESS_TOKEN
      Token: !Ref GitHubAccessToken
```

After the source credential has been created, we can create our CodeBuild project.

```yaml
Parameters:
  GitHubUrl:
    Type: String
    Description: URL for GitHub repo i.e. https://github.com/username/repository

Resources:
  CodeBuildRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: 2012-10-17
        Statement:
            - Effect: Allow
              Principal:
                  Service:
                    - codebuild.amazonaws.com
              Action:
                - sts:AssumeRole
      Description: !Sub "IAM Role for ${AWS::StackName}"
      Path: '/'
      Policies:
        - PolicyName: root
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - cloudformation:*
                  - codebuild:*
                  - logs:*
                Resource: '*'
  CodeBuild:
    Type: AWS::CodeBuild::Project
    Properties:
      Description: CodeBuild with GitHub webhook
      Triggers:
        BuildType: BUILD
        Webhook: True
        FilterGroups:
        - - Type: EVENT
            Pattern: PUSH,PULL_REQUEST_MERGED
          - Type: HEAD_REF
            Pattern: ^refs/heads/main$
            ExcludeMatchedPattern: false
      ServiceRole: !GetAtt CodeBuildRole.Arn
      Artifacts:
        Type: NO_ARTIFACTS
      Environment:
        Type: LINUX_CONTAINER
        ComputeType: BUILD_GENERAL1_SMALL
        Image: aws/codebuild/standard:4.0
        EnvironmentVariables:
          - Name: MY_ENV_VAR
            Value: something
            Type: PLAINTEXT
      Source:
        Type: GITHUB
        Location: !Ref GitHubUrl
      TimeoutInMinutes: 10
  CodeBuildLogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub "/aws/codebuild/${CodeBuild}"
      RetentionInDays: 7

Outputs:
  ProjectName:
    Value: !Ref CodeBuild
    Description: CodeBuild project name
```

There are few important things to note about this template. First, the IAM Role will need to be tweaked to allow CodeBuild to perform actions specific to your project. Second, the `FilterGroups` are currently set up to only trigger on merges and direct pushes to a branch called `main`, which might need to change based on your requirements. Lastly, the CodeBuild instance is expected a file called `buildspec.yml` to be present in the repo's root directory. If you do not know what a `buildspec` is, please read [this documentation](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html) (it is pretty much just a bash script to run when CodeBuild is triggered).