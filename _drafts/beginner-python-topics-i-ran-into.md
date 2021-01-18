---
layout: post
title:  "Beginner Python Topics I Ran Into When I Switched Languages"
author: Thomas
tags: [ dev, python ]
description: Discussing args, kwargs, decorators, logging, and context vars for Python.
---

I coded in Python in college and I messed around with it in side projects, but mostly, I coded in JavaScript. The majority of my professional career has been spent on projects that used JavaScript or Node, but recently I started on a project that used Python. Personally, I had no problem with changing languages because it gave me a chance to learn something new; however, there were a few Python topics that I encountered right off the bat that I had to learn fairly quickly.

The first Python topic I encountered was `my_function(*args, **kwargs)`. While I had seen this syntax before, I didn't fully understand it. Simply put, `*args` represents any arguments passed into a function that were not specifically accounted for, and `**kwargs` are keyword arguments that can be passed into a function by name if the caller chooses to use them. Here's a quick and easy script to highlight the behavior.
```python
def my_func(arg_one, arg_two, *args, **kwargs):
  print(f"arg_one: {arg_one}")
  print(f"arg_two: {arg_two}")
  print(f"args: {args}")
  print(f"args[0]: {args[0]}")
  print(f"kwargs: {kwargs}")
  name = kwargs.get("name")
  print(f"kwargs[name]: {name}")

my_func("hello", "world", "this", "is", "thomas", name="thomas", profession="software engineer")
```

Output:
```
arg_one: hello
arg_two: world
args: ('this', 'is', 'thomas')
args[0]: this
kwargs: {'name': 'thomas', 'profession': 'software engineer'}
kwargs[name]: thomas
```

The `args` are referenced like we would reference a list and `kwargs` are referenced like we would reference a dictionary. We can also do the reverse to pass in an array as `args` and a dictionary as `kwargs`.
```python
args_array = ["this", "is", "thomas"]
kwargs_dict = {"name": "thomas", "profession": "software engineer"}

my_func("hello", "world", *args_array, **kwargs_dict)
```

Calling the function with `args_array` and `kwargs_dict` results in the same behavior as before.

Another topic that I ran into was decorators.