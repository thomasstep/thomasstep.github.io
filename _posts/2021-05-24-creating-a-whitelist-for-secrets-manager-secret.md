---
layout: post
title:  "Creating a Whitelist for a Secrets Manager Secret"
author: Thomas
tags: [ aws, ops, security ]
description: Using a resource policy to grant access to a secret
---

A while back, I was attempting to block access to a secret in AWS Secrets Manager to everything except a few IAM Roles and Users. It might seem like an easy task but there were some challenges involved. I will include a snippet of a template to go over the different parts, but if you would rather just snag a copy of the whole template, I have added it to my [aws-cloudformation-reference GitHub repo](https://github.com/thomasstep/aws-cloudformation-reference/blob/master/secretsmanager/whitelisted-secret.yml) along with other CloudFormation templates that I have created as a reference point. The following is a version of the resource policy attached to the Secret which allows access to specific IAM Roles and Users.

```yml
Parameters:
  WhitelistedRoleIds:
    Type: CommaDelimitedList
    Description: >
      IDs (AROA*, or AIDA*) to whitelist access for on the created secret.
      Find the Role ID by running aws iam get-role --role-name ROLE-NAME.
      Remember to append :* to the end of the Role IDs.
      Find the User ID by running aws iam get-user --user-name USER-NAME.
      User IDs do not need :* appended to the end.

Resources:
  ...
  SecretResourcePolicy:
    Type: 'AWS::SecretsManager::ResourcePolicy'
    Properties:
        SecretId: !Ref MySecret
        ResourcePolicy:
          Version: 2012-10-17
          Statement:
            - Resource: !Ref MySecret
              Action: 'secretsmanager:GetSecretValue'
              Effect: Deny
              Principal: '*'
              Condition:
                StringNotLike:
                  aws:userId: !Ref WhitelistedRoleIds
```

There are some nuances worth pointing out that I stumbled across while figuring out this configuration.

First, I want to lay the foundation with resource policies. I had existing knowledge when I came across this problem (although not much hands-on experience) that some AWS resources allow us to attach resource policies to them. Some of those other resources include S3 and Lambda (for a huge list [check out this page](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-services-that-work-with-iam.html) under the "Resource-based policies" column).

Resource policies allow us to [create a shortcut for access and denial](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html#policy-eval-denyallow) based on a few key properties that are available in most API calls to the resource. This means that even if an IAM Role explicitly allows access to a certain resource, the resource policy can explicitly deny that Role access thereby denying the resource that assumed the Role. The same is true the other way around, an IAM Role that denies access to a resource will be overridden if a resource policy explicitly grants access.

I try to simplify this in my mind by thinking that whatever rules are closest to the resource win. An IAM Role can be a general thing, but a resource policy is directly attached to a resource. That means the rules on the resource policy win out over the IAM Role every time.

Building on top of our resource policy knowledge, we start getting into the nuts and bolts of this specific Secrets Manager resource policy. Since we want to create a whitelist and blacklist all other IAM resources, we'll need an explicit deny on everything except those whitelisting resources. Unfortunately, we can't simplify this to an explicit deny on everything in one statement and then another statement that gives an explicit allow. The way that the rules prioritize themselves would give precedence to the "deny everything".

Now that we understand what resource policies are, the next step is understanding what type of properties are available in API calls to the Secret according to which we can grant or deny access. The first and most obvious resource policy configuration type that I tried to use was `NotPrincipal`. This is similar to the `Principal` that sits in the aforementioned resource policy [except it does the opposite](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_notprincipal.html#specifying-notprincipal). I set out attempting to accomplish the same goal but using `NotPrincipal`, which I hoped would look like the following.

```yml
- Resource: !Ref MySecret
  Action: 'secretsmanager:GetSecretValue'
  Effect: Deny
  NotPrincipal:
    AWS: !Ref WhitelistedPrincipals
```

Unfortunately, when an API call comes in from an assumed IAM Role, it no longer looks like `arn:aws:sts::AWS_ACCOUNT_ID:assumed-role/ROLE_NAME/SESSION_NAME` which is also referred to as the assumed role ARN. Since the `Principal` is made up of both the IAM Role's ARN and the assumed role ARN, IAM will deny access to the resource since the `Principal` does not match exactly.

`aws:userId` incoming. After much scouring, I eventually landed on a page [listing the IAM policy condition keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-userid). This was part one. Part two was a [blog post about restricting access to an S3 bucket](https://aws.amazon.com/blogs/security/how-to-restrict-amazon-s3-bucket-access-to-a-specific-iam-role/) similarly to what I wanted to do with my Secret. The post explains that an IAM Role that has been assumed will always pass the same Role ID in the `aws:userId` variable along with the session name. I like to think of that unique Role ID as some mixture of the IAM Role ARN and the assumed role ARN. Since it is a singular variable, we can grant access based on it in the resource policy.

In case anyone is curious, `AROA*` and `AIDA*` are [unique prefixes that are predefined by AWS](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-unique-ids). I remember noticing that pattern while looking through logs about something unrelated and wondering if they all meant something. Turns out they do.

Using the `aws:userId` variable allows us to whitelist both IAM Users and Roles. An IAM Role needs to be whitelisted as something like `AROAJQABLZS4A3QDU576Q:*` because the session name is appended onto the Role ID at the end. (Roles must be assumed first before making an API call.) An IAM User needs to be whitelisted as something like `AIDAJQABLZS4A3QDU576Q` without the `:*` appended. To find those funky-looking IDs, run `aws iam get-role --role-name ROLE_NAME` or `aws iam get-user --user-name USER_NAME`.

I had to go down quite a few rabbit holes to figure this one out, which is why it warranted a story instead of a simple snippet. For anyone out there that might run across this and need more help, feel free to reach out to me and I will do what I can!
