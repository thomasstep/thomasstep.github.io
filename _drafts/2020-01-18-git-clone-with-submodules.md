---
layout: post
title:  "Title"
author: Thomas
tags: [ dev ]
description: TBD
---

If a git repo has submodules in it there are two options I use for cloning the repo and cloning the submodules in it. The first method is `git clone --recursive <url>`. The second method is to clone the repo and then clone the submodules: `git clone <url>` then `git submodule update --init`.