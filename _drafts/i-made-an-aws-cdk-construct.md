Last weekend was finally the weekend that I wanted to sit down and devote time to learning the AWS CDK.
Easier than I though
Also had a side project where I needed to create an API

Previously I had created large CFTs and CodeBuild buildspecs to handle APIs
My file structure always looked similar though
*explain file system look...*
This got me wondering if I could abstract this out

My abstraction would automatically create an API using API Gateway and Lambda
Paths would follow the file system
I would be my own first user so I knew it wouldn't be all for naught

Thus Crow API was born
I am currently using Crow for one of my side projects which is building a simple and easy to integrate authentication service
After creating the CDK Construct I was quickly able to spin up my endpoints and API for the authentication service and focus on coding instead of infrastructure
All of the API Gateway and Lambda integrations were abstracted out for me and I am really happy with the result of building my Construct
I'm hoping that others will be able to benefit from Crow API as well.

It is available to install using `npm install --save crow-api`
I have documented what I believe to be the most relevant information to create and deploy an API based on your file system
Please use it and let me know of any feedback or suggestions in the comments or in the GitHub issues

I would love to create a CLI out of Crow but I currently do not know how to programmatically run `cdk synth` and `cdk deploy` without some hacky looking work-arounds.