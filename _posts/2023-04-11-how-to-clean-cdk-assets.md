---
layout: post
title:  "How To Clean CDK Assets"
author: Thomas
tags: [ aws ]
description: Using a construct to clean out old CDK assets
---

I recently started looking into my AWS bill more closely and I realized that I am paying for a lot more S3 storage than I thought I should be. Upon further investigation, it seems that the CDK stores a TON of assets in an S3 bucket but it never gets rid of the old things that are not being used anymore. This lead me into a search for how to determine which assets are valid to be cleaned up.

I stumbled across a [CDK construct](https://github.com/jogold/cloudstructs/tree/master/src/toolkit-cleaner) (kind of funny) that does exactly this. Judging by all the GitHub issues, I am not the first person to be upset about this. After deploying the construct I can say that it works and it's saving me money. Thanks internet. My repo where I "implemented" this is [here](https://github.com/thomasstep/cdk-s3-cleaner).

If you don't want to follow links I guess I'll explain it. You will need to create a new CDK app (`cdk init app --language typescript`), paste the following in the stack file created in the `lib/` folder, and then run `cdk deploy --all`.

```ts
import * as cdk from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { ToolkitCleaner } from 'cloudstructs/lib/toolkit-cleaner';

export class CdkS3CleanerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new ToolkitCleaner(this, 'ToolkitCleaner', {
      retainAssetsNewerThan: cdk.Duration.days(7),
      schedule: Schedule.rate(cdk.Duration.days(30)),
    });
  }
}
```
