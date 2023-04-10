---
layout: post
title:  "API Calls with Pagination in React"
author: Thomas
tags: [ dev, front end, javascript ]
description: Reading a paginated API in React
---

I wanted to share a simple strategy that I implemented when reading entities from an API that used pagination. For some context, this was for [Elsewhere](https://elsewhere.thomasstep.com/). There are possibly many many entries that can be part of a trip. Reading the entities is paginated so the payload is not an unbounded size. The pagination strategy is using a token for the next page and if there are no more pages, then the token is `null`. A payload might look like the following

```json
{
  "entries": [
    {
      "id": "bbfbe7ac-8c10-4d4b-b512-99925db13604",
      "name": "entry name",
      "startTimestamp": "2023-01-29T01:00:00.000Z",
      "endTimestamp": "2023-01-29T03:00:00.000Z",
      "createdBy": "666e7d31-6692-4852-81fe-40eeb6c35d0b",
      "location": {
        "latitude": 44.208788215176114,
        "longitude": -69.06005859375
      }
    }
  ],
  "pagination": {
    "nextToken": "eyJJZCI6Ijk4YjViOGRmLTM1MWItNGJkOC04YTFkLWIwM2JlZjA3OTdjYiIsIlNlY29uZGFyeUlkIjoiY29uZmlnIn0="
  }
}
```

The `pagination.nextToken` is what we are after.

The front end wants to read all of the entries and display them for the user, but it needs to essentially loop through the results to read them all. I started with a new piece of state that I called `nextToken` (very fitting) initialized as `null`. Then came the initial call to the API with whatever properties I wanted like a limit in a `useEffect` hook that ran whenever the component mounted meaning the second parameter was an empty array. The call is run alongside other initialization. During that initial call, I check the length of the array of paginated results returned and the `nextToken`. I check the length of the array because if it is less than the `limit`, I already know we have read all the results and I can be done. If the array is equal to the `limit` and the `nextToken` is not `null`, then I set the `nextToken` state to whatever the value in the payload was.

To loop through the rest of the pages, I wrote another `useEffect` hook that only triggers on a `nextToken` state change (the second parameter is `[nextToken]`). (It is also important to note that the hook starts by checking that the `nextToken` state is not `null`.) Whenever the hook triggers, I read another page with the same limit and pass in the `nextToken` provided by the state. The same checking applies to the resulting payload for another page. If the array size is equal to the `limit` and the `nextToken` value in the payload is set, then I update the `nextToken` state for the hook to run another time. The new page's results are appended to the existing results, which ends up building out the whole set of information.

Here is what an implementation might look like.

```jsx
function MyComponent() {
  const [entries, setEntries] = useState([]);
  const [nextToken, setNextToken] = useState(null);

  useEffect(() => {
    if (!token || !router.isReady) {
      return;
    }

    fetch(`paginated.resource/entries?${new URLSearchParams({ limit })}`)
      .then((res) => {
        if (res.status !== 200) throw new Error('Unhandled status code');

        return res.json();
      })
      .then((data) => {
        const resEntries = data.entries;
        const resNextToken = data.pagination.nextToken;
        setEntries(resEntries);
        if (resEntries.length === limit && resNextToken) {
          setNextToken(resNextToken);
        }
      })
      .catch((err) => {
        console.error(err)
      });
  }, [router, token]);

  // Scroll through pagination
  useEffect(() => {
    if (!nextToken) return;

    const params = {
      limit,
      nextToken,
    };
    fetch(`paginated.resource/entries?${new URLSearchParams(params)}`)
      .then((res) => {
        if (res.status !== 200) throw new Error('Unhandled status code');

        return res.json();
      })
      .then((data) => {
        const resEntries = data.entries;
        const resNextToken = data.pagination.nextToken;
        const newEntries = Array.from(entries);
        newEntries.push(...resEntries);
        setEntries(newEntries);
        if (resEntries.length === limit && resNextToken) {
          setNextToken(resNextToken);
        }
      })
      .catch((err) => {
        console.error(err)
      });
  }, [nextToken]);

  return (
    <Something />
  );
}
```

Of course, many pieces might need to be filled in or adjusted for your specific use case. Hopefully, this gives you a jumping-off point of how someone else somewhere in the world has gone about reading from a paginated API.
