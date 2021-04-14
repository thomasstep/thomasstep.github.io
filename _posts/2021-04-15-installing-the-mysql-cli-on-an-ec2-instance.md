---
layout: post
title:  "Installing the MySQL CLI on an EC2 Instance"
author: Thomas
tags: [ aws, ops, databases ]
description: "Installing the MySQL CLI on an EC2 instance"
---
The other day I spun up an RDS cluster in a VPC and wanted to connect to it to make sure everything looked correctly configured. However, since I put the cluster in a private subnet and only allowed connections from the VPC, I was not able to connect from my desktop. The solution I decided to go for was spinning up a small EC2 instance, SSHing into the EC2 instance, and connecting to my database through the CLI. Unfortunately, the default AMI does not come with the `mysql` CLI installed. Here is how I installed it.

```bash
$ sudo yum install -y https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
$ sudo yum install -y mysql-community-client
$ mysql -u MY_USER -p`MY_PASSWORD` -h MY_HOST -P 3306
mysql> show databases;
```

After installing and connecting to my database, I was able to confirm that everything was up an running.

