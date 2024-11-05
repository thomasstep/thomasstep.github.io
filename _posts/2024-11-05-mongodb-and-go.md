---
layout: post
title:  "MongoDB and Go"
author: Thomas
tags: [ databases, dev, go, ops ]
description: Crash course for using MongoDB with Golang
---

As much as I have written about and touted DynamoDB, I decided to test out MongoDB a while back in a project. I wanted to highlight some of what I learned in this post. MongoDB was easy to pick up and they have a pretty great developer experience. I was interfacing with Mongo using Golang, so all of the examples in this post will be using Go and the accompanying [`mongo-driver` package](https://pkg.go.dev/go.mongodb.org/mongo-driver). At the time of this writing, v1 was the latest version, but they are working on publishing a v2 which is currently in beta. While I will continue to use DynamoDB, I think MongoDB is a great alternative and something I would love to use again in the future.

One of the biggest things that I needed to learn to effectively use Mongo was [BSON](https://www.mongodb.com/resources/basics/json-and-bson). I like to think of BSON as JSON, just encoded differently. To the end user, BSON appears pretty much the same way that JSON does. The difference is that to the computer, BSON is stored differently. BSON also has some additional value [types](https://www.mongodb.com/docs/manual/reference/bson-types/) on top of what JSON has. These can be helpful, but I rarely used the more nuanced types. Most of my BSON contained normal strings and numbers.

Just like JSON, BSON also uses [struct tags](https://www.mongodb.com/docs/drivers/go/current/usage-examples/struct-tagging/). They are very similar to their JSON counterparts. Most of my structs had matching JSON and BSON tags.

```go
type Example struct {
  Id string `json:"id,omitempty" bson:"id,omitempty"`
}
```

One tricky bit of using BSON that you will quickly encounter is the [data types](https://www.mongodb.com/docs/drivers/go/current/fundamentals/bson/) (corresponding Go documentation [link](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.17.1/bson)). For super simple Mongo operations, you can probably get around using these, but whenever you start needing to build more complex queries, the BSON data types start to come into play. `D` is an ordered BSON document (think of a map/dictionary/object where the order of the keys matters). `M` is an unordered BSON document (think of a map/dictionary/object where the order of the keys doesn't matter, which is how most of us think of those data structures). `A` is an ordered BSON array. `E` is a single element inside of a `D` type. Types `D` and `E` were where I had the most difficulty. If you are building a `D` type, you can normally simply create it as an object without individually constructing the `E`s.

```go
bson.D{{"startTime", 1}, {"endTime", 1}, {"_id", 1}}
```

However, if you want to conditionally add onto a `D` type, then you need to specifically construct an `E`.

```go
filter := bson.D{{"startTime", 1}, {"endTime", 1}}

if conditionMet {
  filter = append(
    filter,
    bson.E{
      Key: "_id",
      Value: bson.D{{
        Key:   "$gt",
        Value: 2,
 }},
 },
 )
}
```

Notice how I needed to `append` a `bson.E`. This took me much longer than I care to admit to figure out, and I'm still doubting whether or not this is the correct way to handle this.

Creating `M` types is much easier.

```go
filter := bson.M{
  "location": bson.M{
    "$near": bson.M{
      "$geometry": bson.M{
        "type":        "Point",
        "coordinates": []float64{lng, lat},
 },
      "$maxDistance": radius,
 },
 },
}
```

Adding new elements to a `bson.M` type is the same as if it were a `map`.

```go
filter := bson.M{
  "location": bson.M{
    "$near": bson.M{
      "$geometry": bson.M{
        "type":        "Point",
        "coordinates": []float64{lng, lat},
 },
      "$maxDistance": radius,
 },
 },
}

filter["_id"] = bson.D{{
  Key:   "$gt",
  Value: oid,
}}
```

I did not use any `A` data types in my code for this project, but I would imagine that they behave similarly to a native Go array or slice.

Now that we have the complicated BSON payload construction out of the way, we can move up the chain of functionality to Mongo operations. As expected, normal [CRUD operations](https://www.mongodb.com/docs/manual/crud/) are supported. Creating is called `insert`, reading is called `find`, updating is called `update` or `replace`, and deleting is called `delete`. (Specific names for creation are `insertOne` and `insertMany` and for deletion are `deleteOne` and `deleteMany`.) These are accessed through the `Collection` type [defined in the package](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.17.1/mongo#Collection). The following snippet is not entirely complete, but connecting to the database with a resulting `Collection` type would look something like this.

```go
mongoUser := config.MongoUser
mongoPassword := config.MongoPassword
mongoHost := config.MongoHost
databaseName := config.DatabaseName
collectionName := config.CollectionName

ctx, cancel := context.WithTimeout(context.Background(), 3 * time.Second)
defer cancel()

serverAPI := options.ServerAPI(options.ServerAPIVersion1)
opts := options.Client().ApplyURI(fmt.Sprintf("mongodb+srv://%s:%s@%s/?retryWrites=true&w=majority", mongoUser, mongoPassword, mongoHost)).SetServerAPIOptions(serverAPI)
mongoClient, err := mongo.Connect(ctx, opts)

if err != nil {
  return
}

mongoCollection = mongoClient.Database(databaseName).Collection(collectionName)
```

Once you've gotten this far, you should have a connection to the database and collection and can read and write structs to Mongo via BSON. The CRUD operations are pretty forgiving when it comes to marshaling and unmarshalling BSON. You do not need to pass in BSON for an operation to correctly function. You can pass in BSON or your struct as long as your struct has the appropriate tags. The CRUD operations will marshall BSON for you. However, you will need to unmarshal BSON. Luckily, the Mongo driver has a pretty easy way to handle that. Whenever you issue a `find`/read operation ([for example `FindOne`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.17.1/mongo#Collection.FindOne)), the driver will return a `*SingleResult`. `SingleResult` has a [Decode] function which makes marshaling as easy as JSON in Go. Here is an example of what the entire flow might look like.

```go
import (
  "errors"
  "time"

  "go.mongodb.org/mongo-driver/bson/primitive"
  "go.mongodb.org/mongo-driver/mongo"
  "go.uber.org/zap"

  "github.com/thomasstep/home-gym-rental/gymSrc/internal/types"
)

type Gym struct {
  Id          primitive.ObjectID `json:"-" bson:"_id,omitempty"`
  Owner       string             `json:"owner,omitempty" bson:"owner,omitempty"`
  Name        string             `json:"name,omitempty" bson:"name,omitempty"`
  Address     string             `json:"address,omitempty" bson:"address,omitempty"`
  Description string             `json:"description,omitempty" bson:"description,omitempty"`
}

type GymOwnerFilter struct {
  Id    primitive.ObjectID `bson:"_id"`
  Owner string             `bson:"owner,omitempty"`
}

oid := primitive.NewObjectID()
newGym := Gym{
  Id: oid,
  Owner: "me",
  Name: "my gym",
  Address: "100 Rainbow St",
  Description: "a place to workout",
}

filter := GymOwnerFilter{
  Id:    oid,
  Owner: "me",
}

collection := GetMongoCollection() // This function returns our `mongo.Collection`

// First we insert the new gym; notice we are not manually marshaling to BSON
collection.InsertOne(context.TODO(), newGym)

// Then we read that gym back
res := collection.FindOne(context.TODO(), filter)

// The response is in BSON, so we need to unmarshal it back to our `Gym` type
var gym Gym
err = res.Decode(&gym)

// Do something with gym
```

Those are all the basics. There are other topics surrounding MongoDB that I might get into later, but for now, this seems like a good amount of scope for a "primer".
