---
layout: post
title:  "Slack OAuth Redirects In AWS Lambda"
author: Thomas
tags: [ dev, entrepreneurship, go, javascript, serverless, startup ]
description: AWS Lambda and Slack OAuth
---

As I have previously discussed in [building a Slack app](/blog/building-a-slack-app), I was able to figure out a better way to handle OAuth redirects in AWS Lambda. I had an issue with the way I had to implement this in my very first Slack app and wanted to go back and fix it. In this post, I wanted to go over what I did in a more technical light.

I would suggest going back to read the "Distribution" section of my post about the [first Slack app](https://thomasstep.com/blog/building-a-slack-app#distribution) I wrote because it would help you get up-to-speed about the downfalls of using Slack's Bolt framework with Lambda. The short version is that Bolt's OAuth receiver does not work with AWS Lambda, so I needed to use a hacky workaround to get the Bolt OAuth receiver working. I needed to run it first as an Express receiver and then use another package to run that receiver as a Lambda handler. I did not like that approach because it felt hacky. But this is OAuth. A well-defined flow and something I have implemented from scratch before. I decided I would simply handle the OAuth redirect myself. How hard could it be? Turns out it was fairly easy.

After refamiliarizing myself with OAuth using the [Slack OAuth documentation](https://api.slack.com/authentication/oauth-v2), I found that they send their OAuth code using a query parameter. That access code is then exchanged for a token using Slack's [`oauth.v2.access` endpoint](https://api.slack.com/methods/oauth.v2.access) and voilà we have working Slack credentials received through OAuth. That's essentially the back half of OAuth in a nutshell for any provider. Here's what that might look like in Node for a Lambda function.

```javascript
async function lambdaHandler(event) {
  // This is our access code
  const code = event.queryStringParameters.code;

  // Now we exchange that access code for a token
  const getAccessTokenRes = await axios({
    method: 'post',
    url: 'https://slack.com/api/oauth.v2.access',
    auth: {
      username: process.env.SLACK_CLIENT_ID, // This comes from the Slack console
      password: process.env.SLACK_CLIENT_SECRET, // This comes from the Slack console
 },
    params: {
      code: code,
      grant_type: 'authorization_code',
 },
 });

  // Check to see if we need to get out
  if (getAccessTokenRes.status !== 200 || !getAccessTokenRes.data.ok) {
    throw new Error('Error while getting access token');
 }

  // Now you can use or save your token
  const token = getAccessTokenRes.data.access_token;
}
```

It's as easy as that to handle the OAuth redirect and get an access token. However, there is an additional step if you want to completely recreate what the Bolt handler does for you. The access token is part of what the Bolt handler returns, but after poking around the source code a little, I realized that they also call the [`auth.test` endpoint](https://api.slack.com/methods/auth.test), which provides additional information about your token as an introspection API. That information is neatly bundled into an object and returned to you seamlessly from the Bolt handler, but we will need to make an additional Slack API call to include it. Here is what that might look like.

```javascript
  // ...continuing from last example

  // Echoing auth.test gives us the bot ID which is necessary for Bolt
  const getAuthTestRes = await axios({
    method: 'post',
    url: 'https://slack.com/api/auth.test',
    headers: {
      Authorization: `Bearer ${getAccessToken.data.access_token}`,
 },
 });

  // Check to see if the access token is working as intended
  if (getAuthTestRes.status !== 200 || !getAuthTestRes.data.ok) {
    throw new Error('Error while testing access token');
 }

  // Save access token, bot ID, and other relevant information in a DB for later use
```

As noted in the comments of that snippet, you will need to keep track of your "bot ID" if you want to use Bolt later on in your application, which I recommend. Now you have the same information that the Bolt OAuth handler would give you, except you do not need to do the hacky workaround that I needed to before.
