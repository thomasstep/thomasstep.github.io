---
layout: post
title:  "Fixing AWS Lambda ModuleLoadingError"
author: Thomas
tags: [ ops, serverless, aws ]
redirect_from:
  - /dev/aws/2019/10/16/fixing-aws-lambda-module-loading-error.html
---
TL;DR: If you are encountering a `ModuleLoadingError` when trying to run a Lambda function, change the permissions of the files in your project before deploying using `chmod -R a+rwx .` for a (possible) quick fix.
I was encountering a problem when deploying a zip file to my Lambda function from a Jenkins pipeline.
Whenever Jenkins pushed a zip to my Lambda, AWS couldn’t find the file that contained the handler.
Whenever I followed the same steps as Jenkins on my machine and pushed the zip file that I created locally, everything worked.
I was getting a `ModuleLoadingError` from AWS whenever it tried to run the Lambda function.
The problem turned out to be the file permissions that I had set on the files before I zipped them up.
I know that there are ways to change the permissions after zipping, but I decided to just append all permissions (777) for a quick fix.
The command I used for this was `chmod -R a+rwx .` while I was in the top directory of my project.
I have read that 644 permissions are the least possible permissions necessary for AWS to run your project; however, that was not the case for me.
I tried using 644 permissions and still got the same error.
It was only after I gave 777 that AWS could find my file.
I'm sure there are lower permissions that you can give, I just have not figured the correct permissions out.
