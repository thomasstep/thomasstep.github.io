---
layout: post
title:  "Building a Schedule Component"
author: Thomas
tags: [ dev, front end, javascript ]
description: Building a schedule and the algorithm I used
---

Since I built the [first version of Elsewhere](/blog/elsewhere-diary) I wanted to include scheduling. The original idea for Elsewhere was to have a single app that helped organize an itinerary, and for me and the people I plan trips with, a schedule is a core component of the itinerary. It did not have to be anything crazy or complex, even just a representation of the events laid over the hours in a day. When I decided to [remake Elsewhere](/blog/remaking-elsewhere), adding a schedule was one of the main things I wanted to accomplish. Handling the back end side of things was not too difficult because I just saved ISO strings for the start and end times of events. The front end is where things started getting interesting, and by interesting I mean hard.

Schedule components are rare in the open source world. Originally, I did not want to build a schedule component myself. I hoped that I would search for packages, pick the one of many I found, and drop it in place. The only schedule/calendar component I found [was paid](https://www.syncfusion.com/react-components/react-scheduler). How strange...I still don't completely understand how that model works. But I am a bootstrapper with time, not money, so I used the resources I had and decided to build my own. It can't be that hard right? Spoiler: there is a reason that the only schedule/calendar that I found was paid.

> Quick side note: I have since learned that there is a good-looking open source calendar component called [Full Calendar](https://fullcalendar.io/). It is a freemium model though.

The trouble arose as soon as I sat down and started thinking about how I wanted to render the events. I was planning on completely leaning on the grid system to manage placement. Once I started actually thinking through what "placement" means, I realized that the grid system was not going to cut it. I wanted everything to look similar to Google Calendar. That meant each hour would be displayed with borders around each hour to make it easier to see what hours events started and stopped. Then I wanted little boxes to represent the events and I wanted to shrink them along the horizontal axis if there were multiple events at the same time. The grid system is powerful, but I did not think it would reliably handle all that at once.

I did decide to use the grid for more "standard" purposes. To build out the background (hours in the day), I used a set of grids that controlled elements in a column that spanned the full width of the column with a set height in pixels. (Remember the set height part because that is relevant later on.) The full-width elements are separated by dividers that implement the hour dividers that make it easier to see where an event's boundaries are. Directly on top of that "standard schedule grid" I placed the events.

After much thought about only the CSS portion of this component, I decided to position each event as `absolute` and calculate placement based on the other events around it. For those who are not CSS wizards (like me), `absolute` placement means that the element does not follow normal rules that place it relative to the elements that come before it but places itself exactly where it is told with respect to its surrounding/parent element. An `absolute`ly positioned element will start with an origin (think cartesian coordinates) at the top leftmost point of its parent element. The positioning of the `absolute`ly positioned element's top left corner is then handled by the CSS attributes `top` and `left` (there are also `bottom` and `right` but I did not use those to avoid confusing myself too much). Buckle in because the calculations to get the positioning attributes got tricky.

To be fair, the vertical calculation was not too difficult. Given a set height in pixels to represent an hour (or any set period really, just need a conversion rate) (remember this from the standard schedule grid?), it is fairly easy to find how far down to push an event. The calculation is the start time of the event minus the start time of the schedule converted to hours divided by the number of pixels that represent an hour. We are effectively converting time to pixels and finding the delta between the first time shown in the schedule and the start time of an event. That pixel value becomes the `top` attribute.

Now comes the piece of the puzzle that occupied my head for multiple days: calculating the horizontal positioning. At first glance, the problem does not seem too difficult. Just find which events overlap, shrink their widths accordingly and push some of them further to the right. Easy? No. Those are the key calculations to find, but finding them is tricky, and I went through several different algorithm iterations before I finally settled on one.

I kept a running list of notes and approaches that I thought about. I went through 5 different iterations of attempts and algorithms before I finally found the one currently in use. I'll exclude write-ups of the failures. The algorithm that I eventually settled on involved matrices and basically recreating a full schedule in that matrix to find conflicts.

The first step was sorting the list of events first by start time and then the latest end time if the start times were the same. This gave the effect of stacking the longest events of an overlapping sequence on the left, which will probably make more sense once we get to the positional calculation.

Next came creating and seeding the matrix. The matrix is size `n x n` where `n` is the number of events with all indexes at an initial value of `0`. Iterating through events in the sorted list, the matrix is seeded with a `1` starting at index `i x i` where `i` is the index of the entry in the sorted list. We then look at the events following event `i` for overlaps until we reach an event that does not overlap with event `i`. For each overlapping event `j`, seed `1` at index `j x i`. This results in a matrix that looks similar to the schedule we are rendering on the horizontal axis but is squished vertically.

With our seeded matrix, we want to iterate through each row and find the number of collisions. This is effectively summing the row (since entries occupying space are a `1`). Update each `1` to the collisions on the row.

Now that we have the collisions, we can find the max collisions for each entry. This, once again, requires us to iterate through the matrix. Whenever we encounter a new max collision amount for a row, we mark its max collisions and its position in the row compared to the other overlapping events.

Now that we have the max collisions and positions of all entries we can calculate the respective widths and `left` offsets. The width of an entry expressed as a percentage is `100 / maxCollisions`. The `left` offset expressed as a percentage is `width (in px) * position`.

Putting together the `top` and `left` calculations gives us the correct top left corner of a box that will represent an entry. The `height` and `width` calculations fill out the box's dimensions.

The following is pseudocode to calculate the vertical pieces to the puzzle.

```
secondHeightInPx = 1 // example only, would set 1 second to 1 px in height
for entry in entries {
  timeDeltaInSeconds = entry.endTime - entry.startTime
  height = timeDeltaInSeconds * secondHeightInPx
  timeFromStartInSeconds = entry.startTime - earliestTimeRepresented
  topOffset = timeFromStartInSeconds * secondHeightInPx
}
```

The following is pseudocode to calculate the horizontal pieces to the puzzle.

```
entryMetadata = {}
sortedEntries = entries.sort((a, b) => {
  if a.startTime == b.startTime {
    return b.endTime - a.endTime
  }

  return a.startTime - b.startTime
})

entryLength = entries.length
matrix = createMatrix(entryLength, entryLength) // create nxn matrix with 0 values
for entry, index in sortedEntries {
  matrix[index][index] = 1
  for j = index + 1; j < entryLength; j++ {
    if entry.endTime > sortedEntries[j].endTime {
      matrix[j][index] = 1
    } else {
      break
    }
  }
}

matrix = matrix.map((row) => {
  collisions = row.sum()
  return row.map((entry) => {
    if entry == 0 {
      return 0
    } else {
      return collisions
    }
  })
})

for row in matrix {
  position = 0
  for entryCollisions, index in row {
    entryId = sortedEntries[index].id
    if entryCollisions > entryMetadata[entryId].collisions {
      // found the max collisions
      entryMetadata[entryId].collisions = entryCollisions)
      entryMetadata[entryId].position = position
    }

    if entryCollisions > 0 {
      position++
    }
  }
}
```

This is a difficult thing to put into sentences, so if this was confusing, please let me know and I will try to clarify however I can. Also, I'm bad at writing pseudocode...I know.
