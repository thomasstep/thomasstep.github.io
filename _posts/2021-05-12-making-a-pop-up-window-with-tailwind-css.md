---
layout: post
title:  "Making a Pop-Up Window With Tailwind CSS"
author: Thomas
tags: [ dev, javascript, front end ]
description: Using TailwindCSS to create a pop-up window
---

Recently, I started working on a little project for myself that I'm calling [Green Things](https://green-things.thomasstep.com/), I wanted to base most of the design on a single page (at least to start). My idea was to have a list of plants, represented as cards, greet me when I pulled up the site, and whenever I clicked on a specific plant's card, I wanted a pop-up window to appear with more information about the plant. It seemed easy enough, but when I went to implement it, I had a little trouble wrapping my mind around some of the CSS concepts at play. In this post, I hope to explain how I accomplished creating a pop-up window and why it works the way it did.

My goal with this project is to use as little Javascript as possible in the website to make it quick and light. Another goal was to learn more CSS because, for some reason, I have avoided learning how webpage layout works for the most part by guess-and-checking positioning for my whole life. This was my chance to familiarize myself better with a most important piece of web development. To get straight to the point, the following are the Tailwind classes that I used to create my pop-up window. This code is also available with more context on the [GitHub repo where it lives](https://github.com/thomasstep/green-things/blob/main/components/plantCard.jsx).

```jsx
<div
  className={`overflow-auto \
              z-30 \
              h-5/6 \
              w-10/12 \
              mx-auto \
              top-20 \
              p-6 \
              border \
              rounded-xl \
              bg-white \
              text-left \
              fixed \
              ${visible ? 'visible' : 'invisible'}`}
>
```

I admit I did still use React state to help determine that last class, so I have some work if I want to completely get rid of my addiction to Javascript. I suggest either leaving the line with `visible` out, passing a `visible` prop, or keeping a `visible` state to make this work correctly. Either way, there are a few classes that I wanted to point out: `fixed`, `z-30`, `h-5/6`, `w-10/12`, `top-20`, `mx-auto`, and `overflow-auto`. Almost all of these classes were used to position and size the pop-up window itself correctly and responsively on the screen with `overflow-auto` relating more to the content itself.

The first weirdness that I had to overcome was `fixed`. I won't get into it too much, but I had started with a combination of `flex` and `absolute` before I came to `fixed`. I fiddled with positioning the `div` using `absolute` far too long before I jumped ship and started using `fixed`. By using `fixed` on the `div`, I was more or less telling the `div` to always maintain its position no matter where the user had scrolled on the window. This is what I had wanted from the start but somehow I was able to make `flex` and `absolute` somewhat work before I realized I should be using a different CSS `position` property entirely.

The `fixed` `div` takes precedence over anything else on the screen with the help of `z-30`. There are 3 axes on a webpage and `z` axis controls what elements stack above or below one another. All elements automatically start their existence with a `z` value of `0`, so by setting my pop-up window to a `z` value of `30`, I was able to make it pop above the other elements on the page.

To control the pop-up window's boundaries I used `h-5/6` and `w-10/12`, which define the height and width, respectively, according to the screen's size. I felt that these dimensions fit my content decently well and they also kept my page responsive. It's worth noting that the dimensions take up the majority of the page, so if a pop-up window is meant to be less obtrusive, these would probably need to scale down.

The next two classes helped position the `fixed` `div` correctly on the page. Setting `top-20` helped me keep the window from being pushed too low on the page (although that is probably more dependent on how I placed my HTML elements in the document). The `mx-auto` class was meant to keep the window centered on the horizontal axis; however, after playing around with it, I'm not too sure it's 100% necessary to achieve the layout I am going for.

Finally comes `overflow-auto`. When I started with my pop-up window I did not have much content to display, but after I added more text and new elements, I started noticing a problem with the way everything was displayed. On smaller screens, the content bled out of the pop-up window. The problem was easier to fix than I could have hoped for. Adding `overflow-auto` to the parent `div`, made its children conform to their parent's dimensions with the addition of a scrollbar to access the further down (and now hidden) content. That explanation might have been a little confusing, but once you play with this class it will become clear what I accomplished with it.

Even though I have only worked on this project for a few days, I feel like I have been introduced to the topics that I have left abstracted away from myself for so long. I am excited to see what else I learn in the future with Tailwind. Back to building!
