---
layout: post
title:  "Make React Perform An Action Whenever The Enter Key Is Pressed"
author: Thomas
tags: [ dev, javascript ]
description: Perform an action on a keyboard event in React
---
A while ago I wanted to add functionality to a React page to do something when a user pressed enter on a Material UI `TextField`, and the solution I found involves capturing events. Of course, the events can be applied to other elements as well, but for my sake, I'll use a `TextField` in the code snippets. I already had a `Button` set up to take action, but I wanted the same behavior when the enter key was pressed, which is fairly common web app behavior.
```javascript
<Button
  variant="contained"
  onClick={(e) => doSomething(e)}
>
  This button does something
</Button>
```

The `doSomething` function was the desired shared behavior. Setting up the same thing for `TextField` was much easier than I thought it would be.
```javascript
<TextField
  onKeyDown={(e) => (
    e.keyCode === 13 ? doSomething(e) : null
  )}
/>
```

Now, I get the same behavior as clicking the `Button`. The `onKeyDown` event captures keyboard input and a `keyCode` of `13` means that the user pressed enter. There is more information about keycodes [on the MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) if anyone would like to know more. One thing worth mentioning is that this only works when the `TextField` is being focused on by the user. Granted, that was my desired outcome, but it's still something to be made aware of.