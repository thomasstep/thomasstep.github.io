---
layout: post
title:  "Creating an Authorization Plugin for Apollo Server"
author: Thomas
tags: [ dev, javascript, security ]
---
While working on my side project I came across a use case for needing authorization in place for all of my various GraphQL queries and mutations. For the sake of this post, I will use an example of a library where certain users are allowed to create, read, and update books (I might not get that far into, but we will see what happens). As a library of high esteem, we do not want to let just anyone be able to create or write books for us, and only a book's author should be allowed to update that book. Also, only members with a library card should be allowed to read books. This will pretty much just be an extension of the first example given on [Apollo Server's website](https://www.apollographql.com/docs/apollo-server/getting-started/).


