---
layout: post
title:  "Embedding Structs in Go"
author: Thomas
tags: [ dev, go ]
description: Embeddeding and shadowing in golang.
---

Go does not completely incorporate object oriented programming (OOP) principles, only the ones that best behoove them, which is fine by me. Sometimes people take OOP too seriously and abstract code to the point that it's more cumbersome using abstractions than without. Just like anything else, while using patterns, especially ones grounded in OOP, moderation is key. I digress. One such OOP concept is composition which is implemented using "embedding" in Go. Most people familiar with OOP have heard about "composition over inheritance." Go encourages this with embedding. Inheritance is not supported by Go but composition is.

In Go, `interface`s and `struct`s can be embedded in one another to share functionality. Probably the most popular example of this is with the `io.Reader` and `io.Writer` interfaces, which are embedded in the same interface together to create `io.ReaderWriter`. To implement this, we simply need to list the embedded entity in the containing entity, and the embedded entity's definitions are merged into a union with the containing entity's other features.

```go
type ReadWriter interface {
    Reader
    Writer
}
```

For a slightly more in-depth explanation of the consequences of doing this, [here](https://go.dev/doc/effective_go#embedding) is an excerpt from a post on the official Go docs. I also enjoyed [this](https://eli.thegreenplace.net/2020/embedding-in-go-part-1-structs-in-structs/) explanation and set of examples.

I recently came across a situation in which I wanted to embed a struct but I wanted the containing struct to have a different value for a field that was shared by each of the structs. Go allows this type of behavior and calls it shadowing. The idea is that the containing struct's field will have precendence over the embedded one's, which would be more or less expected. I still have a Javascript brain of sort so I was relating it to the spread operator (`...`). The idea would be that I would spread an object into a containing object, then override a specific field after the spread.

```javascript
const embeddedObj = {
  targetField: 'someValue',
  otherField: 'asdf',
};

const containingObj = {
  ...embeddedObj,
  targetField: 'newValue',
};
```

The way to accomplish something similar in Go would look like the following.

```go
type Embedded struct {
	TargetField string
	OtherField  string
}

type Containing struct {
	Embedded
	TargetField string
}

func example() {
  embedded := Embedded{
    TargetField: "someValue",
    OtherField:  "asdf",
  }

  containing := Containing{
    Embedded:    embedded,
    TargetField: "newValue",
  }
}
```

From the example, the `containing` struct would then have the values `{TargetField: "newValue", OtherField: "asdf"}`. The `TargetField` was overridden and the `Embedded` struct's `OtherField` was still carried over. Of course this goes for functions as well, so more than just data containing structs can be composed.
