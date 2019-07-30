---
layout: post
title:  "Learning Docker"
author: thomas
categories: [ dev, infrastructure, docker ]
image: assets/images/penguin2.jpg
featured: false
hidden: false
comments: true
---
I have recently been learning about Docker and its uses at work. Using Docker is like building a computer with the bare minimum environment that it needs to run a specific program. Those are the easiest words I can describe it in. Using Dockerfile and Docker Compose are extremely useful and the way of the cloud. I have not yet learned much about Kubernetes and AWS, but I know that I will be soon. These technologies work in tandem to help developers release software quickly and easily. Docker in and of itself is my main topic here. Docker builds an environment for a program with as few downloads and extras as possible. It uses "layers" as a sort of step that you would normally take before being able to even run a program on a machine. For example if you wanted to run a simple Python program in Docker you would need to download Python- and program-specific things to run that program. It helps me to think of it as starting off with a brand new computer (including disk) sitting right in front of you. What do you do to get your Python program running. First thing's first, you need an OS. This is where you start with a docker "container" (our brand new computer will be called a container). After your first step (or layer) of downloading your OS, you would need to download Python and probably pip. Then download your code. Install the code's requirements with pip. Then finally run your file. These basic steps would all also be layers/steps in a Dockerfile. Of course there are a few more things that you might have to do, but this way of thinking has helped me understand what Docker is and how to write Dockerfiles for code bases.
