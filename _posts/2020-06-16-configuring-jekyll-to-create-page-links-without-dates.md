---
layout: post
title:  "Configuring Jekyll To Create Page Links Without Dates"
author: Thomas
tags: [ web ]
description: Showing how to configure Jekyll to format paths in a cleaner way
---
I just got done with a refresh to my personal website and blog in an attempt to lighten up the UI.
My website is built using Jekyll and GitHub Pages, so changing up the format and configuration is pretty straightforward with all the themes out there.
The new theme that I am using is called [Minimal](https://github.com/pages-themes/minimal).
I liked the last theme but there was a lot going on that took away from the main information of the site in my opinion.
Not to mention all of the images that I used were large, high definition, and slowed the initial load time.
I have been wanting to switch to a simpler theme and finally took the time to switch over, which was not near as much of a time commitment as I thought it would be.
At the same time, there was something else that was bothering me with my site that I decided to look into and fix; the blog post links.
Jekyll works really well out of the box, and I honestly do not have many complaints against it.
That being said, some of the paths that Jekyll creates for files that come out of the `_posts/` folder are heavy.
For example, one of my old links used to look like this:

```
https://thomasstep.dev/dev/javascript/2019/10/28/splitting-javascript-classes-into-different-files.html
```

Like I said, heavy.
Since the theme of the day was lightening everything up, I found a way to reconfigure Jekyll to spit out a link that looks like this:

```
https://thomasstep.dev/blog/splitting-javascript-classes-into-different-files
```

The configuration change was simple as can be.
All I did was go into the `_config.yml` file in the root of my Jekyll project and add this chunk

```yml
collections:
  posts:
    output: true
    permalink: /blog/:title
```

After I rebuilt (or pushed to GitHub if you are using GitHub Pages), the static site's file structure updated.
This small change makes a huge difference, and I wish I would have looked into figuring it out sooner.
