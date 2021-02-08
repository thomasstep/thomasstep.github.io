---
layout: post
title:  "Beginner Python Topics I Ran Into When I Switched Languages"
author: Thomas
tags: [ dev, python ]
description: Python args, kwargs, decorators, and logging.
---

I coded in Python in college and I messed around with it on my side projects, but mostly, I coded in JavaScript. The majority of my professional career has been spent on projects that used JavaScript or Node, but recently I started on a project that used Python. I had no problem with changing languages because it gave me a chance to learn something new; however, there were a few Python topics that I encountered right off the bat that I had to learn fairly quickly.

The first Python topic I encountered was `my_function(*args, **kwargs)`. While I had seen this syntax before, I didn't fully understand it. Simply put, `*args` represents any arguments that were passed into a function and not specifically accounted for, and `**kwargs` are keyword arguments that can be passed into a function by name if the caller chooses to use them. Here's a quick and easy script to highlight the behavior.
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

Another topic that I ran into was decorators. The syntax for a decorator is `@` or the at symbol, and once I started seeing them, I noticed that they were all over Python. Decorators are simply wrappers for functions. They are an easy way to add the same logic surrounding different functions, which is why they are prevalent in webserver frameworks like [Django](https://docs.djangoproject.com/en/3.1/topics/http/decorators/), [Flask](https://flask.palletsprojects.com/en/1.1.x/quickstart/#routing), and [FastAPI](https://fastapi.tiangolo.com/#example). I wanted to write a quick program that showed how to write decorators by myself.
```python
def say_hello(func):
  def wrapper():
    print("Hello there")
    func()

  return wrapper

@say_hello
def func():
  print("I'm a function")

func()
```

Output:
```
Hello there
I'm a function
```

The `say_hello` function controls what logic happens around `func`. This is just an easy way to template functions since I can write the wrapping logic once and apply it to whichever functions I want later on.

Lastly, I found out that Python comes with its own logging module that is widely accepted and used. It can format output, log at different levels, and support handlers out of the box. While this might not seem exciting to many people, coming from JavaScript it makes a big difference to me. In JavaScript, I would have needed to install a logging library to get those kinds of features, but that's not necessary with Python. I have seen that the amount of packages required for a JavaScript application is absurd, but I never really looked into the reason why people said that. Now I'm starting to understand.