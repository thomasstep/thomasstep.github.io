---
layout: post
title:  "Elsewhere Diaries"
author: Thomas
tags: [ dev, javascript ]
---
Elsewhere is a side project that I started out of a problem I had while trying to plan an itinerary for a trip. Normally, I would use Google Maps and save pins, but the downside of doing that is that no one else can save pins to your list. Once I realized that, the idea of Elsewhere was born. My MVP was simple: create a way for multiple people to create a list of places they all wanted to go while on a trip. In this "diary", I will be discussing some of the technical challenges and different decisions I make while developing Elsewhere. I actually started this on 16 August 2020, so the older entries are an attempt to go back and fill in the details and decision making that I had at the time.

31 March 2020:

I am trying to decide on the tech stack that I want to use not only for code but also infrastructure. I have briefly worked with Docker and Kubernetes in the past and I want to learn it, so this might be the time that I can learn more about it. I am trying to find a cloud provider that will host a small cluster for free, but I can't seem to find one. I am going with MongoDB Atlas for my data layer since they offer a free DB. There were some weird things I needed to do to get a connection to the DB, but I think it is pretty steady now.

7 April 2020:

I found a platform called Zeit that will host a Next.js app for free. Next.js seems like exactly what I was looking for, a React front end and microservice API backend. I am going to use Apollo server for my GraphQL backend that will serve most of the data pertaining to the maps and markers that people create. The setup for Zeit was stupidly easy and with GitLab I already have a working CI/CD pipeline. This is a solid foundation.

12 April 2020:

I added Material UI and a Google map to my front end. I am not sure if I want to go with a map alternative like MapBox. Since I do not want to waste much time on this right now, I am going to just stick with Google maps since it is working and I will save the marker to my DB in a generic way. I have looked at the APIs for both maps libraries and it seems like I can place markers on both with only latitude and longitude, which makes sense. Maybe I will loop back around to this later on. The Material UI stuff was easy to set up and play with. I still need to figure out a theme.

16 August 2020:

I am moving away from using only social logins. I posted a link to Elsewhere on Reddit, and the feedback I got was that the person did not want to login in using a social login. People want options and don't want to feel tied down to their accounts, so I understand. I decided on using [Passport.js](http://www.passportjs.org/). I was not having a problem with the homemade method I was using for local credentials before, but I also wanted to take this chance to consolidate the different authentication methods I was using, which means I want to get rid of next-auth. I am not having any problems with next-auth, but I want to keep things simple. There is also a huge community behind passport, which is worth a lot I have realized. Local authentication with passport is complete. It was decently easy to get this portion up and running since the passport strategy is straightforward. I basically just copy and pasted the DB commands that I was using with my homegrown method of authentication over to the `authenticate` function that would be called by passport.

17 August 2020:

Migrating from next-auth to passport for Google OAuth was more difficult than the local strategy. Since I am using Next.js, there was the first difficulty of having to initialize passport in two different files/routes (`/api/google/signin` and `/api/google/callback`). After I realized that I needed to just duplicate the code, came the problem of actually calling the code. For some reason I just could not understand how to kick off the passport strategy from the front end which redirects to Google's sign in page. Now I realize all you need to do is call api route. There was a little trip up with how to call it though. I started out by calling `/api/google/signin` using fetch, but I was getting CORS errors. At first, I thought those CORS errors were from my own stuff, but it turns out they were actually from Google. After some digging and reading I discovered that you need to kick off the passport OAuth strategies (not only Google OAuth) from an `href` in a button instead of another HTTP client like `fetch` or `axios`. Once I changed that over everything started firing on all cylinders. I pretty much took a copy of the DB calls I made in the local strategy and made them work with the Google OAuth flow. The last sort of weird thing that I figured out was the lack of redirect support from the API routes in Next.js. [It even says in their documentation that there is a response helper called `redirect`](https://nextjs.org/docs/api-routes/response-helpers). I could not get it to work and kept getting errors about the function not existing. The solution that I found instead was from the [Node HTTP ServerResponse documentation](https://nodejs.org/api/http.html#http_response_writehead_statuscode_statusmessage_headers) which has a method called `writeHead`. This code redirects the user from an API route in Next.js
```javascript
res.writeHead(302, {
        Location: `${process.env.SITE}/profile`,
      });
      res.end();
```
After I deployed these changes, I went to test them out and I was getting weird errors that I did not expect. After looking through the logs a little more I realized that my DB connection was never established. I had originally written this asynchronously and I guess the GraphQL stuff had a large enough overhead for the connection to establish before I ever needed it. With the smaller endpoints though I needed to refactor the DB connection to be synchronous and I put it in a function that could be called by the function before any subsequent calls were made.
