---
layout: post
title:  "Papyrus Architecture"
author: Thomas
tags: [ aws, databases, dev, javascript, meta, ops, serverless ]
description: Discussing the serverless architecture of a project
---

[Papyrus menus](https://papyrus.thomasstep.com/) has been released for about eight months now (if anyone would like the service for free send me an email) and I wanted to take some time to go over its architecture. The whole thing is serverless and hosted in AWS. I used a few flows that were new to me during this project and those are mostly what I want to highlight on the backend. On the front end, nothing too crazy came out of this project except using S3 and CloudFront and how I displayed PDFs to mobile users. This discussion will start with a brief overview of the capabilities of Papyrus and then transition to the technical side starting from the back and moving to the front.

**Table of Contents:**
- [Overview](#overview)
- [Data Storage Layer](#data-storage-layer)
- [API Layer](#api-layer)
- [Presentation Layer](#presentation-layer)
- [Wrap Up](#wrap-up)

## Overview

Papyrus is a QR code menu hosting service. The foundational entity of the service is a menu that has a unique ID, configurable name, a URL for the menu based on its ID, and a QR code for the menu based on its ID. The menu itself is a PDF file uploaded by the user and can be updated at any time without needing to change out QR codes since it is anchored on a menu's unique ID. The next entity builds on top of menus and is called a menu group. Menu groups are what they sound like. The idea behind this functionality was for a restaurant to be able to define and group similar menus. For example, dinner menus for drinks, entrées, and desserts could all be grouped and updated independently of each other while another menu group could contain relevant brunch menus for different foods and drinks.

The core functionality of Papyrus is simply that: menus and menu groups. How menus are uploaded, QR codes are created, and all of this is delivered to a diner in the user's restaurant are the interesting technical bits.

## Data Storage Layer

As far as data goes, everything is stored in DynamoDB and S3. Dynamo holds all of my application-specific data like user information, owned menus, and owned menu groups. Authentication is handled by [Crow Authentication](https://crowauth.thomasstep.com/), so a user's identity is verified using the JWT presented to Papyrus's API by an authorizer Lambda attached to the API Gateway. Relevant and non-changing user information is also retrieved by the authorizer Lambda and provided as extra context, which results in fewer DynamoDB calls and more performant endpoints.

A unique ID is generated and stored in the database as soon as a new menu is created. At that point, the menu's URL can be generated as well as the QR code for the menu's URL since both are anchored on that unique ID. Both the PDF menu and the QR code are stored in S3 and distributed through CloudFront. There will be more information about how the URLs and QR codes are generated in the [API Layer section](#api-layer) and more about the distribution in the [Presentation Layer section](#presentation-layer).

The S3 bucket that stores menu PDFs is versioned with lifecycle rules, which means that an updated menu will retain the older version of itself for 30 days before expiring it. This allows me to restore an old version upon a customer's request within a reasonable timeframe and cut down on storage costs over the long term.

QR codes are simply information encoded in a visual format. I chose to save Papyrus's menu QR codes as `png` files, so they also have their own S3 bucket. The QR code S3 bucket is also versioned but does not necessarily need to be. I version S3 buckets as a standard to protect against accidental deletion.

## API Layer

Papyrus's API Layer is made up of an API Gateway and Lambda functions. I brought it up in the [Data Storage Layer](#data-storage-layer) section, but authentication is provided by Crow Authentication and the presented JWT is handled by an authorizer Lambda. I have found this to be a great combination. There was not anything particularly interesting in how I set up my API Layer's infrastructure, nor the code that runs in it save for one endpoint: generating a signed S3 URL.

I had previously never dealt with file uploads, but since Papyrus allows users to upload PDF menus, now was the time to learn. The HTML portion of this is a simple `input` tag of `type="file"` that captured the file as a binary and a corresponding save button which performed two API calls: one to retrieve a signed URL and another to upload the PDF to that URL. Generating the signed URL involved a Lambda function with specific write permissions to the menu S3 bucket creating a `PutObjectCommand` payload and passing it to the `getSignedUrl` function, both from the AWS SDK. The following code snippet should give an idea of what that involved (note that the code is incomplete but a good starting point for anyone trying to accomplish something similar). I have also written about [uploading files to S3 from a web application's perspective](/blog/uploading-files-in-a-web-application-with-aws-s3) separately.

```javascript
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

exports.handler = async function (event, context, callback) {
  const input = {
    Bucket: MENU_BUCKET_NAME,
    Key: `menu/${menuId}`,
    ContentType: 'application/pdf',
  };
  const command = new PutObjectCommand(input);
  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: PRESIGNED_URL_EXPIRATION_SECONDS,
  });

  const data = {
    statusCode: 200,
    body: JSON.stringify({
      signedUrl,
    }),
  };
  return data;
}
```

## Presentation Layer

The presentation layer was mostly handled by [Next.js and Vercel](/blog/my-introduction-to-nextjs-and-vercel), but some of the content was served by my own creation. The QR codes and menus were served from CloudFront distributions. Since I based everything on the menu IDs, I was easily able to construct URLs for that content based on a static domain name and menu IDs. I had previously never personally set up and looked into CloudFront so hooking this all up was a first. It was extremely easy, I love the built-in security features gained from simply distributing files through CloudFront instead of S3, and caching at the edge saves transfer costs over the long run.

The whole idea around Papyrus (and any QR code menu) is to show the menu in a mobile format. The problem with mobile browsers is that they do not normally have built-in PDF viewers, so if a PDF is presented to a mobile browser, the browser instead attempts to download the PDF and then display it in another PDF viewer app. I did not want that behavior. I wanted everything to show up without changing apps. My solution was to use a package called [`react-pdf`](https://react-pdf.org/). This allowed me to render the PDF and all its pages natively in the browser by doing some SVG drawing. After researching what it takes to draw PDFs in a browser, I was confused and overwhelmed because the process is convoluted and poorly documented. Major kudos to [Wojciech Maj](https://github.com/wojtekmaj) for weeding through it all and making an easy-to-use package.

## Wrap Up

Papyrus presented me with new challenges mostly relating to file storage and distribution. There were pieces that were "standard" and "boring" like the tried-and-true API Gateway, Lambda, and DynamoDB integrations that serviced just about every API call though. I feel that learning about serving files like this important and forced me to produce code that I can reference back to time and time again.