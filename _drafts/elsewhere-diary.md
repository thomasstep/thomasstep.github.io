---
layout: post
title:  "Elsewhere Diary"
author: Thomas
tags: [ dev, javascript ]
---
Elsewhere is a side project that I started while trying to plan an itinerary for a trip. Normally, I would use Google Maps and save pins, but the downside of doing that is that no one else can save pins to your list. Once I realized that the idea of Elsewhere was born. My MVP was simple: create a way for multiple people to create a list of places they all wanted to go while on a trip. In this "diary", I will be discussing some of the technical challenges and different decisions I make while developing Elsewhere.

31 March 2020:

I am trying to decide on the tech stack that I want to use not only for code but also for infrastructure. I have briefly worked with Docker and Kubernetes in the past and I want to learn it, so this might be the time that I can learn more about it. I am trying to find a cloud provider that will host a small cluster for free, but I can't seem to find one. I am going with MongoDB Atlas for my data layer since they offer a free DB. There were some weird things I needed to do to get a connection to the DB, but I think it is pretty steady now.

7 April 2020:

I found a platform called Zeit that will host a Next.js app for free. Next.js seems like exactly what I was looking for, a React front end and microservice API backend. I am going to use Apollo server for my GraphQL backend that will serve most of the data about the maps and markers that people create. The setup for Zeit was stupidly easy and with GitLab I already have a working CI/CD pipeline. This is a solid foundation.

12 April 2020:

I added Material UI and a Google map to my front end. I am not sure if I want to go with a map alternative like MapBox. Since I do not want to waste much time on this right now, I am going to just stick with Google maps since it is working and I will save the marker to my DB in a generic way. I have looked at the APIs for both maps libraries and it seems like I can place markers on both with only latitude and longitude, which makes sense. Maybe I will loop back around to this later on. The Material UI stuff was easy to set up and play with. I still need to figure out a theme. The design of everything will honestly be my most difficult problem. I am not a UI/UX designer. I admire the skill and I would like to be a little more familiar with how they think; however, right now I do not possess that skill. I am probably only going to mess with the theme colors and keep them dark and simple. I went through a stage with this blog where everything was just too busy and I would like to avoid that with Elsewhere if possible.

16 April 2020:

The Material UI components are getting put into place and Elsewhere is started to get some character. The data that I am using is still hardcoded, but at least I somewhat have a schema for my DB.

18 April 2020:

I can now get markers from the DB instead of using the hardcoded ones. I will be focusing pretty hard on the GraphQL API for the near future just so I can get actual functionality built out before I start messing too heavily with the UI. To test all of that out I will use Insomnia. I plan to create all of the calls in Insomnia first and pass parameters in with variables. When I call the endpoints in the UI I can just copy and paste those same payloads just with programmatically entered variables.

27 April 2020:

I added functionality to create and delete markers on a map.

29 April 2020:

My map stopped working. I'm pretty sure my newer GraphQL API changes caused this...I'm pretty sure it has something to do with the way that I am calling the API.

30 April 2020:

I was right. The way I was calling the API was wrong. I fixed the map error and now I am working on some other browser errors. I need to add some keys into the elements produced from a `.map` call. I would like to keep the browser errors to a minimum, but some of the InfoWindow stuff from the Google maps component I am using is causing me trouble. I had to find a workaround to put custom HTML into the InfoWindow, and that work around sprung some errors. I think long term I would like to move away from using the built-in InfoWindow and move to my own solution, but until I am there this will have to do.

4 May 2020:

The API calls for adding and deleting markers are finally working from the UI. Deleting markers is a little clunky, but I think it just has to do with some heavy calls that the front end is making. I also started paying attention to the deployment on Zeit. The environment variables that I am relying on are not there yet, so I had to learn how to do that with their CLI. I am not extremely comfortable with the way that secrets and environment variables work with Zeit because I don't think there is a way to check what the value is of a previously added secret. I think you have to delete them and re-create them. I wish they had an easier way to see them through the UI. Either way, I got the appropriate values in there and got it working. I needed to rebuild the code after I put the new secrets and environment variables into Zeit. The logging solution in Zeit is also a little funky since they do not persist the logs. You have to actively sit on the logs page on their site to see the active logs going through.

13 May 2020:

It took me a while, but I finally added some sort of authentication. I also finally got around to removing all of the routes that I still had in there from the "Learning Next.js" tutorial. I would like to try and stay on top of stuff like that, so there isn't too much junk floating around getting in the way. A simple TODO list is my kanban board. Maybe I'll move to Trello or something similar later on, but for now, I'll just keep everything simple. The authentication that I added is from the Next.js GitHub repo. They have examples of applications that you can start from. I read through what they had as far as authentication goes and shoehorned it into my app. The front end will need work since it is still using HTML buttons and text fields. The back end seems pretty good all things considered. It is not easy to do authentication with GraphQL. I had to search far and wide to find an example. I am pretty sure adding a social sign-in to a GraphQL API is virtually impossible. Maybe for social logins I will have to do it through another API route. I would like to only use social logins so I am not responsible for having a "Forgot Password?" flow.

14 May 2020:

[I started adding authentication to my GraphQL API as well now](https://thomasstep.dev/blog/creating-an-authorization-plugin-for-apollo-server). I want to be able to potentially offer the API as a service later on down the road so that users can access their data. More importantly, I wanted to implement something that was more security-related and have the peace of mind that only authorized users can access their own data.

2 June 2020:

I finally got back to working on Elsewhere. I added a profile page that brings up your maps and gives links to those maps and their settings pages. The styling is quite atrocious.

4 June 2020:

Added the ability to add a map from the API and UI. Again, the styling is quite atrocious.

7 June 2020:

Trying to do some styling and theming, but I am not a designer. I have been in a front end/UI developer role before and I had no problem writing the code to match up with an image or styling that was given to me through one of those UI designer tools. Coming up with that image to reference is the hard part. I brought this up with someone and said that I was interested in learning the thought processes behind it all. She told me that this kind of work is a completely different discipline and way of thinking. I agree. I would like to start unlocking that side of my brain, but my focus is wholely on programming out the functionality of Elsewhere for the moment.

14 June 2020:

Using MongoDB's `_id` field as an identifier seems to be an easy way of referring to an object in a DB, but I am not completely sure how secure it is to open that kind of information up to end-users. I have implemented my functionality using `_id` and a UUID that I generate whenever an object is created. For my paranoid mind, I am just going to go with the UUID since I know it is completely random, and not much information can be taken out of a random number. I did see some old StackOverflow questions about exposing the MongoDB Document ID (`_id`) and it seems like it might be generated using a hardware ID and some other potentially revealing information. Better safe than sorry and this is a good point to jump into using UUIDs to keep everything consistent across the board.

15 June 2020:

I can now delete maps in the API. I can definitely get the back end functionality built out way quicker than the front end.

25 June 2020:

I can now update maps from the API. Right now the only real updates that can happen are the name, but I am going to add in updates to the collaborators soon too.

1 July 2020:

Updating the users allowed to collaborate on your map is now available. I can also revoke permissions.

5 July 2020:

I added all of the map updating functionality to the UI through a map settings page. Being a back end developer in my full-time position has helped me speed this whole process along. Starting with the back end functionality, making sure that the API is solid, and then moving up to the UI has been the easiest workflow for me so far.

9 July 2020:

I made a decision early on to go with class-based React components because that is how I used React before. I thought it was weird seeing functional components in the Next.js tutorials. Now I regret using class-based components, and I just refactored everything over to be functional. The refactor was a ton easier than I thought it would be, which was reassuring.

10 July 2020:

I recently saw a tweet from Guillermo Rauch about a library called `next-auth`. It looks like this will solve my problems of getting social logins working easily. I am currently in the middle of configuring my DB and getting Google OAuth ready.

13 July 2020:

Google OAuth is now ready for signing in. I went ahead and got rid of the homebrewed logins that I was doing before. I added redirects from pages if the user is not signed in. I am not too worried about this causing any issues though since I have the authorization in front of the GraphQL API. If someone somehow finds someone else's map by ID, then they will still not be able to the markers even if they get around the redirect. If someone goes to the profile page, then they will only ever see their information since that information is populated on a session basis.

21 July 2020:

Added a search bar and button to the maps so that users can search for a specific place. The call uses the Google Places API and even pulls the users currently looked at location on the map for more context in the search. The back end functionality took me longer than I expected it too. I am using a library from Google, but it does not seem to be the most helpful. I ended up still formatting query strings like I would have if I just went through their API without a library...seems strange to me. Some chaos went on in the front end with all of this because the markers were not set up to handle this from the get-go. I resolved all of those problems though and I am excited to have gotten this feature in. I honestly thought it would take me over a year to even get this far.

22 July 2020:

I was getting some wild errors when people were trying to authenticate with Google. Turns out there was a rogue index on my DB for a key that I was not using. Since the values were always `null`, it threw errors whenever a second document was added. I went in and removed the index and everything is working as intended now.

30 July 2020:

I gave Elsewhere a facelift with new colors and better spacing. Maybe someday I will hire someone to do a full design of Elsewhere, but for now, I will do what I can. I have read through some of the [design systems](https://designsystemsrepo.com/design-systems-recent/) like [Material by Google](https://material.io/) and [Protocol by Mozilla](https://protocol.mozilla.org/). Material seems to be the most popular to me and since I am using the Material UI library it makes sense to stick to their design principles. Still, I can't seem to fully grasp and create a good style and theme.

5 August 2020:

I changed the behavior of how creating a marker works. The flow seems a little more forgiving now. Instead of saving a marker on every click on the map, I am asking first if the user wants to save the marker. If the user clicks off of the info drawer that pops up, then the marker will be taken off of the map. This also follows the same create/save flow for a place that the user has searched. Keeping it simple and as least complex as I can has made the code cleaner too.

13 August 2020:

Users can now edit the name of a marker similar to the edit function on the map. I will be expanding this over time, but for now, being able to edit the marker name will fit my MVP. This is actually the MVP for me. This is what I set out to do. I wanted to be able to collaboratively create a list of places that my friends and I wanted to go to on a trip. I am surprised that I got as much done as I did in this timeframe. I thought that it would take me at least a year to get to this point. There are still areas of the app that I would like to improve on, but overall, this is what I set out to do. Now I want to offer this service to others to see if they also find value in it. Some future improvements that I would like to make are a time-based approach to organizing markers (think of an agenda), being able to share maps with a special link, categorizing markers, and giving recommendations on where to go based on other users' maps (this will take numerous users and created maps).

16 August 2020:

I am moving away from using only social logins. I posted a link to Elsewhere on Reddit, and the feedback I got was that the person did not want to sign-in using a social sign-in. People want options and don't want to feel tied down to their accounts, so I understand. I decided on using [Passport.js](http://www.passportjs.org/). I was not having a problem with the homemade method I was using for local credentials before, but I also wanted to take this chance to consolidate the different authentication methods I was using, which means I want to get rid of next-auth. I am not having any problems with next-auth, but I want to keep things simple. There is also a huge community behind passport, which is worth a lot I have realized. Local authentication with passport is complete. It was decently easy to get this portion up and running since the passport strategy is straightforward. I just copy and pasted the DB commands that I was using with my homegrown method of authentication over to the `authenticate` function that would be called by passport.

17 August 2020:

Migrating from next-auth to passport for Google OAuth was more difficult than the local strategy. Since I am using Next.js, there was the first difficulty of having to initialize passport in two different files/routes (`/api/google/signin` and `/api/google/callback`). After I realized that I needed to just duplicate the code, came the problem of actually calling the code. For some reason, I just could not understand how to kick off the passport strategy from the front end which redirects to Google's sign-in page. Now I realize all you need to do is call API route. There was a little trip up with how to call it though. I started by calling `/api/google/signin` using fetch, but I was getting CORS errors. At first, I thought those CORS errors were from my stuff, but it turns out they were actually from Google. After some digging and reading, I discovered that you need to kick off the passport OAuth strategies (not only Google OAuth) from an `href` in a button instead of another HTTP client like `fetch` or `axios`. Once I changed that over everything started firing on all cylinders. I pretty much took a copy of the DB calls I made in the local strategy and made them work with the Google OAuth flow. The last sort of weird thing that I figured out was the lack of redirect support from the API routes in Next.js. [It even says in their documentation that there is a response helper called `redirect`](https://nextjs.org/docs/api-routes/response-helpers). I could not get it to work and kept getting errors about the function not existing. The solution that I found instead was from the [Node HTTP ServerResponse documentation](https://nodejs.org/api/http.html#http_response_writehead_statuscode_statusmessage_headers) which has a method called `writeHead`. This code redirects the user from an API route in Next.js
```javascript
res.writeHead(302, {
  Location: `your.redirect/here`,
});
res.end();
```
After I deployed these changes, I went to test them out and I was getting weird errors that I did not expect. After looking through the logs a little more I realized that my DB connection was never established. I had originally written this asynchronously and I guess the GraphQL stuff had a large enough overhead for the connection to establish before I ever needed it. With the smaller endpoints though I needed to refactor the DB connection to be synchronous and I put it in a function that could be called by the function before any subsequent calls were made.

19 August 2020:

I broke my database today. I had some bad logic that created a connection for every invocation of my Next.js API routes, which swamped my DB with open connections. I eventually DOS'ed myself. After waiting a few minutes the connections started closing themselves, but this was a new one for me. I reverted my logic to what it was before I was having this problem (pre social logins) and altered a few things to make sure that I was not reconnecting if a connection already existed. There is [an example in the Next.js repo](https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose). This is effectively what I was doing before, warning to past me: be careful how you connect to your DB and make sure that you reuse that connection. The reason I got myself into this situation was that the social logins are in their own API routes, and my DB was not connecting quickly enough to service the calls before they were made. I know that Mongoose is supposed to buffer calls if a connection has not yet been made, but that is not the behavior that I was seeing. Also, I altered the way that my GraphQL server connected to the DB, which was probably the single biggest culprit. I was asynchronously connecting to the DB while building context and I didn't check if I already had an active connection. My profile page that I was testing with at the time was creating about 10 connections per refresh...whoops.

20 August 2020:

I am going to try to focus on smaller things that I have wanted to get around to but have not. Today I made sure that the sign-in/out option in the navbar matches the state of a user being signed in or out. It doesn't matter a ton, but the little things do get noticed. I am sure that if I notice something someone else will. I also want to circle back around to theming and styling. An attractive landing page would be a nice addition as well as a theme that brings coherency to the rest of the pages. Of course, it is easier said than done.

23 August 2020:

Figuring out a theme and styling is difficult. I have searched for blogs to showcase websites with good designs in hopes of inspiration:

- https://www.awwwards.com/websites/
- https://www.wix.com/blog/2019/05/best-landing-page-examples/
- https://coolors.co/
- https://colorsinspo.com/
- https://designsystemsrepo.com/design-systems-recent/

In response, I am lightening up with primary color, and changing around some of the accent colors as well. I changed the text color to gray instead of just a stark black. The edges of buttons, text fields, etc. are now square instead of slightly rounded. I also started working on sending out an email notification whenever someone adds you to a map. I got it working locally with `nodemailer`, but apparently, there are known issues with `nodemailer` working in a deployment. Google does not want users' email addresses to be exploited so they put a lot of checks in front of an email being sent including checking the geographic location of where the email is being sent from. My next thought is to look into [Twilio](https://www.twilio.com/). They own [SendGrid](https://sendgrid.com/), which is an email service behind an API. My thought is that I can just send the email through their service since I know it will be able to handle it no matter where the API is called from geographically.
