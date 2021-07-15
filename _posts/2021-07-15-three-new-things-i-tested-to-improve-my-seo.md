---
layout: post
title:  "Three New Things I Tested To Improve My SEO"
author: Thomas
tags: [ meta ]
description: How my organic traffic boosts were correlated to specific actions
---

I'm writing this post with a little hesitancy. The title might read like generic clickbait, but I hope to inject some originality into this subject. What you probably clicked on to read about is further on down past my rant. Feel free to skip ahead.

When I first started hearing about SEO I imagined it as a large abstract construct. The quick and dirty explanation that I go back to for myself is that SEO is simply the process of ranking higher on search engines. That's it. There are tons of hacky methods and instructors out there that pawn off regurgitated content as new courses that will "help buyers and bloggers make more money." That's not what I'm trying to do here. I remember reading through posts about finding keywords to write about, investigating a niche with [ahrefs](https://ahrefs.com/), and writing consistently. After reading these "tricks" for the Nth time, I stopped clicking on SEO articles. I prefer to simply write about what I want and what I wish was out there when I was looking for guidance or to solve a problem.

In my opinion, there is way too much recycled content out there "written" by people who claim to have subject knowledge, but who have never practiced or seen success with their methods. I'll argue that they just want a few quick clicks and use them to get a few easy pennies. [Swyx](https://twitter.com/swyx) wrote about this class of authors as [meta-creators](https://www.swyx.io/meta-creator-ceiling/).

All that just to say, that I hope these tips are new and original to you. There have only been three jumps in my traffic history so far and each one corresponds to a different tip. I saw more success with my traffic and rankings after I completed these, so maybe they can help you too. But who knows 🤷‍♂️, I'm no SEO expert.

### Use Canonical URLs

When I first started to cross-post to [DEV.to](https://dev.to/thomasstep) I did not realize that they offered canonical URLs. I'm pretty sure I didn't even know what they were at the time. Instead, I used to manually add in my page's URL as a backlink to try and drive traffic to me, but that did not do near as much as a `link` tag for a canonical URL. I know that adding canonical URLs to my DEV.to posts worked because my article views there stopped increasing as rapidly, and I saw more organic traffic being driven to me about a week after I added them to my existing posts. I guess that it just took a few days for Google to realize where my original content was posted before it started ranking me above the DEV.to versions of my articles. Most publishers (like DEV.to and Medium) have a setting for an article's canonical URL. However, if you have access to the cross-posted article's HTML you can add the following in the `<head>` instead.

```html
<link rel="canonical" href="https://your.site/original-article">
```

### Changed To A `.com` Domain Name

I have heard that Google does not care about the TLD, which is why I initially used a `.dev` TLD. I switched TLDs for a different reason, but whenever I did switch, I started getting a noticeable jump in organic traffic. Since Google themselves say that it doesn't affect rankings, I am left to take a shot in the dark for why this worked. I guess that my traffic was less affected by Google and more affected by people. My thought is that people trust a `.com` TLD more than a `.dev` one, which causes them to click on it before other options. While Google might not care about TLD, they do care about clicks, which results in a higher ranking. People and their behaviors also play a part in SEO.

### Leave Breadcrumbs Every Where You Go

Another significant boost to my organic traffic came after I reorganized my site's pages. What is now my `/blog` page used to be my homepage. I reorganized it to become my `/blog` page and then I created my home page (`/`) based on my old `/about` page. Again, I did this not for SEO, but my own reasons. However, after I did it, I received my latest surge in organic traffic. My only guess as to why this worked was because Google could now follow breadcrumbs to all of my pages within each other. All of my blog posts are under URLs like `/blog/this-is-a-blog-post`. My thought is that Google wants breadcrumbs to each path and since I did not have a `/blog` page before, there was a gap between my home page and my blog posts.

I hope that helps and I hope someone can benefit from my observations. It definitely helped me. Feel free to reach out if you have any other questions!
