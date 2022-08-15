---
layout: post
title:  "My Experience Building a Front End Without a Framework"
author: Thomas
tags: [ dev, front end, javascript ]
description: Building a website with HTML, CSS, and vanilla Javascript
---

One of my more recent [projects](/projects) involved building a front end and from the start, I knew that I wanted to take this website in a slightly different way than I normally do. Instead of starting a Next.js project and deploying it using Vercel, I wanted to build a static site with plain HTML and vanilla Javascript. I had [read of others doing this](https://gomakethings.com/) and I wanted to take a crack at it for myself. The site is not complete yet but I have still learned some lessons and as I continue building it out I will edit this page to reflect what I have learned.

Overall the experience has not been nearly as difficult as I originally thought it would be. The first simple websites I built were before I knew how the web worked and they are bad. I did not know about [MDN docs](https://developer.mozilla.org/en-US/) or browser developer tools or many other things which slowed me down. In the back of my mind was that first experience that felt so painful. Since then all of my front-end projects have used React. Coming out the other end of building out most of the functionality that I wanted, I can say it is not near as difficult as I originally thought it would be.

One of the first things I ran across was importing Javascript files from another file. It is not like Node. First, you will need to import the parent Javascript file as a `module`, and then importing from a relative path includes accessing the file like a normal file served from a web server with the `.js` extension. Something so simple that I take for granted is much different when the runtime environment switches.

```html
<script type="module" src="js/myFile.js"></script>
```

Another difference between how I am used to coding Javascript in Node is that code does not all need to be in a function. I am so used to creating functions and then calling them elsewhere. Whenever I wanted to run a piece of code as the script was called, I wrote a function, and then after the definition, I invoked the function. That did not fly. Instead, I needed to use the function as the target for an event listener on `window.onload`. Again, it was the simple things that I overlooked. Event listeners very much became my friend though. When I stopped to think about it, it makes sense though because Javascript is meant to add interactivity to a web page. Adding interactivity means that the user _did_ something or caused an event.

Now to kick off the higher-level difficulties.

There is no global state to fall back on. At least not a ready-built, easy-to-use global state. Obviously, it can be built because so many frameworks have implemented it, but the basic web APIs do not offer something like that. Instead, there are local storage, cookies, and a few other storage methods. I mostly stayed with cookies for this application, but I can easily see how the other storage APIs could come in handy.

Speaking of cookies, getting and setting cookies threw me off when I first started using them. Both getting and setting are done using `document.cookie`. Getting was not difficult as the cookies are returned in a fairly easy-to-read format that just needs to be [split up and parsed out](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#example_2_get_a_sample_cookie_named_test2) for the correct value.

Setting cookies, however, is where I originally got confused. What I started off doing was checking if there were cookies returned in `document.cookie`, and if there were existing cookies, I correctly formatted the new cookie in the same way that they would be read and then set `document.cookie` to the new string. That did not work. After [reading through docs](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#write_a_new_cookie), I learned that `document.cookie` is an accessor property, which basically means you are not overriding the entire value and it has its own way of handling what is set. Cookies, no matter how many cookies are already set, are created or updated one at a time using notation that looks like it would override all cookies. Here is an example of what that might look like.

```javascript
console.log(document.cookie); // cookie1=this
document.cookie = 'cookie2=that';
console.log(document.cookie); // cookie1=this; cookie2=that
```

While reading through cookie documentation, I also learned that various attributes can be set on cookies. They control which pages have access to your cookies and which remote requests will be sent your cookies. Some secure defaults ensure your cookies are not sent to third parties, but this helps me understand how sites track your browsing and how targeted ads can get that information.

Speaking of remote requests, I want to discuss `fetch`. One of my main motivators for this little experiment was that I wanted to keep my list of dependencies down. Normally to make requests I would install `axios` because I like their API and am familiar with it. This time I decided to learn `fetch` which is a basic web API just like cookies would be. It turns out `fetch` is a very usable API, which seems to have been the theme for this entire experience. Sure the API is different than `axios`, but I did not come across anything that `fetch` could not do.

In conclusion, writing vanilla Javascript was much easier than I thought it would be. To sell products sometimes the creators of those products inject false complexity. I believe that was the case with large front-end frameworks. While I am sure they have their place, I had no problems creating a simple front end with tried-and-true basic web technologies.
