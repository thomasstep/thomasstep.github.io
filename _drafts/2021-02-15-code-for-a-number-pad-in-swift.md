---
layout: post
title:  "Code For a Number Pad in Swift"
author: Thomas
tags: [ dev, ios, swift ]
description: Use a number pad and validate input in swift
---

I have been developing an iOS application recently and I needed to receive numeric input from the user. I added a `TextField` and changed the `keyboardType` to `numberPad`, but I also stumbled across someone who took it an extra step and added some validation. I wanted to share what that looked like and also show my twist on it. The simple `TextField` with numeric input looks like this.
```swift
TextField("Demo text field", text: $myInput)
  .multilineTextAlignment(.center)
  .textFieldStyle(RoundedBorderTextFieldStyle())
  .keyboardType(.numberPad)
```

However, if the user has a Bluetooth keyboard synced with their device or if they are on an iPad (iPads do not support `numberPad`) then it is possible for a user to input other characters as well. To combat bad characters being passed in, we can add some validation logic like this.
```swift
import Combine

...

TextField("Demo text field", text: $myInput)
  .multilineTextAlignment(.center)
  .textFieldStyle(RoundedBorderTextFieldStyle())
  .keyboardType(.numberPad)
  .onReceive(Just(myInput)) { newValue in
    let filtered = newValue.filter {
      "0123456789".contains($0)
    }

    if filtered != newValue {
        self.desiredPomodoroRounds = filtered
    }
}
```

It is worth noting that I needed to import `Combine` for `Just` to work. The `onReceive` function allows us to validate the input text as it comes in. What this snippet does is check that only numbers are input, and if another character is found, that character is dropped. I took this a step further still. I was moving from `Slider` to `TextField` so I wanted to put bounds on the numbers that could be input. My solution was to check for those bounds inside of `onReceive` and force the value back inside of my bounds. Since I am expecting a number but want to make input easy, I felt that this was a decent compromise.
```swift
import Combine

...

TextField("Demo text field", text: $myInput)
  .multilineTextAlignment(.center)
  .textFieldStyle(RoundedBorderTextFieldStyle())
  .keyboardType(.numberPad)
  .onReceive(Just(myInput)) { newValue in
    let filtered = newValue.filter {
      "0123456789".contains($0)
    }

    // Arbitrary default value within bounds
    let numberValue = Int(filtered) ?? 4

    // Check for lower bound
    if numberValue < 1 {
        self.myInput = "1"
    }

    // Check for upper bound
    if numberValue > 60 {
        self.myInput = "20"
    }

    if filtered != newValue {
        self.myInput = filtered
    }
}
```

The bounds and default value would need to be tailored to each application, but this is a decent (albeit a little hacky) way to put numeric bounds on `TextField` input. The nil coalescing operator on the cast (`Int(filtered) ?? 4`) also allows for a value to be present if the user just deletes all of the input.
