---
layout: post
title:  "Apollo Server Data Sources"
author: Thomas
tags: [ dev, javascript ]
---
[Apollo Server](https://www.apollographql.com/docs/apollo-server/) is a GraphQL server framework written in Javascript. I have had a good experience using it so far, and one feature that I have been using a lot is Data Source. According to [Apollo Server's documentation](https://www.apollographql.com/docs/apollo-server/data/data-sources/)

>Data sources are classes that encapsulate fetching data from a particular service, with built-in support for caching, deduplication, and error handling. You write the code that is specific to interacting with your backend, and Apollo Server takes care of the rest.

In my opinion, the `RESTDataSource` package that Apollo Server maintains is an excellent tool for wrapping an existing REST API to make it a GraphQL API. Transitioning completely from REST to GraphQL might seem daunting but not with Data Sources. This package specifically lets you extend a base class called `RESTDataSource` that features methods to make your transition easy.

The only part that is necessary to make the base class properly operate is by adding your REST API's base URL in the constructor.
```javascript
const { RESTDataSource } = require('apollo-datasource-rest');

class YourAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://<your-api>.com/';
  }
}

module.exports = YourAPI;
```

After this is done you can create as many class functions as you want to wrap your REST API's calls. All of the normal HTTP methods have corresponding `this` function calls (e.g. `this.post`). Of course, you can add in extra information to the calls like headers and payloads. In my opinion, a good way to organize your classes is to have a base class that extends the `RESTDataSource` class and object classes that extend off of your API's base class. Then corresponding calls that manipulate certain types of objects in your REST API can stay together in one class. The API's base class would have the commonly necessary parts in it like creating the payload, making calls, and error handling. The classes that you create would then need to be initialized, added to your Apollo Server, and the corresponding methods used in your resolvers.

```javascript
const YourAPI = require('./datasources/yourAPI');

const dataSources = () => ({
  yourAPI: new YourAPI(),
});

const resolvers = {
  Query: {
    gqlQueryForSomething: (_, _, { dataSources }) => dataSources.yourAPI.correspondingFunction(),
  },
};

const server = new ApolloServer({
  schema,
  resolvers,
  dataSources,
  context,
});
```

Now whenever someone makes a query to your GraphQL API with `gqlQueryForSomething`, you can just return whatever your REST API normally returns just wrapped by GraphQL. Of course, that code snippet above does not cover all that you need to get an Apollo Server running. You need certain packages and a schema, but that can all be found on their website and documentation. I was more focused on Data Sources and how to use them to wrap a REST API. After this is done, you can start adding in the actual logic that your REST API uses until you are fully away from a REST API (if that's what is desired).
