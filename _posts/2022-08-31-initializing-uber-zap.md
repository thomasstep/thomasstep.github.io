---
layout: post
title:  "Initializing Uber Zap"
author: Thomas
tags: [ aws, dev, go, serverless ]
description: How to setup and use Uber Zap for logging
---

I spent some time over the past couple of weeks [porting an existing service over to Golang](https://github.com/thomasstep/authentication-service/pull/9). Previously I had used a structured logging library for Javascript and I knew that I wanted to do the same in Go. Figuring out how to initialize [Zap](https://github.com/uber-go/zap) was surprisingly not well documented online. Possibly because most Go developers would know how to do something like that already, but for someone learning Go and writing their first project with the language, I did not think it was trivial at the time.

In the same way, `main` is a special function in Go, there exists a special function for each package called `init`. The `init` function for a package is run before `main` and is meant for (unsurprisingly) initializing anything needed by the package before it is run. My approach to handling initializing values, in particular Uber Zap, was to use the `init` function in conjunction with package-level variables. Here is what that might look like.

```go
package main

import (
  "go.uber.org/zap"
)

var logger *zap.Logger

func init() {
  logger = zap.NewExample()
  defer logger.Sync()
}

func main() {
  logger.Info("Hello world")
}
```

Now anytime you want to log something, the `logger` reference exists package-wide.
