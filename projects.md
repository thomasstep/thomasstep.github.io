---
layout: default
title: Projects And Services
---

# [Sweatspaces](https://sweatspaces.com)

Sweatspaces is a marketplace for home gyms. Users can list their home gym or rent out existing home gyms. The app is built using event-driven microservices. Main infrastructure is AWS API Gateway, Lambda, SNS, S3, and MongoDB. There are 6 microservices. The front end is Next.js and designed with MUI. The application is fully integrated with Stripe to accept payments.

# [Site Analytics](https://github.com/thomasstep/site-analytics)

As part of my move away from Google Analytics I wanted to create my own site analytics service. This is a free and open-source version of that service. I plan on created a managed version in the future if there is desire (email me if you would like a managed version). The design and documentation in the README was meant to serve as an extension of this blog and projects page so that the documentation for the service lives with the code. I also [streamed](https://www.youtube.com/watch?v=veCyV07dsg4&list=PLzcYUWwW5dVDA6mja1de7d2A2L9gppkFL) most of the time whenever I coded this.

# [Authentication Service](https://github.com/thomasstep/authentication-service)

I decided to redesign and open source Crow Authentication. This is the result. The design and documentation in the README was meant to serve as an extension of this blog and projects page so that the documentation for the service lives with the code. I also [streamed](https://www.youtube.com/watch?v=2ZhespSstvw&list=PLzcYUWwW5dVAnlFo1ZLdkCCRMNMwiPKeH) most of the time whenever I coded this.

# [Calendar API](https://rapidapi.com/tstep916/api/calendar22)

My calendar API was started out of a desire to create a scheduling SaaS. I naturally needed some way to keep track of events and places for users, so I decided to create a reusable service for that purpose that could also be used again in the future.

Calendar API is (unsurprisingly) completely serverless. Based on API Gateway, Lambda, and DynamoDB. The data model for this one was particularly interesting, and I will hopefully write up an architectural review of the service soon.

# [Papyrus](https://papyrus.thomasstep.com/)

Papyrus was spawned after a terrible QR code menu experience that I had at a local restaurant. I wanted to make a simple and reliable solution to this. I am currently marketing mostly to local restaurants, but the service is obviously open an available to all.

The infrastructure stack is totally serverless. From the APIs using Lambda to the file storage using S3. Authentication for this application is through Crow Authentication. Back end is Node, front end is Next.js and Tailwind CSS. I wrote up a short post about some of the more interesting decisions I made and flows that I used while build Papyrus that [you can read here](/blog/papyrus-architecture).

# [Crow Authentication](https://crowauth.thomasstep.com/)

Crow Authentication is provides easy authentication as a service through a set of intuitive APIs. Create an application in Crow Auth and have a deployed application with authentication in minutes.

Crow Auth is my first real attempt at creating a SaaS offering. My hope is to be able to provide value to others and potentially create a business at the same time. I had to take the full stack into consideration while building this application. It is all based on serverless technology and designed to scale tremendously. There are a few services working together behind the scenes to make the experience of providing authentication simple, and I have further plans to enhance the project as a whole.

# [AWS CloudFormation Reference](https://github.com/thomasstep/aws-cloudformation-reference)

This repo is meant to contain reference CloudFormation templates both for me and for others looking for a starting point for various AWS infrastructure and architecture. I found a lack of working templates whenever I started my AWS journey, and I am hoping to group together some of my knowledge with this. My goal is to create various CloudFormation templates that can work as a jumping off point for some commonly-used infrastructure patterns. I have personally created and managed services in an enterprise setting using these technologies and I wanted these to be a golden path of sorts. I am also making YouTube videos to go along with some of the templates.


# [Lichen](https://github.com/thomasstep/lichen)

Lichen is a dimmed vim color scheme that I put together for myself. I found lots of other color schemes while I was setting vim up, but none of them were exactly what I wanted. My goal was to feel like I was in a Scandinavian forest.


# [Pomodoro Noise](https://github.com/thomasstep/pomodoro-noise)

Pomodoro Noise is an iOS app that helps users focus by combining the Pomodoro technique and color noise. The app is simple by design so users can quickly and easily go from launching the app to focusing in just a few seconds. I wanted to build this because I have never developed an application before, and I wanted to publish something that can help others. The app is available on the Apple App Store.


# [Money Grows On Trees](https://money.thomasstep.com/)

Money Grows On Trees is a blog that I created and maintain. This project is also built with Next.js. I write posts in Markdown and convert those files to HTML. I use Tailwind for styling which was a new library for me. I have plans to add in some functionality revolving around retirement and investment calculations.


# [Elsewhere](https://elsewhere.thomasstep.com/)

Elsewhere is a collaborative trip planning web app. Each trip is represented by a map that can be shared. Markers can be added which signify places that you want to visit while you are on your trip. This spawned from trying to organize a trip using a saved list in Google Maps, but Google does not allow collaboration on their saved lists. The project built with Next.js and deployed using Vercel for GitLab. The data is stored in MongoDB and the GraphQL API is built with Apollo server.
