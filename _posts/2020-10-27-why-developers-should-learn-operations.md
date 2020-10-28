---
layout: post
title:  "Why Developers Should Learn Operations"
author: Thomas
tags: [ ops ]
description: Discussing why developers should learn cloud operations
---

A year ago I never would have guessed how familiar I would become with AWS and operations at this point in time.
Last year, the extent of my AWS knowledge was adding pictures to an S3 bucket while following directions for a class in college.
I didn't even fully understand what S3 was, what I was doing, or the power behind the service I just took advantage of.
Since then I have created, deployed, and maintained serverless APIs, front end applications, CICD pipelines, and analytics applications using AWS.
Not only have I learned loads about cloud operations, but I also learned how I should write code that is better suited for cloud applications.

The reason I am writing this is that I believe more developers should look into learning the operations side of things.
The way I see it, if a developer can learn the operations side of applications, that developer can write code and create the infrastructure that code runs on to work together instead of shoving the responsibility onto an operations team to make the infrastructure fit the application code or vice versa.
I am a software engineer and I like writing code, but I also understand that my code may or may not work as intended once it is deployed somewhere other than my local machine (that is if I'm not using containers) and how it gets deployed has a lot to do with that.
Understanding where and how that code operates once it is deployed makes for a better application.
Isn't that what we all want?

### How it's possible that anyone can learn operations

The old (but unfortunately still utilized) way of organizing teams to create a software application is by splitting the project into two main areas of technology, software development, and operations.
Software development is what I enjoy and ultimately want to spend most of my time doing.
Developers write the code that gives machines purpose-built logic and processes.
The other side of the coin is operations, which manages the infrastructure upon which a software application is deployed.
When I first learned about these two parties I pictured two different stereotypes in my head; the software developers were the cool, hip, Silicon Valley types that drank coffee all day and coded on a Mac covered in stickers, while the operations side were displaced mainframe managers or sysadmins that worked on old desktops.
I was completely wrong.
I had that image in my head because I was afraid of the deep darkness of operations.
I heard that operations was not an entirely well-documented field that featured cryptic shell scripts and low-level commands.
While some companies might still run their engineering teams this way, I now know that the days of those spooky cobweb-filled corners of the internet do not need to exist anymore.

In come the cloud providers: AWS, GCP, Azure, DigitalOcean, and plenty of others.
In my opinion, cloud providers were the only way to move infrastructure and operations teams into a newer, faster-paced environment.
No longer does a company need to maintain a data center.
No longer does a company need to buy and refresh hardware.
No longer is there incredible tribal knowledge inside an engineering organization's operations teams.
Cloud providers wash all of that away and make infrastructure self-service and easy.
By shifting the responsibility onto a company who's purpose and specialization is operations, tons of time is freed up.
Not only is there extra time, but there is also now an easier barrier to entry since a chunk of operations can be abstracted away.
That's why we continually see more and more responsibility going to the cloud provider (servers -> VM -> IaaS -> PaaS -> FaaS); it's easier for them to manage because they specialize in it and not everyone wants to deal with it.
Tons of solutions can be made generic enough that still fit the bill for most engineering teams.
With that lower barrier to entry and smaller learning curve, now the responsibility of managing infrastructure can be given to the same team that develops the software.
And when I say "managing infrastructure" I mean configuring that infrastructure since the management of the actual hardware is the cloud providers' job.

Another benefit of moving everything to the cloud is that documentation is no longer an in-house catastrophe.
Have you used AWS's documentation?
There is a lot of documentation.
Architecture examples, API calls, CloudFormation templates.
It seems like anything that anyone could ever want to do has already been done and documented.
I only see this as a positive because it gives newer users a point of reference and broadcasts best practices.
I looked over heaps of documentation when I first started with AWS.
I didn't know what I was doing, and there was no one helping me learn other than the fine folks of the internet.
The amount that I did learn was tremendous and momentous.
What I can do in a few days with AWS used to take an entire organization the same amount of time with less stability in the end product.
It's no wonder engineering organizations want to move to the cloud with a DevOps methodology.

Cloud providers give amazing power to their users and adopters' applications, and architectures that are being used and thought up are constantly changing to better use the quick, easy, pay-per-use cloud-centric model.
Without cloud service providers being able to make their businesses profitable, make the services user-friendly, and continually improve upon processes, giving developers the chance to wield this much power would not be possible.
By shifting the responsibility of managing a data center away from numerous companies with various levels of proficiency, cloud providers can focus on what they do best while their clients can focus on building with the result of the finely tuned data centers.
With the ease of spinning up and tearing down cloud infrastructure, companies can move faster when it comes to building out proofs of concept and MVPs and having the economy of scale also allows cloud computing to become cheaper.
I think a huge part of the move to cloud computing is the user-friendliness.
There are parties on the internet saying that providers like AWS are too large and too difficult to learn, but if you throw yourself into the fire (like I was), then learning AWS is not impossible as some might make you think.
As I said, the documentation is there, and there are countless YouTube videos and courses that exist to teach people how to operate with cloud providers.
[I have even started trying to make videos about building with AWS.](https://www.youtube.com/channel/UCabgFZa__PTUWU5pIDvsk3Q)
If it was not easy, then people would not use it.
The barrier to entry from a cost standpoint is also lower, which means that anyone can create services for less money and with less knowledge of the underlying technologies (not that you shouldn't explore those underlying technologies) than before.
Lastly, cloud providers can improve upon their processes to make the cloud experience that much better.
Higher uptimes, more useful services, cleaner documentation; these are some of the benefits that we reap whenever responsibility shifts onto those who do the job best.

### The power behind learning operations as a developer

If a tree falls in a forest and no one is around to hear it, does it make a sound?
In the same vein, if a developer writes an application and never deploys it, did the application ever exist?

This is where we get to the real reason why I am writing this post.
I have been in and out of operations roles for the past four years as a network engineer and now as a part-time software engineer and part-time cloud engineer (or whatever I would be called).
It surprised me how quickly developers would just leave operations to someone else.
When I write an application, I want to share it with others, and if I can deploy that application, I can reach people easily.
Just about everything now is either a web application or something that supports a web application.
If a developer creates an application and can't deploy it, the consumers that are left are those that find a GitHub repository and decide to build from source.
The audience is limited in that case.
If that developer could deploy his application, then the consumers become anyone who has a web browser.
The potential audience is drastically increased to everyone with internet access once that application can be deployed and served.
Of course, deploying something is just one piece to the puzzle.

When it comes to operations, I won't even try to claim that I know everything in the realm of operating an application.
Some of the larger topics that come to mind are CICD, [application infrastructure](https://thomasstep.dev/blog/cloudformation-for-serverless-api-development), data stores, and logging and monitoring.
Being able to deploy an application automatically, update its infrastructure configuration when needed, knowing that your data stores are resilient and available, having good logs coming from the application, and being able to monitor the health of both the application and infrastructure in real-time has power.
I'm sure that other important areas should be considered; again, I'm no expert.
These are just a few common and more visible areas that I have personal experience with that I think are important for most web applications.
These are also the areas that I have enough experience with to discuss.

With the big push to move to the cloud, developers who also know ops become invaluable.
I am confident that I alone could write code and build infrastructure for most basic applications or services.
I now have an advantage over others who either only know how to run operations or only know how to write software.
Being able to say that excites me because I know what others are missing out on, and also makes me want to show others what they're missing out on.
We are living in an amazing time where a single person can create something and make it available to the world in such a short amount of time.
Having the knowledge of how to do that feels good and I hope that I can share that with others.
