---
layout: post
title:  "Vim Keystrokes That Helped Me Transition From VS Code"
author: Thomas
tags: [ dev, meta ]
description: Vim keystrokes that I use daily
---

**NOTE**: If you want my list of commands and keystrokes, scroll down to the bottom. If you want to know more about my motivation behind switching to vim and compiling this list, read on.

I like VS Code. I have nothing against it and I still use it from time to time. My VS Code setup used to have a color scheme, keybindings, linters, different syntax highlighting, and the like. Most people probably end up with something similar after using it for a while. Then one day my computer decided it didn't want to start anymore. All of that was lost. I'm sure that there is a plugin that would have exported my settings and synced them across devices, but I didn't want to set that up. When I got my new computer I felt like I was starting from ground zero and that I didn't even know what software I needed to download first. I had wanted to give vim a try for a while. Since it has such a cult-like following, I figured there must be some redeeming qualities about it that I wanted to benefit from.

My move was less about dissatisfaction with VS Code and more about wanting to learn something new. I had the chance to not download VS Code and force myself into using vim, so I did just that. I started by reading a few guides, referencing a few cheatsheets, and searching for commands whenever I needed them. While I had done this in the past, the difference this time around was that I couldn't simply fall back on VS Code being there since I had never downloaded it. At the end of the day, the best way to learn is to throw yourself in the fire. I committed to only use vim and reference new keys as the need arose. Only using vim for a few days had me feeling pretty efficient with keystrokes and combinations.

Learning vim was similar to when I learned German; I lived in Germany so I had no other choice. Similarly, I lived in vim-land now so I had no other choice than learn the commands. Language learning communities like to bring up the X most used words or something similar to kickstart a journey to fluency and that's my motivation behind this list. I hope that by sharing my X most commonly used commands in vim, I can help kickstart someone else's journey into vim-land. In addition to looking over the commands, I suggest using them today. If you truly want to learn something new, putting knowledge to good use is just as important as that knowledge.

One final note I wanted to make about learning vim was windows and tabs. Windows and tabs made vim click for me as a reasonable alternative to a modern text editor. I realized that a majority of my time in VS Code was flipping through open tabs and leaving those tabs open to annoy myself later. Once I learned how I could view multiple files simultaneously in vim, I felt much more motivated to continue using it. In vim, there are two main ways to open multiple files being windows and tabs. Windows are tiled in the current screen and tabs are separated. I tend to open up to four windows in a tab before I start opening tabs. I also try to keep separate tabs open for different projects instead of cram too many windows on the same tab for different things. By keeping the number of windows to a max of four, I have found that I rarely need as many files open as I used to keep open in VS Code.

There are also a few commands I listed about buffers. Windows are an open buffer. After a window is closed with `:q` they only disappear from memory if that was the last open window. Vim will keep track of any file that is opened through buffers. This means that we can reopen a recently opened file in a vim session by looking at the open buffers `:ls` and reopening the desired buffer in the current window `:#b`.

I have had fun learning vim and I feel like I have completed a rite of passage of sorts by using it. If there are any particular components that you are interested in learning more about, feel free to drop me a line. Remember that this is just a starter list to vim commands. There are more intricate commands, but I omitted them for simplicity's sake. Have fun learning!

### movements:
- `h`, `j`, `k`, `l` for basic movement (you'll get the hang of what moves which direction real quick)
- `0` moves to beginning of line
- `^` moves to first character on line
- `$` moves to end of line
- `g_` moves to last character on the line
- `gg` moves to top of file
- `G` moves to bottom of file
- `:#` moves to line #
- `#G` moves to line #
- `*` moves to the next occurrence of a word
- `#` moves to the previous occurrence of a word
- `f + character` moves to the next occurrence of the character
- `F + character` moves to the previous occurrence of the character
- `;` move to the next occurrence of the character last searched for using `f + character`
- `,` move to the previous occurrence of the character last searched for using `f + character`
- `/<word>` move to the next occurrence of the string in place of `<word>`
- `n` move to the next occurrence of the string last searched for using `/<word>`
- `N` move to the previous occurrence of the string last searched for using `/<word>`

### commands:
- `d` deletes
- `dd` deletes line
- `x` cuts
- `y` copies
- `p` pastes after cursor
- `P` pastes before cursor
- `i` inserts
- `I` inserts at beginning of line
- `a` appends (insert after cursor)
- `A` appends at end of line
- `:%s/<search>/<replace>/gc` searches for the string in the place of `<search>` and replaces it with the string in the place of `<replace>`. This will search the entire file; exclude the `%` to only search and replace on the current line. This will ask for confirmation before replacing a word; exclude the final `c` to replace without confirmation.

### visual:
- `v` to start highlighting
- `v + movement` to highlight from current position to movement end
- `V` to highlight the current line
- `highlight + d` deletes
- `highlight + y` copies highlighted
- `highlight + p` pastes over what is highlighted
- `highlight + command` will usually work similarly to the last three mentioned combinations

### windows:
- `ctrl + w + basic movement` to change between windows where basic movement is `h`, `j`, `k`, or `l`
- `ctrl + w + n` to create a new horizontal window
- `ctrl + w + v` to create a new vertical window
- `:split` to duplicate the current window horizontally
- `:vsplit` to duplicate the current window vertically
- `ctrl + w + r` to rotate windows
- `:q` to close a window

### buffers:
- `:ls` to show all open buffers
- `:b#` to open buffer number # in the current window
- `:bd#` to close buffer number #
- `:#,#bd` to close all buffers between the two numbers given in the two #

### tabs:
- `:tabnew` to open a new tab
- `:tabn` to go to the next tab (to the right)
- `:tabp` to go to the previous tab
- close all windows in a tab to close the tab

### netrw (default file explorer):
- `Ex` to open file explorer
- `Vex` to open file explorer in another vertical window
- `-` to move up a directory
- `%` to create a new file
- `ctrl + l` to refresh
- `R` to rename a file
- `D` to delete a file

### favorite combos:
- `ci”` executes change on everything in the current “ (cursor must currently be inside of quotes)
  - you can do this with (, [, {, etc.
- `ca”` executes change on everything in and including the current “ (cursor must currently be inside of quotes)
  - you can do this with (, [, {, etc.
- `V#G` highlights all lines from the current line to line # where # is a number
- `vg_` highlights from current position to the last character in a line
- `YP` duplicates a line below itself
