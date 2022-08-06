using simple HTML, CSS, and vanilla Javascript

overall, not nearly as bad as i thought it would be

a couple gotchas:
- importing things is not like node, you need to load the script in your html as a module and you need to import with `.js`
- running a function means using `window.onload` instead of simply invoking the function
- i used s3 which stores the content type so i had to fiddle around with that quite a bit. i originally wanted to ditch the `.html` extension which meant manually setting the content type to `text/html` but that messed up my javascript because the browser expects javascript files that are downloaded to be a certain MIME type
- there is no global state to fall back on. at least not a ready-built, easy to use global state. anything you want needs to be built using normal web apis which means a lot of mozilla webdocs reading for me
- using fetch is different than importing a nice package with a clean api. but fetch is still a very useable api.
