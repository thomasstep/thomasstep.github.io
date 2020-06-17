---
layout: post
title:  "Using Bunyan with Sequelize"
author: Thomas
tags: [ dev, javascript ]
---
While trying to use Bunyan logger with Sequelize ORM, I ran across [this issue on GitHub](https://github.com/trentm/node-bunyan/issues/350) that I tried to use to solve my problem.
It worked and the error that I was getting before was not there anymore; however, it was giving me extra information that I did not necessarily want.
The information it gave me was about attributes and other options in Sequelize.
I did not want to see that everytime something was logged in Sequelize though.
After some more digging, I learned that the `logging` option in Sequelize just takes a function that it passes a message into to be logged.
I did a quick and dirty fix to this by creating a function with a message parameter and logging it with Bunyan.
It looks like this:
```

const logger = (msg) => {
  log.info(msg);
};
...
  logging: logger
...

```
The `logging: logger` part goes into your options object that's passed in during connection.
I had not seen this solution anywhere, so I commented on the issue thread and thought I would share here as well.
