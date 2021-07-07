---
layout: post
title:  "Upload Files in a Web Application with AWS S3"
author: Thomas
tags: [ aws, dev, javascript, ops, serverless ]
description: Upload a file to AWS S3 with presigned URLs
---

I recently finished building an application that allowed users to [upload PDFs that I can then host and direct others to via a QR code](https://papyrusmenus.com/). I knew that I wanted to build the application using AWS and I figured that S3 would be my best option for storing the uploaded files, but I had never dealt with uploading files. The solution turned out to be easier than I expected, but it also was not super straightforward.

It turns out that handling an upload with HTML is just as easy as creating an [`input` tag with the type set to `file`](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications). The `input` tag draws the `Browse...` button that everyone already knows and handles bringing up a user's local file storage for choosing a file. I added an `onChange` event handler to the `input` tag which pulled the files from the event payload provided, verified the file type uploaded, verified that the file did not surpass my app's maximum file size limit, then saved the file's binary contents as the state. I subsequently had another button that uploaded the file selected, but for now, here is the code that handled a user selecting a file to upload.

```javascript
async function captureFile(handleFileSelection) {
  const MAX_SIZE = 1000000;
  const files = event.target.files || event.dataTransfer.files;

  if (files.length !== 1) {
    return;
  }

  const file = files[0];
  if (file.type !== 'application/pdf') {
    return;
  }

  if (file.length > MAX_SIZE) {
    return;
  }

  const fileBinary = await file.arrayBuffer();
  setUploadedMenu(fileBinary);
  return;
}

return (
  ...
  <input type="file" onChange={handleFileSelection}/>
  ...
);
```

The button that saved the file needed to jump through one more hoop before actually uploading the file: requesting a presigned URL from the S3 bucket. Since I did not want to expose any AWS secrets to the browser, using a presigned URL was the preferred way of handling that upload. I gave the presigned URL a short lifespan and it already has credentials built in that allowed the browser to upload without needing AWS credentials. The browser makes some API calls to a protected API that has the correct permissions to the S3 bucket, which generated the presigned URL. The request from the browser that grabbed the presigned URL looked something like the following.

```javascript
const response = await axios({
  method: 'get',
  url: '/api/get-presigned-url',
});
const { data: { presignedUrl } } = response;
```

After the presigned URL was returned, all I needed to do was `PUT` the file's binary.

```javascript
axios({
  method: 'PUT',
  url: presignedUrl,
  headers: {
    'Content-Type': 'application/pdf',
  },
  data: uploadedMenu,
  timeout: 10000,
});
```

And just like that the user's file uploads to my S3 bucket 🎉. It took a bit for me to get this code and sequence correct. The Lambda function I used to generate the presigned URL was lacking a few permissions at first. The URL was still generated, but since the Lambda generating it did not have proper permissions the `PUT` request was be denied at first. I also had some confusion around the data type that needed to be `PUT` to the S3. I ultimately ended up [going with an `ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), but there may be other methods of uploading a file.

Until next time, we'll see what I build next 🛠.