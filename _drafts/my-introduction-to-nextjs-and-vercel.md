---
layout: post
title:  "My Introduction To Nextjs and Vercel"
author: Thomas
tags: [ dev, javascript ]
---
Recently I have been working on a side project that I am building with [Next.js](https://nextjs.org/) and deploying with [Vercel](https://vercel.com).
When I started using these technologies, Vercel was actually called Zeit, but they have since changed their name.
Next was actually built by Vercel, more specifically [Guillermo Rauch](https://rauchg.com/).
I have used and enjoyed other tools that he has written/created in the past, so it is no wonder I have only had positive experiences with these so far.
Before I get too deep into these technologies and why I have enjoyed using them so far I want to say this: I did not think that getting a React application running and deployed could be so easy.
When I first started this side project, I knew that I wanted to use React.
I knew that I wanted to use an Apollo server backend.
I guessed that I was going to have a hard time getting it built and deployed.
I was wrong.

After about one afternoon of looking over the [Nextjs tutorials](https://nextjs.org/learn/basics/create-nextjs-app) and reading how to integrate [Vercel with GitLab](https://vercel.com/gitlab), I had a working application deployed and ready to view at a URL.
The last few months I have been working with AWS doing CI/CD for serverless applications, and nothing I have done has been this easy.
Granted, Next and Vercel are made by the same company, so they do have the upperhand at knowing exactly how to deploy their own product.
Even still, I am impressed with how simple they made it.
Next is intuitive and Vercel makes CI/CD simple.
If you are on the fence about trying this stack out, I highly recommend it.

Next is an opinionated React framework with a bunch of optimizations out of the box.
The filesystem acts as the router, there is built in pre-rendering and SSR, and there is support for API routing with the routes being serverless functions.
I knew React going into this, but I could have just as easily picked it up without any prior knowledge.
The tutorials and examples that come with Next are super helpful and make getting started a breeze.
Once I learned this framework existed, I wanted to experiment and learn more about it.
I continue to discover more about Next, and I will be sharing what I learn on my blog.

Vercel is a platform for static sites and serverless functions, which means that it makes deploying Next extrememly easy.
These two technologies were made for each other and it is apparent how well they were made for each other.
I used Vercel for GitLab and had no problems setting it up.
Within a few minutes I had a working site with its own domain name.
[Vercel also has a CLI](https://vercel.com/docs/cli#getting-started) which gives you access to control environments, secrets, domains, and more.

Simply dipping your toes into these techonologies shows how well thought out they both are and how well they harmonize together.
I have loved my experience with Next and Vercel so far and I am excited to dive in further.
