---
layout: post
title:  "Introducing Crow Authentication"
author: Thomas
tags: [ aws, databases, dev, javascript, meta, ops, security, serverless ]
description: Announcing Crow Authentication as a Service
---

Over the last month, I've been underground working on a project that I call Crow Authentication or, lovingly, Crow. It spawned when I set about creating a new application for myself that needed basic authentication. I had already implemented authentication in a [previous project](/projects) of mine so I had the nuts and bolts. As I was about to start copying and pasting code from one project into another a much better idea entered my head. I was going to create a service for myself that handled authentication for all of my projects. That naturally spiraled into creating a service and offering it to anyone. I wanted Crow to be Software as a Service, and this was my first venture into writing an application that offered itself up as a service like this.

I went down quite a few rabbit holes reading and learning about JWTs, OpenID Connect, OAuth, bcrypt, the list goes on. There's a ton to digest in this space. It's no wonder most developers want to hand this tedious piece of web apps off to libraries and other services. If I hadn't been so stubborn on wanting to learn about it, I would have handed it off. Dealing with crypto is not always the best developer experience.

Now I am much more comfortable with cryptography and authentication, and I am proud of what I built. For anyone curious about rolling their own authentication, I say go for it. There is a lot of information online saying to use an established service to handle your authentication, but if your motivation is simply education, then learning cryptography and authentication is quite rewarding. When it comes to authentication for an application with paying users, I would recommend choosing a more established provider for one reason: authentication is the emphasis, specialty, and full-time job.

One area of Crow that I am particularly fond of is the infrastructure. For anyone who has read my recent blog posts, I have been pretty deep into AWS and cloud infrastructure. I took that same enthusiasm to Crow's infrastructure. I designed it to be quick and immensely scalable with a fully serverless architecture. I'm not expecting a rush of users, but if there were, I believe the infrastructure would absorb any extra load and scale right alongside it. I also have plans to extend the asynchronous infrastructure to make the experience feel that much quicker to users.

Moving from the infrastructure up the stack, we get to the APIs. My background as a back-end engineer made me want to provide Crow with a set of easy and intuitive APIs. While I might make an SDK or something similar in the future, the APIs are an easy way to integrate Crow with an application. I have personally already used Crow in Next.js projects, but because the functionality is exposed through APIs, the service can integrate with any server or language.

To be completely honest, my front end is my weakest point from a design standpoint. To be fair, I was never the most artistic person, but I did what I could on a bootstrapped budget. All of the necessary functionality exists and I will continue to iterate on what I have so far to make a better user experience. If anyone with design or front-end experience has any pointers or suggestions, I would love to hear them.

Crow Authentication is fully managed authentication as a service that's wildly simple to integrate with. I currently have an option for others to use the service up to a generous number of users before a subscription is required. If you are worried about reaching that limit and not having the finances to justify paying a subscription, please reach out to me and we can work something out. My intention is not to harvest money from users, but rather work with others to provide a service that they enjoy using. As we all know, running an application can cost money though, so I need to cover my end of the finances as well.

I encourage you to try out Crow Authentication and let me know what you think. Being an early adopter of Crow means you will receive white-glove service. I would appreciate any questions, comments, or feedback regarding Crow. Feel free to contact me for more information at support@crowauth.com. (I might reply from another email address because I'm a bootstrapper and don't have the budget for custom email hosting...sorry not sorry.)





PH info:

tagline:

Authentication as a Service

description:

Crow Authentication is a quick and easy way to integrate authentication into your application. With a set of intuitive APIs, Crow is language and framework agnostic.

first comment:

Hello Product Hunt! I made this service to speed up my own product creation and I hope that I can help speed up your time to market as well. My goal with Crow Authentication is to make a product that others use and enjoy.
If something is holding you back from using Crow, please let me know. New features, deployed regions, integration difficulties, or anything else you want to see before using Crow, I will do my best to quickly support your request. I want to let my users shape the product's roadmap, and by being one of my early users you will get special attention.