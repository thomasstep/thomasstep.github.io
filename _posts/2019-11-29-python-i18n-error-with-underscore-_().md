---
layout: post
title:  "Python i18n Error With Underscore _()"
author: thomas
categories: [ dev, python ]
image: https://thomasstep.s3.amazonaws.com/skua0.jpg
featured: false
hidden: false
comments: true
---
In Python there is a module for internationalization in the standard library called `gettext`.
There is also a common alias for this which is a simple underscore (\_).
While I was looking into this module a little more I noticed that it is normally used [this way](https://stackoverflow.com/questions/20920956/python-what-does-an-underscore-before-parenthesis-do), but this can cause side effects.
The original reason I learned about this functionality was while I was debugging a problem in a legacy project.
The work included linting and adding unit tests to legacy code, and `pylint` was giving me problems about unused variables.
A normal way to go about naming an unused variable in Python is to just name it underscore (\_), and this is where the problem came in.

That same legacy code also used the underscore alias convention for `gettext`, so if one of the unused variables came before a call to the `gettext` alias, the alias was no longer valid and Python tried to call whatever value was contained in the underscore variable that was reassigned.
Luckily, I caught the problem quickly because a `TypeError: 'str' object is not callable` or something similar was thrown.
However, I could potentially see this leading to harder to track bugs if an unused variable assigned to _ was something callable (a function).
So a word of caution when using the '`_()`' alias for `gettext`; you will want to be cautious if you use the `_ = unused_variable` convention.
