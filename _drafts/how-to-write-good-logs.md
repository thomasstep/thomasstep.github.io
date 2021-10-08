ive wondered about this for a while now
between vci's weird homebrewed and multilayered metrics to common hotspots not-very-helpful messages that get tangled together
found this article https://tuhrig.de/my-logging-best-practices/
i wonder if you could do this, but to make it even easier to parse don't include a string
  the log message could be an id which can be searched for in the codebase to determine what is happening at that time
  or an id could be included so logs can be searched for using that id
logs should match up with a feature or use case
requests and responses from our server should be logged in full (probably debug)
logging in loops?
logs per function?