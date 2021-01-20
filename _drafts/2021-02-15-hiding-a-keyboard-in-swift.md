---
layout: post
title:  "Hiding a Keyboard in Swift"
author: Thomas
tags: [ dev, ios, swift ]
description: Code to hide a keyboard when user taps elsewhere
---

I've been working on developing an iOS 14 app in my free time lately, and the other day I wanted to create a `TextField` to receive input from the user. I needed a number, so [I changed the `keyboardType` to `numberPad` and added some validation logic](URL FOR KEYPAD POST). Everything was fairly easy to set up especially considering I have never developed on iOS before or written code in objective C. Then came the doozy. Whenever I tapped on something other than the `TextField`, nothing happened. I expected the keyboard to go away but it didn't want to budge. Every app I have ever used had this behavior, so I assumed that it was the built-in default behavior. I was wrong. I went down rabbit hole after rabbit hole trying to figure out how to hide the keyboard. Most of the problems I encountered were due to blog posts and StackOverflow answers referring to earlier versions of iOS, and since I was developing for iOS 14, all of my code and views were written differently. (Again, I have never developed for iOS before. It is very well possible that I am completely wrong and I could have solved this much quicker with any of the other snippets out on the internet.) It turns out that the behavior of hiding a keyboard when a `TextField` becomes unfocused is not natively built into Swift. The alternative that I ended up going with was extending `View` with a function that sends an action to `resignFirstResponder`. Then I added `onTapGesture` to a view that encompassed the screen where the keyboard showed up and called the function as a result. The whole process is still a little weird to me, but it has started to make more sense the more I look at it. Here's an example of the code.
```swift
#if canImport(UIKit)
extension View {
    func hideKeyboard() -> Void {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}
#endif

struct ContentView: View {
  @State private var myInput : String = ""

  var body: some View {
    ScrollView {
      TextField("Demo text field", text: $myInput)
          .multilineTextAlignment(.center)
          .textFieldStyle(RoundedBorderTextFieldStyle())
          .keyboardType(.numberPad)
    }
    .onTapGesture(count: 1, perform: self.hideKeyboard)
  }
}
```

I think the key here for me is that `ScrollView` takes up the entire screen of my app, so when I added the listener, if the user tapped anywhere else on the screen, they would experience the desired behavior. Since this is not natively built into Swift, I have to assume that there is no standard way of doing this. Not using this behavior as a default seems like a huge oversight to me, and I wish there was an Apple-approved way of writing in this behavior.