---
layout: post
title:  "CloudFormation Exports and Imports"
author: thomas
categories: [ aws ]
image: https://thomasstep.s3.amazonaws.com/denali.jpg
featured: false
hidden: false
comments: true
---
When writing Cloudformation templates, there is a way to reference a common piece of infrastructure without having to pass it in through a parameter or a hard-coded value.
That method is Exports and Imports.
I have been using these more lately because I think that they clean up my templates, and coming from a programming background, it makes sense to me to import values from other files (in this case stacks) like a variable.
Setting an Export is like defining a variable, and using an Import is like calling that variable.
If you are Exporting and Importing a piece of infrastructure's name that may change in the future, then that means you will not have to change anything in your template as long as the Exports keep the same names.
Unfortunately, before I learned how to use Exports and Imports, I passed in references through Parameters, which did not scale well into different environments.

Here is a quick a dirty snippet as an example of how to use Exports (in vpc-template) and Imports (in another-template).
```yml
vpc-template.yml
Resources:
  myVPC:
    .
    .
    .

Outputs:
  VPC:
    Description: A reference to the created VPC
    Value: !Ref myVPC
    Export:
      Name: accountVPC



another-template.yml
Resources:
  SecurityGroup:
    Properties:
      .
      .
      .
      VpcId:
        Fn::ImportValue:
          accountVPC
```
The [`Outputs`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html) block is at the top level of your template, then comes the logical name of your output, and finally the `Export` with the `Name` of what you want to export.
In order to use a reference to `myVPC` in another template you just need to import it using a [Cloudformation intrinsic function called `ImportValue`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html).
When I was trying to figure out how to "use variables in Cloudformation templates", this is what I ended up settling in on.
I find that using Exports and Imports helps a ton when you need to reference the same piece of common infrastructure in an account across multiple templates.
