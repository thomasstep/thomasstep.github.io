---
layout: post
title:  "Building a Slack App"
author: Thomas
tags: [ aws, dev, javascript, serverless ]
description: Building a Slack application with AWS Lambda
---

Over the past few months, I got really into building apps for a marketplace. I threw together an app that I thought was fun just to see if anyone on that platform would use it about a year and a half ago. About 6 months ago, I received an email regarding adding features to that application. I had not thought about it over the year that it was live, and I was surprised to see that I had users when I looked at the statistics. I agreed to make their feature, and I started looking around for other opportunities to build applications for that marketplace.

One of the integrations that was missing was between their SaaS and Slack. Slack is a fairly well-used tool so I was surprised that no one had made that integration yet. I use it daily in my job, and I thought it could lead to benefits down the road as far as automating parts of my job. For that reason alone building a Slack application would be beneficial.

There were a couple of things I needed to quickly learn about Slack applications before I could even start building out my own. First was learning how they are distributed, then came all the permissions and APIs, and finally came writing the code that received events from Slack and acted on them.

## Distribution

Slack apps can be distributed in several ways. Applications can be privately distributed, which would work well for an application custom-made for yourself and not intended for a wider audience. Applications can be publicly distributed, which means that others can use them but the developer (me) needs to provide users with a way to install or authorize the application. Lastly, applications can be publicly distributed through Slack's official marketplace. I ultimately went with the public distribution method without going to the official Slack marketplace.

Slack, like most large SaaS providers, authorizes using OAuth, and they provide a pretty handy library to help with that authorization. The idea here is that your application sits and waits for someone to decide to authorize it. Once a Slack admin authorizes your application to access certain parts of their Slack workspace, then your application can post messages or listen for certain events like emoji reactions. The library that Slack offers to ease all of its operations is called [Bolt](https://api.slack.com/tools/bolt) and it is offered in JavaScript, Python, and Java.

Since we are now getting into technicalities, it is worth pointing out that I built my Slack application using AWS Lambda. One strange adaptation I had to make to the Bolt boilerplate code was to run the OAuth receiver in a Lambda. Slack claims that there is a way to do this out-of-the-box, but it did not work for me or any of the other people online who submitted issues to their repository. I had to instead run the OAuth receiver portion of Bolt as an Express receiver and then use a package called [`aws-serverless-express`](https://www.npmjs.com/package/aws-serverless-express) to run that Express receiver through Lambda. This is something that I want to circle back to at some point because that package is deprecated, but this is where I am at the moment.

Slack provides a little [generator](https://api.slack.com/authentication/oauth-v2#buttongen) to create your own "Add to Slack" button which a user would click to kick off the Slack OAuth installation sequence. The "Redirect URI" would lead users to your OAuth receiver where final processing can be completed such as storing the installation details. The installation details provided in the OAuth receiver include the owner information for the Slack workspace, the bot token for that workspace, and the permission scopes given to the bot. Once the pertinent information is stored in your database, your application is officially installed in their Slack workspace.

## Permissions

The permissions in Slack are intuitive but necessary to talk about. Permissions are part of the OAuth URL (in the "Add to Slack" button) and once those permissions are requested, your bot is stuck with them. Make sure that you know which permissions you need now and will need for future planned features.

Knowing which permissions you need is as easy as shopping around the [API documentation](https://api.slack.com/methods). Each API method will also list out the required scopes to perform that operation. As you write out functionality for your application, just make sure to also keep a running list of the minimum required scopes needed to implement that functionality.

What happens if you need permissions that you did not ask for during the installation? Fear not, there are ways to request additional permissions from your users. I have already needed to increase the amount of permissions that my users need to give my bot. The gist of requesting new permissions is that the user will need to reinstall your application. This means that they will need to navigate to a new OAuth installation URL with the added scopes. This can be obtained by using the "Add to Slack" button generator mentioned earlier.

Now the trickier part is, how do you get your users to click that button or navigate to your updated URL? I asked Slack's support team the same question. Their answer was to either use the bot token to send them a direct message or you have to revoke their token, which is essentially uninstalling the app for them. I didn't like either of those methods.

I opted for my own solution. There is a method in the Slack API called [`postEphemeral`](https://api.slack.com/methods/chat.postEphemeral) which posts a message that only one user can see. I added some temporary logic to listen to messages, check the bot's allowed scopes (information stored by my OAuth receiver), and send the user an ephemeral message about needing to update. This allowed me to send my users notifications that they needed to reinstall for the latest features without disrupting their service. After they reinstalled, my OAuth receiver updated their bot token and allowed scopes stored in my database, and they never saw the message again.

## APIs

Now comes the bread and butter of everything. What is a modern application if you can't interact with it? Anything you can do in the Slack UI, you can do through the API, and more. The [Slack API is well-documented](https://api.slack.com/methods) and is easy to use. If you are using Bolt, some of the common actions, like replying to messages, [have much easier-to-use function calls](https://slack.dev/bolt-js/concepts#message-sending). Otherwise, you will need to instantiate a Slack client to interact with their API. I used [`@slack/web-api`](https://www.npmjs.com/package/@slack/web-api) since I was writing this application in JavaScript.

```js
const { WebClient, LogLevel } = require('@slack/web-api');

// const slackInstallationToken = readBotTokenFromDatabase();

const client = new WebClient(slackInstallationToken, {
  logLevel: LogLevel.INFO,
});
```

On the documentation page for a given API method, there will be a row near the top called "Method access". Click on your preferred language and it will show you the name of the function you will need to call to access the method through the client.

Every event receiver written will also have access to the web client, but more on that in the next section.

## Receiving Slack Events

The API is great, but Slack events might be more fun. This is where your application not only gets to interact with Slack but also gets to interact with users based on their actions. There are loads of [event types that we can listen to](https://api.slack.com/events) with the most popular being [messages](https://api.slack.com/events/message).

Using Bolt makes receiving events a breeze. There is some initial setup in the Slack app management console to tell Slack where to send your events and which events you want to listen to, but after that, you only need to list out your event listeners and write logic to handle them. Bolt takes care of transforming requests into friendlier formats.

Each event handler gets access to a couple of important pieces of information: `event`, `client`, and `logger`. The event is the payload of the actual event as it is seen in its documentation. The `client` is an instance of the web API client that I mentioned in the [APIs section](#apis). The logger is a logger, although I preferred to use my logging solution. Any event type can be listened to by passing that type as a parameter in the listener setup, but you will need to repeat this for as many events as you want to handle. Here is what a listener setup might look like.

```js
app.event('reaction_added', async ({event, client}) => {
  // Handle reaction
});
```

There is obviously more about Bolt that I will not bring up here. Their documentation is great and there seems to be a decent community online around building with Bolt.

## You're Live!

Now you have a way for users to install your application, your bot can interact with the Slack API, and you can react to your user's actions. You're up and ready to go. I really enjoyed putting my application together and building with Slack. It's quick, easy, and rewarding. Have fun building your own application!
