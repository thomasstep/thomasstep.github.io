i recently started diving into the vast world of dynamodb and modeling data for ddb and i wanted to share an experience i just came across
i know that there are smarter people in the world than me on this specific topic
im looking at you alex debrie and rick houlihan
either way i just stumbled across what could have turned into a mess in my model and i'm lucky i caught it early

i remember reading about using primary and secondary keys to model various types of relationships like one-to-one and one-to-many
one pattern that i noticed was the primary key was normally a single id, name, type, whatever, and then the secondary key was a cluster of various attributes separated by a hash (#)
i couldn't really see a pattern closely enough while reading to make of sense of the reasoning behind it all

the other day i needed to remodel data in one of my projects called Crow Auth
crow is authentication as a service
authentication means storing users
as a service means multitenant
originally my partition key was a hash of the tenant's id and the user's id
veterans might cringe at that so let me explain why that was a bad idea

if i ever needed all records for a given tenant, then i would need to perform a scan operation with a condition on my partition key for "begins_with"
that checks every single item in my table
as my table grows my read consumption increases whenever i needed to find all records for a given tenant
as my table grows
not "as my tenant grows"
an alternative to scanning the entire table is the query it based on a specific partition key

what this meant to me was that i needed to remodel my data to exist based on a partition key and then have any extra sorting information in the sort key
sounds intuitive right?
i couldn't tell you why i didn't do this from the start but here we are
after a few code changes the service is up and running using a single id for the partition key and a multipart sort key

here's what i learned from all that
partition keys should be somewhat large in scope
i now think of the composite keys as a series of information going from largest to smallest in scope until you reach a specific identifying attribute which exists as the last part of your sort key
if all of an entity's records need to be known, we can issue a query on that entity (partition key)
if a subset of that entity's records need to be known we can issue another query on that entity with a condition on the sort key for "begins_with" containing a more specific scope of the records we are looking for

of course there are other considerations that might need to be made around access patterns and the use of secondary indices but i'll leave that explaining to the pros for now