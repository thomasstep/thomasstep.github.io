---
layout: post
title:  "Using Google Maps and Search with React"
author: Thomas
tags: [ dev, front end, javascript ]
description: TBD
---

When I started remaking [Elsewhere](https://elsewhere.thomasstep.com/) I knew I wanted to refresh the map. The first version of Elsewhere used a third part React component that helped render Google Maps. It was fine but there were a few features missing and it was not actively developed. When I started thinking of other options, I was going to switch over to Mapbox. They seem to have a clean, first party React component ready. Fastforward to putting my hands on the keyboard ready to code, and I searched something that lead me to a [first party Google Maps React component](https://github.com/googlemaps/react-wrapper). This post will be about working with the `@googlemaps/react-wrapper` component, showing some code built around/with it, and hopefully giving others a good jumping off point for integrating Google Maps into their applications.

- google developers console to create an API key, your CC is attached to this so restrict it to certain domains!
- rendering a map
- rendering markers
- adding onclicks to markers
- adding styling to markers (advanced marker doesn't work well enough for what i want yet)
- adding search
  - load library in wrapper
  - then can use `places` API and can target an input ref
