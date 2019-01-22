---
layout: post
title:  "Updating My Personal Website"
author: thomas
categories: [ programming ]
image: assets/images/aggieRing.jpg
featured: false
hidden: true
comments: true
---
Before this update to my website I had written a few static HTML pages that weren't too impressive especially considering the other options out there.
I have recently started an internship with Viasat in College Station where I am working with React + Redux and Nodejs.
My project at work inspired me to update my own webpage.
At first I thought about deploying a React app to Github Pages.
This is definitely an option that I am still considering mostly so I can gain more experience with React.
For now, I am using Jekyll to build the static HTML pages for this website.
I will keep the site updated with any new things that I do it.
I used the [GitHub Student Pack](https://education.github.com/pack) to get a free .me domain name from Namecheap.
I already had my GitHub repo set up for this page before I started.
Namecheap takes you through a pretty simple setup process.
An extra step that I originally overlooked was adding DNS records.
You have to add 4 new "A Record"s to Namecheap's DNS settings the host is "@" and the IPs are 182.199.108.153, 182.199.109.153, 182.199.110.153, 182.199.111.153.
I think what this is doing is telling DNS servers that you are hosting your site on GitHub and those IPs all belong to them, but I'm not 100% sure about that.
Namecheap has a guide about it [here](https://www.namecheap.com/support/knowledgebase/article.aspx?type=article&contentid=9645&categoryid=2208&rating=5).
I am also using a different Jekyll theme called [Prologue](https://github.com/chrisbobbe/jekyll-theme-prologue).
There are numerous resources I used to get this going.
It took me about 20 minutes from the time I started looking at different themes until my site was actually deployed with the correct theme.
You'll notice in my config.yml that I have a theme and a remote_theme.
I did this because I had issues when trying to run Jekyll locally without theme.
I didn't try deploying my site without theme and just remote_theme, but I would have the same development issues locally if I took theme out.
I am curious to see how this theme starts looking as I include more posts and tweak it.
