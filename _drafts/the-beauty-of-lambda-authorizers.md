crow auth uses lambda authorizers to validate application jwts before allowing applications to make calls on the application users' behalf
i love authorizers
not only are they extremely simple to write they also save me money
by authorizing api calls based on tokens, if a caller isn't authorized, I never have to pay for the business logic function to run
on top of that, if i cache the authorization, i won't even pay for multiple invocations of the authorization lambda since the cache just rejects the call from the get go

