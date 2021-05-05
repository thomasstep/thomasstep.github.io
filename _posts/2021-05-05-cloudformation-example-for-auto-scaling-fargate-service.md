---
layout: post
title:  "CloudFormation Example for Auto Scaling Fargate Service"
author: Thomas
tags: [ aws, containers, ops, serverless ]
description: How to add auto scaling to a Fargate service
---

Modern web applications need to scale well, both from a code and infrastructure perspective. While I believe that Lambda functions are a great platform to build off of for scalability, Fargate is also a valid option. With most developers being familiar with containers, Fargate gives us a great jumping-off point to run those containers in the cloud without getting in the way of how developers want to write applications. I'm bringing this up to mention that I understand the draw of developing with containers over developing for a Lambda function which is not as easy to run locally. Containers function the same in the cloud as they do on a local machine.

Containers and Fargate might offer an excellent developer experience, but there is one thing that Fargate does not offer right out of the box that a Lambda function will; auto scaling. When I deploy code to a Lambda function, I'm done. AWS handles provisioning and scaling for me as well as other operational aspects. When I deploy a container to a Fargate service, I still have to handle the way it scales because AWS does not do that for me out of the box. I have written in the past about a [simple Fargate service CloudFormation template](https://thomasstep.com/blog/cloudformation-example-for-simple-fargate-app), but that template excluded auto scaling. I wanted to go back and add auto scaling in to give a better foundation.

The template that I created is based on that original simple Fargate service template. The additions necessary were based around the auto scaling resources and a CloudWatch alarm to trigger the scaling. The auto scaling resources were an IAM role, an application auto scaling `ScalableTarget`, an application auto scaling `ScalingPolicy` to scale the service up, and another application auto scaling `ScalingPolicy` to scale the service down. The auto scaling target is meant to point the auto scaling policies at the right service and the scaling policies are meant to be triggered by an external event. The external event in my template's case is a CloudWatch alarm.

CloudWatch alarms can track metrics in AWS (built-in or user-defined) and trigger actions based on those metrics. For my template, I chose to scale up or down based on the number of requests received through the load balancer within one minute. If the amount of requests exceeds my predefined limit, the Fargate service is scaled up by adding a new task to help handle that load. After the amount of requests drops back below my predefined limit, the Fargate service is scaled back down. In this way, we can dynamically allocate the proper amount of computing resources behind a service.

I chose to use the number of requests per minute in my template, but the entire purpose was not to say that scaling based on requests is the best idea. I simply want to give a baseline or a starting point and I hope that someone can take that template and tweak it to best suit their needs. Basing a scaling policy on requests also made it much easier for me to test that everything was functioning properly. All I needed to do to verify that my service would scale is send a few requests to it and monitor the number of tasks that Fargate had spun up for my service. As I send more requests, I can monitor the alarm's dashboard and watch the auto scaling events being dispatched as another form of verification.

I will add the auto scaling resources to this post but not the entire functioning template. To see the whole template, you can reference [my aws-cloudformation-reference GitHub repo](https://github.com/thomasstep/aws-cloudformation-reference/blob/master/fargate/auto-scaling/auto-scaling-service.yml).

```yml
  AutoScalingRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - ecs-tasks.amazonaws.com
            Action:
              - 'sts:AssumeRole'
      Path: '/'
      Policies:
        - PolicyName: root
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - ecs:DescribeServices
                  - ecs:UpdateService
                  - cloudwatch:DeleteAlarms
                  - cloudwatch:DescribeAlarms
                  - cloudwatch:PutMetricAlarm
                Resource: '*'

  AutoScalingTarget:
    Type: AWS::ApplicationAutoScaling::ScalableTarget
    Properties:
      MinCapacity: 1
      MaxCapacity: !Ref MaxContainers
      ResourceId: !Join
        - '/'
        - - service
          - !Ref EcsCluster
          - !GetAtt FargateService.Name
      ScalableDimension: ecs:service:DesiredCount
      ServiceNamespace: ecs
      RoleARN: !GetAtt AutoScalingRole.Arn

  ScaleUpPolicy:
    Type: AWS::ApplicationAutoScaling::ScalingPolicy
    Properties:
      PolicyName: !Sub '${FargateService}ScaleUpPolicy'
      PolicyType: StepScaling
      ScalingTargetId: !Ref AutoScalingTarget
      StepScalingPolicyConfiguration:
        AdjustmentType: ChangeInCapacity
        Cooldown: 60
        MetricAggregationType: Average
        StepAdjustments:
          - MetricIntervalLowerBound: 0
            ScalingAdjustment: 1
  ScaleDownPolicy:
    Type: AWS::ApplicationAutoScaling::ScalingPolicy
    Properties:
      PolicyName: !Sub '${FargateService}ScaleDownPolicy'
      PolicyType: StepScaling
      ScalingTargetId: !Ref AutoScalingTarget
      StepScalingPolicyConfiguration:
        AdjustmentType: ChangeInCapacity
        Cooldown: 60
        MetricAggregationType: Average
        StepAdjustments:
          - MetricIntervalUpperBound: 0
            ScalingAdjustment: -1

  AlarmHighRequests:
    Type: AWS::CloudWatch::Alarm
    Properties:
      ActionsEnabled: TRUE
      AlarmActions:
        - !Ref ScaleUpPolicy
      AlarmDescription: !Sub
        - 'Scale Up Alarm based on requests for ${FargateServiceName}'
        - FargateServiceName: !GetAtt FargateService.Name
      ComparisonOperator: GreaterThanThreshold
      DatapointsToAlarm: 2
      # the dimensions can be found in the console after selecting a namespace to filter by
      Dimensions:
        - Name: TargetGroup
          Value: !GetAtt TargetGroup.TargetGroupFullName
      EvaluationPeriods: 3
      # the metric name can be found in the console on the screen before a metric is graphed
      MetricName: RequestCountPerTarget
      # the namespace can be found in the console on the first screen before filtering metrics
      Namespace: AWS/ApplicationELB
      OKActions:
        - !Ref ScaleDownPolicy
      Period: 60
      Statistic: Sum
      Threshold: 3000
      TreatMissingData: ignore
      Unit: None # comes from the metric
```
