---
layout: post
title:  "Elsewhere Diary"
author: Thomas
tags: [ dev, javascript ]
---
Elsewhere is a side project that I started out of a problem I had while trying to plan an itinerary for a trip. Normally, I would use Google Maps and save pins, but the downside of doing that is that no one else can save pins to your list. Once I realized that, the idea of Elsewhere was born. My MVP was simple: create a way for multiple people to create a list of places they all wanted to go while on a trip. In this "diary", I will be discussing some of the technical challenges and different decisions I make while developing Elsewhere. I actually started this on 16 August 2020, so the older entries are an attempt to go back and fill in the details and decision making that I had at the time.

31 March 2020:

I am trying to decide on the tech stack that I want to use not only for code but also infrastructure. I have briefly worked with Docker and Kubernetes in the past and I want to learn it, so this might be the time that I can learn more about it. I am trying to find a cloud provider that will host a small cluster for free, but I can't seem to find one. I am going with MongoDB Atlas for my data layer since they offer a free DB. There were some weird things I needed to do to get a connection to the DB, but I think it is pretty steady now.

7 April 2020:

I found a platform called Zeit that will host a Next.js app for free. Next.js seems like exactly what I was looking for, a React front end and microservice API backend. I am going to use Apollo server for my GraphQL backend that will serve most of the data pertaining to the maps and markers that people create. The setup for Zeit was stupidly easy and with GitLab I already have a working CI/CD pipeline. This is a solid foundation.

12 April 2020:

I added Material UI and a Google map to my front end. I am not sure if I want to go with a map alternative like MapBox. Since I do not want to waste much time on this right now, I am going to just stick with Google maps since it is working and I will save the marker to my DB in a generic way. I have looked at the APIs for both maps libraries and it seems like I can place markers on both with only latitude and longitude, which makes sense. Maybe I will loop back around to this later on. The Material UI stuff was easy to set up and play with. I still need to figure out a theme. The design of everything will honestly be my most difficult problem. I am not a UI/UX designer. I admire the skill and I would like to be a little more familiar with how they think; however, right now I do not possess that skill. I am probably only going to mess with the theme colors and keep them dark and simple. I went through a stage with this blog where everything was just too busy and I would like to avoid that with Elsewhere if possible.

16 April 2020:

The Material UI component are getting put into place and Elsewhere is started to get some character. The data that I am using is still hardcoded, but at least I somewhat have a schema for my DB.

18 April 2020:

I can now get markers from the DB instead of using the hardcoded ones. I will be focusing pretty hard on the GraphQL API for the near future just so I can get actually functionality built out before I start messing too heavily with the UI. To test all of that out I will use Insomnia. My plan is to create all of the calls in Insomnia first and pass parameters in with variables. When I move to calling this functionality in the UI I can just copy and paste those same payloads just with programmatically entered variables.

27 April 2020:

I added in functionality to create and delete markers on a map.

29 April 2020:

My map stopped working. I'm pretty sure my newer GraphQL API changes caused this...I'm pretty sure it has something to do with the way that I am calling the API.

30 April 2020:

I was right. The way I was calling the API was wrong. I fixed the map error and now I am working on some other browser errors. I need to add some keys into the elements produced from a `.map` call. I would really like to the keep the browser errors to a minimum, but some of the InfoWindow stuff from the Google maps component I am using is causing me trouble. I had to find a work around to put custom HTML into the InfoWindow, and that work around sprung some errors. I think long term I would like to move away from using the built-in InfoWindow and move to my own solution, but until I am there this will have to do.

4 May 2020:

The API calls for adding and deleting markers are finally working from the UI. Deleting markers is a little clunky, but I think it just has to do with some heavy calls that the front end is making. I also started paying attention to the deployment on Zeit. The environment variables that I am relying on are not there yet, so I had to learn how to do that with their CLI. I am not extremely comfortable with the way that secrets and environment variables work with Zeit because I don't think there is a way to check what the value is of a previously added secret. I think you have to delete them and re-create them. I wish they had an easier way to see them through the UI. Either way, I got the appropriate values in there and got it working. I needed to rebuild the code after I put the new secrets and environment variables into Zeit. The logging solution in Zeit is also a little funky since they do not persist the logs. You have to actively sit on the logs page on their site in order to see the active logs going through.

13 May 2020:

It took me a while, but I finally added in some sort of authentication. I also finally got around to removing all of the routes that I still had in there from the "Learning Next.js" tutorial. I would like to try and stay on top of stuff like that, so there isn't too much junk floating around getting in the way. A simple TODO list is my kanban board. Maybe I'll move to Trello or something similar later on, but for now I'll just keep everything simple. The authentication that I added is from the Next.js GitHub repo. They have examples of applications that you can start from. I basically read through what they had as far as authentication goes and shoehorned it into my app. The front end will need work since it is still using HTML buttons and text fields. The back end seems pretty good all things considered. It is not easy to do authentication with GraphQL. I had to search far and wide to find an example. I am pretty sure adding a social login to a GraphQL API is virtually impossible. Maybe for social logins I will have to do it through another API route. I would like to only use social logins, so I am not responsible for having a "Forgot Password?" flow.

14 May 2020:

I started adding authentication to my GraphQL API as well now.
**************************************************************************************************

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
