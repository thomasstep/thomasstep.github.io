---
layout: post
title:  "Using Apollo Datasources Outside of Apollo"
author: Thomas
tags: [ javascript ]
image: https://thomasstep.s3.amazonaws.com/deceptionIsland.jpg
featured: false
hidden: false
comments: true
---
I have been using Apollo Server for a while now, and one of the tools that they offer is the [`RESTDataSource`](https://www.npmjs.com/package/apollo-datasource-rest) class, which I have used extensively.
There were a couple use cases I have run into where I needed to write one off scripts that interacted with the same data sources as my graphql server.
The most straightforward way I could think of doing this was to use the classes I had already created that extended `RESTDataSource`.
It seems simple enough, but there is one caveat that is worth noting before you can use a `RESTDataSource` outside of Apollo Server.
I will start off by using the example featured in the [npm page](https://www.npmjs.com/package/apollo-datasource-rest) and the [github readme](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-datasource-rest).

```javascript
const { RESTDataSource } = require('apollo-datasource-rest');

class MoviesAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://movies-api.example.com/';
  }

  async getMovie(id) {
    return this.get(`movies/${id}`);
  }

  async getMostViewedMovies(limit = 10) {
    const data = await this.get('movies', {
      per_page: limit,
      order_by: 'most_viewed',
    });
    return data.results;
  }
}
```

If you wanted to create an instance of this class to take advantage of what you have already written, you will need to initialize it first.
That would look like this:

```javascript
const movies = new MoviesAPI();
movies.initialize({});
movies.getMovie(1);
```

If you try calling a function that uses a REST method (`get`, `post`, etc.) before calling `initialize()` first, then you might see an error that looks like this.

```
UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'fetch' of undefined
```

The reason that the calls fail if the DataSource is not initialized is because there is never any HTTPCache created for the instance of `RESTDataSource`.
This is the source code for `initialize()`, and [it can also be seen on GitHub here](https://github.com/apollographql/apollo-server/blob/02f1fb6498206ac7d8fdd5b1de7e509d483be5bf/packages/apollo-datasource-rest/src/RESTDataSource.ts#L58).

```javascript
initialize(config: DataSourceConfig<TContext>): void {
  this.context = config.context;
  this.httpCache = new HTTPCache(config.cache, this.httpFetch);
}
```

The `RESTDataSource` `initialize()` call creates `this.HTTPCache` which in turn has a member function called `fetch`.
Whenever a REST method from the class is called, it calls `this.fetch()`, [which in turn calls `this.HTTPCache.fetch()`](https://github.com/apollographql/apollo-server/blob/02f1fb6498206ac7d8fdd5b1de7e509d483be5bf/packages/apollo-datasource-rest/src/RESTDataSource.ts#L257).
This is the cause for the error that you see if you try to call a function from a `RESTDataSource` without first initializing it.
I tried to give relevant links to their source code in GitHub, depending on when you read this though it might be better to go through the source yourself.
Either way, this was the problem I came across, the solution I found for using Apollo DataSource outside of an Apollo Server.
