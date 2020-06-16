---
layout: post
title:  "Role of Testing in Software"
author: thomas
categories: [ dev, security ]
image: https://thomasstep.s3.amazonaws.com/penguin6.jpg
featured: false
hidden: false
comments: true
---
When it comes to software security there is one main and easy way to prevent bugs before they happen, testing. The biggest thing I took away from both my software security course at A&M and my software engineering course (CSCE 431) was to write tests before you code. As I’ve been reading more about security and looking into best practices that is the one shining commonality between most, if not all, sources. I am currently working through the [OWASP Testing Guide](https://www.owasp.org/images/1/19/OTGv4.pdf) to learn about best practices, common test cases, and just how to test in general. In my opinion, writing tests is pretty much writing code. I used to immediately start writing code before I knew what my class project or homework entailed, but I am now an advocate for test driven development.

Test driven development (TDD) has been around forever but I personally have not always paid it the attention that it deserves. I liked to get right into writing code before tests. I just thought it was a waste of time and I could test my code as I went. The problem with my old way of thinking was that I would repeatedly retype out my input, forget to regression test, and ultimately waste time coding for certain cases that I was testing for instead of coding for multiple cases. I would fix one leak and two more would spring up. What I should have been doing, and what I do now, is write actual test cases, automate my testing, and test edge cases. Writing tests before I code helps me get in the mindset of writing the actual code to solve the problems that my tests are questioning. Automating tests with a framework or a homemade script saves tons and tons of time and keystrokes in the future. Testing edge cases makes sure that I'm not creating something that only works under certain circumstances. While this by no means necessary for most of the tiny projects that I have worked on, it helps me learn what I need to do when I create something that could be used by people and matter.

Testing helps software projects stay on task and solve a problem. It can also be used to keep a project more secure, which is something that everyone can get behind. I hope that reading the OWASP Testing Guide gives me insight and some new techniques for testing in the future.
