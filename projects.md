---
layout: default
title: Projects And Services
hide_mailchimp_signup: true
---

# [Papyrus](https://papyrusmenus.com/)

Papyrus was spawned after a terrible QR code menu experience that I had at a local restaurant. I wanted to make a simple and reliable solution to this. I am currently marketing mostly to local restaurants, but the service is obviously open an available to all.

The infrastructure stack is totally serverless. From the APIs using Lambda to the file storage using S3. Authentication for this application is through Crow Authentication. Back end is Node, front end is Next.js and Tailwind CSS.

# [Crow Authentication](https://crowauth.com/)

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
