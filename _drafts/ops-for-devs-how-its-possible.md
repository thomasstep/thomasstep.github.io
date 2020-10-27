---
layout: post
title:  "Ops for Devs: How it's Possible"
author: Thomas
tags: [ dev, ops ]
description: Discussing how devops is possible with the cloud
---

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
That's why we continually see more and more responsibility going to the cloud provider (bare metal -> VM -> IaaS -> PaaS -> FaaS); it's easier for them to manage because they specialize in it and not everyone wants to deal with it.
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
With the ease of spinning up and tearing down cloud infrastructure, companies can move faster when it comes to building out proofs of concept and MVPs, and having the economy of scale also allows cloud computing to become cheaper.
I think a huge part of the move to cloud computing is the user-friendliness.
There are parties on the internet saying that providers like AWS are too large and too difficult to learn, but if you throw yourself into the fire (like I was), then learning what AWS is is not impossible as some might make you think.
As I said, the documentation is there, and there are countless YouTube videos and courses exist to teach people how to operate with cloud providers.
If it was not easy, then people would not use it.
The barrier to entry from a cost standpoint is also lower, which means that anyone can create services for less money and with less knowledge than before.
Lastly, cloud providers can improve upon their processes to make the cloud experience that much better.
Higher uptimes, more useful services, cleaner documentation; these are some of the benefits that we reap whenever responsibility shifts onto those who do the job best.
