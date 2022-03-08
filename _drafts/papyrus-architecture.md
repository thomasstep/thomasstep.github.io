---
layout: post
title:  "Papyrus Architecture"
author: Thomas
tags: [ aws, databases, dev, javascript, meta, ops, serverless ]
description: Discussing the serverless architecture of a project
---

[Papyrus menus](https://papyrus.thomasstep.com/) has been released for about eight months now (if anyone would like the service for free send me an email) and I wanted to take some time to go over its architecture. The whole thing is serverless and hosted in AWS. I used a few flows that were new to me during this project and those are mostly what I want to highlight on the backend. On the frontend, nothing too crazy came out of this project except for a few interactions with S3 and CloudFront and how I displayed PDFs to mobile users. This discussion will start with a brief overview of the capabilities of Papyrus and then transition to the technical side starting from the back and moving to the front.

## Overview

Papyrus is a QR menu hosting service. The foundational entity of the service is a menu which has its own unique ID, configurable name, a URL for the menu based on its ID, and a QR code for the menu based on its ID. The menu itself is a PDF file and can be updated at any time without needing to change out QR codes. The next entity builds on top of menus and is called a menu group. Menu groups are what they sound like. The idea was for a restaurant to be able to define and group together similar menus for example menus for drinks, dinner, and desserts could all be group and updated independently of each other.

## Data Storage

As far as data goes, everything is stored in DynamoDB and S3. Dynamo holds all of my application specific data like user information, menus, and menu groups.

The unique ID is generated and stored in the database as soon as a new menu is requested. A name for the menu is

## API Layer

API Gateway and Lambda

## Presentation

CloudFront distribution in front of the S3 buckets