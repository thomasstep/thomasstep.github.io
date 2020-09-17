---
layout: post
title:  "Creating an Authorization Plugin for Apollo Server"
author: Thomas
tags: [ dev, javascript ]
description: How to create an a plugin for Apollo Server
---
While working on my side project I came across a use case for needing authorization in place for all of my various GraphQL queries and mutations. For the sake of this post, I will use an example of a library where certain users are allowed to create, read, and update books (I might not get that far into it, but we will see what happens). As a library of high esteem, we do not want to let just anyone be able to operate on the books. This will pretty much just be an extension of the first example given on [Apollo Server's website](https://www.apollographql.com/docs/apollo-server/getting-started/). [I do have working code that you are welcome to reference while you read through the article](https://github.com/thomasstep/apolloEndpointAuth).

I had learned about [plugins for Apollo](https://www.apollographql.com/docs/apollo-server/integrations/plugins/) a little while back and I had minor exposure to creating them. They are pretty nifty now that I have used them a little more extensively. The whole idea is that you can [trigger certain logic based on events](https://github.com/apollographql/apollo-server/blob/main/docs/source/integrations/plugins.md). The only catch for me was how you filter down to a particular event. Apollo has a [flow chart that on their website](https://www.apollographql.com/docs/apollo-server/integrations/plugins/#request-lifecycle-event-flow) that can help you figure out exactly how the events get fired off. You'll notice in that flow chart that `requestDidStart` is boxed in pink as opposed to the purple of the other events. That's because `requestDidStart` is special. Every plugin must first return `requestDidStart` and then return whatever event underneath `requestDidStart` that it wants to be triggered by. It's weird and it took me a minute to wrap my head around. I'm going to go ahead and dive into some code but come back here after you read the code to make sure you understand what's going on.

```javascript
function authPlugin() {
  return {
    requestDidStart(requestContext) {
      const {
        context: apolloContext,
        request: {
          variables: requestVariables,
        },
      } = requestContext;

      return {
        didResolveOperation(resolutionContext) {
          const { user } = apolloContext;

          resolutionContext.operation.selectionSet.selections.forEach((selection) => {
            const { value: operationName } = selection.name;
            console.log(user);
            console.log(operationName);
          });
        },
      };
    },
  };
}
```

This is the beginning of my auth plugin. Like I said before this returns `requestDidStart` and `requestDidStart` returns the other event(s) that I want to act on, which is only `didResolveOperation` for this plugin. Within `requestDidStart`, you have the opportunity to pull out some special information from the caller. You can grab the context created when you created the server and you can grab the variables sent with the request. I'll go ahead and show you how I am initializing the server, so you can just copy and paste if you want to follow along.

```javascript
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: (ctx) => {
    ctx.user = 'J. R. R. Tolkien';
    return ctx;
  },
  plugins: [
    authPlugin,
  ],
});

apolloServer.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

You can create a list of plugins so feel free to break them up as you see fit.

If you have been following along so far and you have started based on the Apollo tutorial I linked at the beginning, then you should be able to query your server and see the logs for the context's user as `J. R. R. Tolkien` and the `operationName` as `books`. Now that we have a plugin set up that can be triggered off of whatever gets passed in, let's start adding in some authorization logic. To keep the post centered around plugins and the authorization logic, I am going to move forward with the same `book` query and just hardcode different `context.user`s in order to test. In addition, I will use a query called `parrot` that returns the string that you pass in as a parameter called `word` to show some additional information that you can pull out of the plugins. The resolver code for that looks like `parrot: (parent, args) => args.word`, just paste that into the `resolvers.Query` object that is given in the Apollo tutorial and add `parrot(word: String!): String!` to the `typeDefs`.

Now that we have two queries, I want to authorize only J. R. R. Tolkien to access the `books` query and allow anyone to acccess the `parrot` query. To do that I am going to create a mapping from different operations to different authorization logic functions. I will use a function called `endpointAuth` to do that. I will also create two helping functions for the authorization logic called `booksAuth` and `parrotAuth`.

```javascript
const { AuthenticationError } = require("apollo-server");

function booksAuth(user) {
  const validUsers = ['J. R. R. Tolkien'];

  if (validUsers.includes(user)) return;

  throw new AuthenticationError('You are not authorized to use this endpoint.');
}

function parrotAuth() {
  return;
}

function endpointAuth(endpoint, user) {
  switch (endpoint) {
    case 'books':
      booksAuth(user);
      break;

    case 'parrot':
      parrotAuth();
      break;

    default:
      throw new AuthenticationError('Unknown endpoint.');
  }
}
```

If you try using the endpoints, you should be allowed to, but if you change the hardcoded `J. R. R. Tolkien` name in the context to something else, the `AuthenticationError` will be thrown stopping the execution. Since this all runs before any resolver logic, you can stop a user before they use a particular endpoint they are not supposed to. Of course, for this to make the most sense, I suggest querying your database while building the context to get the actual user's information before this is run. Either way, we now know how to stop someone from querying something that we do not want them to. This is the main point that I wanted to get across. As a bonus, I will show you how to create a scaffolding for logic based on the input given.

Let's say that someone is querying parrot, but we only want to support a given whitelist of words that are allowed to be echoed. I'm thinking of a query that looks something like this:

```
query parrotQuery(
  $word: String!
) {
  parrot(word: $word)
}

variables: {
  "word": "badword"
}
```

We will need to first do some work before we ever call `parrotAuth` to make sure that we have the correct input. There are some [weird structures that get passed down to the plugins](https://github.com/apollographql/apollo-server/blob/main/packages/apollo-server-types/src/index.ts) that I ended up logging to make sense of. I am going to spare you that trouble and go ahead and just show the functions I have already created to parse out all that madness. They are called `flattenArgs` and `handleValue`. The `flattenArgs` function will loop through the arguments passed in and then called `handleValue` where appropriate. The `handleValue` function either can do some sort of data transformation on a specific type (like casting from a string to a number for `IntValue`) or map a variable value to the appropriate given value. Here is the code to do that.

```javascript
function handleValue(argValue, requestVariables) {
  const {
    kind,
  } = argValue;
  let val;

  switch (kind) {
    case 'IntValue':
      val = argValue.value;
      break;

    case 'StringValue':
      val = argValue.value;
      break;

    case 'Variable':
      val = requestVariables[argValue.name.value];
      break;

    default:
      // If I haven't come across it yet, hopefully it just works...
      val = argValue.value;
      break;
  }

  return val;
}

function flattenArgs(apolloArgs, requestVariables) {
  const args = {};

  apolloArgs.forEach((apolloArg) => {
    console.log(JSON.stringify(apolloArg, null, 2));
    const {
      kind,
      name: {
        value: argName,
      },
      value: argValue,
    } = apolloArg;

    switch (kind) {
      case 'Argument':
        args[argName] = handleValue(argValue, requestVariables);
        break;

      default:
        break;
    }
  });

  return args;
}
```

Also I changed the `authPlugin` function to format and then pass these values on. It now looks like this.

```javascript
function authPlugin() {
  return {
    requestDidStart(requestContext) {
      const {
        context: apolloContext,
        request: {
          variables: requestVariables,
        },
      } = requestContext;

      return {
        didResolveOperation(resolutionContext) {
          const { user } = apolloContext;

          resolutionContext.operation.selectionSet.selections.forEach((selection) => {
            const { value: operationName } = selection.name;
            const args = flattenArgs(selection.arguments, requestVariables);
            endpointAuth(operationName, user, args);
          });
        },
      };
    },
  };
}
```

I can pass those `args` down to `parrotAuth` and make sure that a user is allowed to call the query with those specific `args`.


```javascript
function parrotAuth(user, args) {
  const validUsers = ['J. R. R. Tolkien'];
  const dictionary = ['Frodo', 'Gandalf', 'Legolas'];

  if (validUsers.includes(user) && dictionary.includes(args.word)) return;

  throw new AuthenticationError('You are not authorized to use that word.');

  return;
}

function endpointAuth(endpoint, user, args) {
  switch (endpoint) {
    case 'books':
      booksAuth(user);
      break;

    case 'parrot':
      parrotAuth(user, args);
      break;

    default:
      throw new AuthenticationError('Unknown endpoint.');
  }
}
```

The authorization logic itself is not great and only for example purposes because it is all hardcoded. I have used this in my project to pull in the user, pull in the arguments, and make sure that the user can act on the given arguments. One use case could be having a randomly generated GUID represent a book and the user that is passed in from the context could also have a list of books that the user is allowed to operate on. You could check the arguments to make sure that the given GUID is present in the array of books for authorized operation. This can get more dynamic once you hook in a database and API calls to add books to a user's list of authorized-to-operate-on books.

The main goal of this was mostly to get code snippets out there to show how to create Apollo plugins, how to parse through the input given to the plugins, and a brief overview of how you could build a scaffold around authorization logic. As I said, I have used this with success, and I hope you can too.
