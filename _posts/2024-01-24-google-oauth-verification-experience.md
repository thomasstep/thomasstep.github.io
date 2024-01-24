---
layout: post
title:  "Google OAuth Verification Experience"
author: Thomas
tags: [ dev, entrepreneurship, meta, startup ]
description: My journey through the process of verifying an OAuth application with Google
---

I wanted to take some time to document my Google OAuth consent screen verification process. There were a couple of times throughout the 3 months I worked on getting my OAuth application verified that I tried to look online for others' journeys and I found very few. None of the blogs that I found said that the process was quick and painless, and I would like to add my voice to that group. I still have the email chain which started on August 25th and ended on November 14. The process took me almost 3 full months to complete.

I want to say from the start that this is Google's product and I support them putting whatever restrictions in place that they want. All I am saying is that the process felt long and dragged out with unclear feedback in the emails. But gaining access to their product is obviously something worth the time investment. I think having a library of examples, completed assets, and/or screenshots of passing applications would have been very helpful compared to my needing to read through legal-sounding documents about branding and privacy policies.

The problems that I had varied and I wanted to list a few of them out so that anyone in a similar position to me can hopefully gain some insight into what they need to adjust in their application.

In the first feedback email, I had issues with my privacy policy, branding, and demo video. I needed to make my privacy policy more easily accessible and add the standard "Google Limited Use Disclosure" clause to my privacy policy. Easy enough. I also had inconsistent branding with my project because the project's name in the Google Cloud console was different from the application I was trying to authorize. I ended up changing the project's name in the Google Cloud console. Then came the validation of app functionality. Whenever I took my original demo video, my popup window was not large enough for the reviewers to see the full URL. They are specifically looking to see the client ID. I retook the video, and whenever the popup showed up, I spent time highlighting/scrolling through the full URL slowly. Finally, I sent my confirmation email that I had worked on the problems.

The second feedback email was a smaller list thankfully. I still had privacy policy issues because my privacy policy wasn't clearly located on my app's homepage (I forgot to scroll down in my demo video showing it). I took a screenshot of the added link in the app's footer to send back with my reply email. I was also flagged still for branding issues, but this time related to Google's own branding. The authorization button that users clicked on my app did not follow their guidelines. They did send me a screenshot this time and I used similar text as them on my button. My confirmation email went back out to them.

Six weeks later, my third feedback email came in. Still inconsistent branding. My app's name previously was "Google Calendar for [Saas Marketplace]" and I took the Google-related text out of the name (another feedback issue they had in the first email). Now they were claiming that the app's name was too generic. To be fair, the Saas Marketplace's name is very generic. So I came up with a different, more descriptive name. Also, they wanted me to add the Google Calendar icon to my authorization button. My confirmation email went back out.

Six more weeks and the fourth and final feedback email rolled in. I needed to add an app icon for the authorization consent screen that matched my branding elsewhere. Easy enough. My confirmation email was sent promptly.

Two short days later I received my email that my application was verified.

I had no idea that the process would involve so much branding scrutiny. The journey was lengthy but ultimately worth it. I know and understand why Google does this and at the end of the day they get the final say in who can use their product. They just want high-quality products associated with theirs. I hope anyone else going through this process and having similar problems gained some insight into what needs to be done to verify your application. The next time I do this, I imagine the whole process will be a lot smoother after this first experience.
