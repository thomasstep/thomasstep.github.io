---
layout: post
title:  "Writing GraphQL Resolvers"
author: thomas
categories: [ dev, javascript ]
image: https://thomasstep.s3.amazonaws.com/penguin3.jpg
featured: false
hidden: false
comments: true
---
I have been working with and writing GraphQL APIs for a couple months now, and I feel like I have gotten a good grasp on the basics.
I've been trying to get deeper into GraphQL , and one of the subjects that has lead me into this is more complex queries and resolvers.
You can take the same principles I will be talking about and apply them to mutations, but I will not be focusing on those at the moment.
My examples will be based off of using Apollo Server, so if the code looks different than a framework you are used to, I apologize.
I have successfully written a few practical nested queries so far, and I am excited to see what more I can do with this concept.
I wanted write and share a little more about my understanding on this topic.
[I wrote a little server that implements what I will be talking about so feel free to follow along](https://github.com/thomasstep/nestedResolvers).

There is a [basic example of a nested query on Apollo Server's site](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-map) about getting the books that an author has written.
I think that this a good example but not necessarily the best explanation of how nested resolvers work or can be used.
In my opinion, knowing about a subject does not mean much unless you know how to apply that knowledge.
The broad application to the knowledge that the documentation linked above is trying to show is that you can nest anything in your schema that does not terminate in a scalar.
That means that any `type` you add to your schema has potential to have its own resolver.
With that in mind, try to design your schema for reusability by trying to use common types and nesting accordingly.
If you do not care about writing a nested resolver, you can also take advantage of default resolvers in Apollo Server.
I might write another post about default resolvers later, but for now, we can continue the discussion on nested resolvers.
I am using the term "nested resolver" for any resolver that is not `Query` or `Mutation` (the root resolvers).
If you have a `type Author`, like the example from Apollo Server's documentation linked above, you can make a resolver for `Author` that resolves all of the books that the author has written.
That data can come from a DB, other API, or wherever else you want.
The awesome benefit of this is that you can have different data sources that only contribute when they are requested by the client.

I am going to show a schema that could benefit from this and that I will be writing examples for.
```
const typeDefs = gql`
  type Person {
    name: String
    awards: [String]
  }

  type College {
    name: String
    dean: Person
    notableGraduates: [String]
    numberOfStudents: Int
  }

  type Cost {
    tuition: Float
    costOfLiving: Float
    averageBooks: Float
    averageFinancialAid: Float
  }

  type University {
    colleges: [College]
    cost: Cost
  }

  type Query {
    university(name: String): University
  }
`;
```

In this example there are a few different types of `type`s running around.
There's a root type: `Query`; types that are made up of default scalars: `Cost` and `Person`; a type made of other types: `University`; and a type made of both scalars and types: `College`.

If you have dabbled in GraphQL and Apollo Server, then you probably already know how to write a resolver for a `Query` that returns a scalar.
Returning for a type that you define is not much different; you just return an object with corresponding keys.
A possibly confusing part about writing nested resolvers is using `parent`.
At least that is what Apollo Server calls it.
Once a parent resolver returns, the child/nested resolver has the ability to use the returned data.
So if we look ahead to `type University`, we can probably see that we will need a way to resolve the cost and different colleges that make up the university based on the name that is passed in.
An example of the resolver for `Query`'s `university` could be:
```
const resolvers = {
  Query: {
    university: (parent, args, context, info) => ({ name: args.name }),
  },
};
```

This allows the input to be used by the child resolvers since we are returning the same information just in a different format.
Note: it is just as valid to pass the input directly down such as the following:
```
const resolvers = {
  Query: {
    university: (parent, args, context, info) => args,
  },
};
```

I am passing the parent's return as an object with key name for this first resolver just to show that there are different ways of returning and accessing parent information.
In some of the other examples I will return the parent as a single value and not an object.
The reason I passed the input down to the children was because both of the nested resolvers that we need to write for the `University` type will need to know the name of the university.
In order to capture the return value from the parent, we use the first argument passed to the resolver (I will be naming it `parent`).

Next comes an example of the `cost` resolver (this would be added to the `resolver` object I started in the last code snippet).
```
  University: {
    cost: (parent, args, context, info) => {
      const costInfo = getCostInfo(parent.name);
      /**
       * Expects returned format:
       * {
       *    tuition: float
       *    costOfLiving: float
       *    averageBooks: float
       *    averageFinancialAid: float
       * }
       */
      return costInfo;
    },
  },
```

We can assume that `getCostInfo` pulls the data from whatever source(s) it needs to and returns the correct format.
This branch of the [resolver tree](https://blog.apollographql.com/graphql-explained-5844742f195e#.fq5jjdw7t) is now complete since we returned scalars.
I think that this a good stopping point for more explanation.
If you have never written a resolver for a nested query before, this might seem strange.
At least, it did to me the first time I wrote one and took a step back.
We wrote a resolver for `type University` and not `Query`.
After a few seconds, it makes sense though.
If you can do the same thing for `Query`, why not for a type that we created?
You could even break down the `cost` resolver more and pull the data for the individual fields from different sources.
As long as each field that terminates in a scalar is resolved at that level, you should be good to go.
You are allowed to format the return as an object (utilizing default resolvers) or return single values.
In the `cost` example, I am formatting the returned object for that resolver myself according to the schema definition.
In the resolvers for type `College`, I will return single values instead of a formatted object to show the other option.

The next resolver that I will show is for `University`'s `colleges` field.
This resolver will look too simple but I will explain further.
Remember, as long as we keep in mind that all fields that terminate in a scalar must be resolved at that level, we will be fine.
```
  University: {
    colleges: (parent, args, context, info) => {
      const colleges = getColleges(parent.name);
      return colleges;
    },
  },
```

This example looks too simple to be right, but just wait.
The `colleges` resolver is finding the name of the colleges in the university and simply returning them.
There are some assumptions and givens that have to be in place for this to work out for further nested resolvers.
The first one that I am making is that `getColleges` returns an array.
The second assumption is that there are other resolvers for the `College` type.
In this and future examples in this post, I am going to assume that `getColleges` returns an array of strings.

Here are the remaining resolvers for `College`:
```
  College: {
    name: (parent, args, context, info) => {
      return parent;
    },
    dean: (parent, args, context, info) => {
      return getDean(parent);
    },
    notableGraduates: (parent, args, context, info) => {
      return getNotableGraduates(parent);
    },
    numberOfStudents: (parent, args, context, info) => {
      return getNumberOfStudents(parent);
    },
  },
```

To further explain the oddly simple return value for `University.colleges`, I thought that it would be helpful to show the `College` resolvers first.
These resolvers look like they are using a single value for `parent` even though `University.colleges` (and `getColleges`) returned an array of strings.
This is because Apollo Server calls the nested resolvers once per entry in the array, and the value of `parent` is the value for a particular index in that array.
That means that for a more complex schema and resolvers that need more information, you can have the parent return an array of objects with whatever information the nested resolvers need.
I like to think of it as Apollo Server doing a `.forEach()` on the return of the parent.
This is something special and interesting for resolvers that are arrays like `University.colleges`.
It was difficult for me to figure this out when I first encountered it, but super powerful once I understood it.
Also you can see, the `colleges` values that end in a scalar (`notableGraduates` and `numberOfStudents`) are simply resolved on their own and returned in the `College` type.

The last type to finish off this schema is `Person`.
Since `College.dean` is not a scalar, we still need to get to the ends of that tree's branches.
```
  Person: {
    name: (parent, args, context, info) => {
      return parent;
    },
    awards: (parent, args, context, info) => {
      const awards = getAwards(parent);
      return awards;
    },
  },
```
As long as you have been following along so far, this one should be no surprise.

I think that messing with this stuff is entertaining, and I did make this a little harder than it had to be on purpose.
If you can understand what all is going on here, I am sure you can figure out resolvers for your own project.
Good luck!
