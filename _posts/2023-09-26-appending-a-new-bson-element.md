---
layout: post
title:  "Appending A New BSON Element"
author: Thomas
tags: [ databases, dev, go ]
description: How to add a new element to a BSON.D type in Go
---

When I started building out my latest project, I decided that I wanted to use MongoDB as my database so I could learn another technology. Also [Rick Houlihan](https://twitter.com/houlihan_rick) works with Mongo now, which makes me think that there's something special going on over there. One of the first topics I had to become familiar with while learning MongoDB was BSON. It's similar to JSON but with some extra flavor. Also, I was writing my project in Go, so I was using the [Mongo driver](https://pkg.go.dev/go.mongodb.org/mongo-driver/bson). One thing I quickly stumbled across was needing to add an element to a `bson.D` (also applies to `bson.M`) type (I don't think this type/concept is in other languages like Javascript/Node), and I could not find much online about clean solutions to this. This type of scenario normally encourages me to write up a quick post to share my approach.

```go
filter := bson.D{
  {
    Key:   "mykey",
    Value: "someval",
  },
}

filter = append(
  filter,
  bson.E{
    Key: "time",
    Value: bson.D{{
      Key:   "$lt",
      Value: someTime,
    }},
  },
)
```

The gist is that you need to `append` the new `bson.E` element to the existing `bson.D`. The reasoning behind this is that the individual elements used in a `bson.D` initialization are converted to `bson.E` types anyway, so we need to create new elements with that same type before adding them in. The value of the appended element can be anything that can normally be passed to `bson.D` including a nested `bson.D` value.
