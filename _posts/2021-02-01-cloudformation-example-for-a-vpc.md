---
layout: post
title:  "CloudFormation Example for a VPC"
author: Thomas
tags: [ aws, ops ]
description: Difference between public and private subnets and understanding VPC components
---

Creating a VPC feels like a rite of passage of sorts to AWS. VPC stands for Virtual Private Cloud, and every AWS account comes with a default VPC already created for us when we get there. VPCs are a way to keep cloud resources isolated. I recently created a [CloudFormation template for a basic VPC](https://github.com/thomasstep/aws-cloudformation-reference/blob/98d23f0b5eef9db731e98b3c38cc8957c60ad8e3/vpc/basic/vpc.yml) and I wanted to share a few different pieces that went into building it. Having a basic understanding of networking will probably be beneficial to understand these concepts.

Luckily, I worked as a network engineer for a few summers before I got my software engineering job, so having that background in networking let me bypass having to learn a few concepts while I was building this template. A VPC needs some networking to function correctly. At a minimum, I needed to know what subnets were and how to further subnet my network. The default VPC uses the `172.31.0.0/16` network, which is in the `172.16.0.0/12` private IP range. I decided to create my VPC using the `10.0.0.0/16` network and create 4 `/24` subnets inside of it. This is not the most efficient subnetting, but my goal was just to make a baseline template that I could later alter to fit my needs. I wanted 2 public subnets and 2 private subnets in my VPC, which might mean something different to non-AWS users. In AWS, a public subnet is a subnet with a route to an internet gateway, and a private subnet does not have a direct route to an internet gateway. An internet gateway lets traffic flow between the internet and my VPC. I also wanted to add my subnets to 2 different availability zones to increase redundancy in anything that I create.
```yml
Resources:
  BasicVpc:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsSupport: 'true'
      EnableDnsHostnames: 'true'

  PublicSubnetA:
    Type: AWS::EC2::Subnet
    Properties:
      CidrBlock: 10.0.0.0/24
      AvailabilityZone: us-east-1a
      VpcId: !Ref BasicVpc
      MapPublicIpOnLaunch: true
  PublicSubnetB:
    Type: AWS::EC2::Subnet
    Properties:
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: us-east-1b
      VpcId: !Ref BasicVpc
      MapPublicIpOnLaunch: true
  PrivateSubnetA:
    Type: AWS::EC2::Subnet
    Properties:
      CidrBlock: 10.0.2.0/24
      AvailabilityZone: us-east-1a
      VpcId: !Ref BasicVpc
  PrivateSubnetB:
    Type: AWS::EC2::Subnet
    Properties:
      CidrBlock: 10.0.3.0/24
      AvailabilityZone: us-east-1b
      VpcId: !Ref BasicVpc
```

To allow the instances in my VPC to communicate with the outside world, I needed to give them a route in a route table. That route is for `0.0.0.0/0` and is pointed at the internet gateway. I also needed to associate my subnets with the route table that I created.
```yml
  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref BasicVpc

  InternetGateway:
    Type: AWS::EC2::InternetGateway
  InternetGatewayAttachment:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      InternetGatewayId: !Ref InternetGateway
      VpcId: !Ref BasicVpc

  PublicDefaultRoute:
    Type: AWS::EC2::Route
    Properties:
        RouteTableId: !Ref PublicRouteTable
        DestinationCidrBlock: 0.0.0.0/0
        GatewayId: !Ref InternetGateway

  PublicSubnetARouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnetA
      RouteTableId: !Ref PublicRouteTable
  PublicSubnetBRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnetB
      RouteTableId: !Ref PublicRouteTable
```

Next came the private subnets, which had to be configured a little differently. My goal was to be able to spin up compute instances in the private subnets and allow them to communicate with the outside world, which is similar to the public subnets. However, I did not want to give the outside world the option to initiate communication. To set that up I needed to provision a NAT gateway for each availability zone in the corresponding public subnet. Those NAT gateways both needed a public IP or Elastic IP to communicate with the internet and they communicated using through the internet gateway which the public subnets had direct routes to.
```yml
  NatA:
   Type: AWS::EC2::NatGateway
   Properties:
      AllocationId:
         Fn::GetAtt: EipA.AllocationId
      SubnetId:
         Ref: PublicSubnetA
  EipA:
    DependsOn: InternetGatewayAttachment
    Type: AWS::EC2::EIP
    Properties:
        Domain: vpc

  NatB:
   Type: AWS::EC2::NatGateway
   Properties:
      AllocationId:
         Fn::GetAtt: EipB.AllocationId
      SubnetId:
         Ref: PublicSubnetB
  EipB:
    DependsOn: InternetGatewayAttachment
    Type: AWS::EC2::EIP
    Properties:
        Domain: vpc
```

After those NAT gateways were set up, I simply had to create routes from the private subnets to the NAT gateways by telling them that the NAT gateway was the default route, and associate the subnets with the route tables that held those routes.
```yml
  PrivateRouteTableA:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref BasicVpc
  PrivateRouteTableB:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref BasicVpc

  NatRouteA:
    Type: AWS::EC2::Route
    Properties:
        RouteTableId:
          Ref: PrivateRouteTableA
        DestinationCidrBlock: 0.0.0.0/0
        NatGatewayId:
          Ref: NatA
  NatRouteB:
    Type: AWS::EC2::Route
    Properties:
        RouteTableId:
          Ref: PrivateRouteTableB
        DestinationCidrBlock: 0.0.0.0/0
        NatGatewayId:
          Ref: NatB

  PrivateSubnetARouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PrivateSubnetA
      RouteTableId: !Ref PrivateRouteTableA
  PrivateSubnetBRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PrivateSubnetB
      RouteTableId: !Ref PrivateRouteTableB
```

The difference between public and private subnets in AWS confused me at first, and I had to go through some trial and error to get this template working. I felt accomplished after getting this done because I had always taken VPC configuration for granted before this. I feel much better versed in VPCs, VPC components, and VPC networking now that I have gone through this exercise.
