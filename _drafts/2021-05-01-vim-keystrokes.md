---
layout: post
title:  "Vim Keystrokes That Helped Me Transition From VS Code"
author: Thomas
tags: [ dev, meta ]
description: Vim keystrokes that I use daily
---

NOTE: If you want my list of commands and keystrokes, scroll down to the bottom. If you want to know more about my motivation behind switching to vim and compiling this list, read on.

I like VS Code. I have nothing against it and I still use it from time to time. My VS Code setup used to have a color scheme, keybindings, linters, different syntax highlighting, and the like. Most people probably end up with something similar after using it for a while. Then one day my computer decided it didn't want to start anymore. All of that was lost. I'm sure that there is a plugin would have exported my settings and synced them across devices, but I didn't want to set that up. When I got my new computer I felt like I was starting from ground zero and that I didn't even know what software I needed to download first. I had wanted to give vim a try for a while. Since it has such a cult-like following, I figured there must be some redeeming qualities about it that I wanted to benefit from.

My move was less about dissatisfaction with VS Code and more about wanting to learn something new.
Read a few guides, referenced a few cheatsheets
At the end of the day, the best way to learn is to throw yourself in the fire
I made a commitment to only use vim and reference new keys as the need arose

Learning vim was similar to when I learned German; I lived in Germany so I had no other choice
By making myself live in vim-land, I had no other choice than learn vim
Language learning communities like to bring up the X most used words or something similar to kickstart a journey to fluency and that's my motivation behind this list

Windows and tabs made vim click for me as a reasonable alternative to a modern text editor
I realized that a majority of my time in VS Code was flipping through open tabs and leaving those tabs open to annoy myself later
Once I learned how I could view multiple files simultaneously in vim, I felt much more motivated to continue using itter

movements:
`h`, `j`, `k`, `l` for basic movement (you'll get the hang of what moves where real quick)
`0` moves to beginning of line
`^` moves to first character on line
`$` moves to end of line
`g_` moves to last character on the line
`gg` moves to top of file
`G` moves to bottom of file
`:#` moves to line #
`#G` moves to line #
`*` moves to the next occurrence of a word
`#` moves to the previous occurrence of a word
`f + character` moves to the next occurrence of the character
`F + character` moves to the previous occurrence of the character
`;` move to the next occurrence of the character last searched for using `f + character`
`,` move to the previous occurrence of the character last searched for using `f + character`

commands:
`d` deletes
`dd` deletes line
`x` cuts
`y` copies
`p` pastes after cursor
`P` pastes before cursor
`i` inserts
`I` inserts at beginning of line
`a` appends (insert after cursor)
`A` appends at end of line

using visual/highlight:
`v` to start highlighting
`v + movement` to highlight from current position to movement end
`V` to highlight the current line
`highlight + d` deletes
`highlight + y` copies highlighted
`highlight + p` pastes over what is highlighted
`highlight + command` will usually work similarly to the last three mentioned combinations

windows:
`ctrl + w + basic movement` to change between windows where basic movement is `h`, `j`, `k`, or `l`
`ctrl + w + n` to create a new horizontal window
`ctrl + w + v` to create a new vertical window
`:split` to duplicate the current window horizontally
`:vsplit` to duplicate the current window vertically
`ctrl + w + r` to rotate windows
`:q` to close a window
`:ls` to show all open buffers
`:b#` to open buffer number # in the current window
`:bd#` to close buffer number #
`:#,#bd` to close all buffers between the two numbers given in the two #

tabs:
`:tabnew` to open a new tab
`:tabn` to go to the next tab (to the right)
`:tabp` to go to the previous tab
close all windows in a tab to close the tab

netrw:
`Ex` to open file explorer
`Vex` to open file explorer in another vertical window
`-` to move up a directory
`%` to create a new file
`ctrl + l` to refresh
`R` to rename a file
`D` to delete a file

favorite combos:
`ci”` executes change on everything in the current “ (cursor must currently be inside of quotes)
      you can do this with (, [, {, etc.
`ca”` executes change on everything in and including the current “ (cursor must currently be inside of quotes)
      you can do this with (, [, {, etc.
`V#G` highlights all lines from the current line to line # where # is a number
`vg_` highlights from current position to the last character in a line
`YP` duplicates a line below itself