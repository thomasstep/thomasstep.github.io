---
layout: post
title:  "re:Invent: How Amazon.com Transforms Customer Experiences Through AI/ML"
author: Thomas
tags: [ aws ]
description: My notes about the 2021 re:Invent INO202 session
---

This is an overview of a session that I went to during re:Invent 2021. I start by providing the notes I took during the session, and then I will give my take and comments if I have any at the end.

Wednesday 16:00

INO202

Choong Lee and Laura Squier

How Amazon approaches the idea of applying AI/ML to everything

Agenda:
- Key use cases
- Lessons learned

AI/ML can be used now because we have enough data volume and velocity
- What powers Prime one-day shipping
  - 400 million products are forecasted everyday down to the zip code level
  - Fulfillment centers, robots, trailers, and delivery vans all come into play
  - Well-placed fulfillment centers
  - Know how many trailers and delivery vans are needed to get products out
- Some product have obvious demand
  - Sun lotion
  - Cleaning products
  - Etc.
- Some products are not obvious at all
  - New product or a demand spike
  - Seasonal products
- Goal is to anticipate what products will be needed at what time in what locations
- Forecasting models
  - Traditional approach has input and output with a bunch of if-else conditions
    - Bunch of rules and are manually coded
  - AI/ML models are trained by data points and provide output in probability
- Models used to be decision trees and are now neural networks
  - Nonlinear relationships
  - Automated feature engineering
  - There is a lot of interconnected information that was not used by decision trees that can be with neural networks
- After the forecast comes the fulfillment center
- Items are randomly stored in cubbies which are moved by robots
- Robots/computers know which cubbies have which items
- Robots move to pickers (humans) based on the probability that they will need a certain item they hold
- Robots present the correct cubby to the picker

What other customer experiences are transformed through AI/ML
- Moving from a reactive approach to a proactive approach
- Food allergen or health and safety risks on items
  - They used to gather feedback from customers, identify and tag items with concerns, then suppress items and notify regulatory bodies
  - Had to wait for customer feedback or recalls
  - Goal was to predict health and safety risks
  - Built model around key parameters and assign a probability of concern before anything is shipped
- Shipping packaging size reduction
  - ML model based on business rules and visual inspections
  - That model also knows about "collectibles" and can predict if an item is collectible
  - If collectible, that model knows whether or not the item needs additional protective packaging
- Teams at Amazon use AWS tech to build and develop new models in weeks

What did Amazon learn was most important to get right in the ML journey?
- The hallmark of Amazon is speed and scale
- At that speed and scale, traditional algorithms won't work
- There are hurdles for businesses that are not already using AI/ML
- Crossing those hurdles
  - ML-first mindset and culture
    - Start with one question: how will you use ML?
  - Enabling teams for the mission
    - Break down the silos between business domain experts and technical experts
    - Evolve the teams as you grow and scale
      - Start small and build within the team before scaling across teams
    - Apply the right tool for the job
      - Simple, off-the-shelf, pretrained AI service; ML platform ready to be trained; or individual algorithms like tensorflow
  - Powerful data platform
    - Data fuels ML-driven innovations
      - Teams closest to the customer will be able to apply ML with the largest impact
      - Amazon uses a big data marketplace for AI/ML teams to have self-service discovery and subscription to data
  - Choosing the right first project
    - Does it solve a real and significant prob for your customer?
    - Where/how does ML unlock new capabilities?
      - If traditional BI tools do a majority of what's needed, ML might not be a good first project
    - Are there places where we already have a lot of untapped data?
    - Can we achieve success in the first 6-10 months?
      - Get something to prod and prove value to customers
    - Is is important enough to get sustained attention and support?
  - Scaling
    - Remove the blockers to the path to deploying solutions to production

My notes:

I am new to AI/ML. This session made me think that AI/ML was more of a business-related technology than a developer-related one. I am sure that there are applications for both, but I found it strange that they presented much more of the business side of things especially given the venue.
