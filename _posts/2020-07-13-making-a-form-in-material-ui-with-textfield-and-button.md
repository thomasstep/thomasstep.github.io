---
layout: post
title:  "Making a Form in Material UI with TextField and Button"
author: Thomas
tags: [ dev, javascript ]
description: How to make a form that accepts text input using Material UI
---

While working on my side project, I came across the need to have a form where some sort of text was given as input and when a button was clicked that input was captured and used in a subsequent API call. It turns out that the solution I went with was fairly easy to understand, but I wanted to make note of it either way.

Keep in mind that I am using Next.js/React and Material UI for this. The solution's code is below, but I will explain it first. I used a combination of React state and event listeners to accomplish this. First comes the form components themselves, a `TextField` and `Button` from Material UI. Next comes the state needed to hold onto the input given, which I just called `textFieldInput`. The `TextField` has an `onChange` event listener which captures anything that is given as input. I wrote a handler for this to simply update the `textFieldInput` state value with whatever is in the `TextField`. Next comes the `onClick` listener for the `Button`. Whenever that is clicked, I simply pull the value of `textFieldInput` out of the state and then I can use the current value that the user typed into the `TextField`. Voila.

```javascript
class FormClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textFieldInput: '',
    };

    this.doSomethingWithInput = this.doSomethingWithInput.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
  }

  handleTextFieldChange(event) {
    event.preventDefault();
    this.setState({
      textFieldInput: event.target.value,
    });
  }

  doSomethingWithInput(event) {
    event.preventDefault();
    const {
        textFieldInput,
      } = this.state;
    // Use textFieldInput
  }

  render() {
    return(
      <>
        <TextField id="filled-basic" label="Email" variant="filled" onChange={(e) => this.handleTextFieldChange(e)} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={(e) => this.doSomethingWithInput(e)}
        />
      </>
    );
  }
}
```
