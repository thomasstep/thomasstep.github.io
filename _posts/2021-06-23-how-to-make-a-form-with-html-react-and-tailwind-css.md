---
layout: post
title:  "How to Make a Form With HTML, React, and Tailwind CSS"
author: Thomas
tags: [ dev, javascript ]
description: Create forms using HTML, React, and Tailwind CSS
---

For the past month or so I've been working on a new service that offers [authentication as an API](https://crowauth.com/) and I started needing user input on the front end. Just about every web app nowadays lets a user enter some sort of information that is then used to make API calls on their behalf. Pulling that data out of the input forms can sometimes be a little tricky. One of my use cases was allowing a user to enter their credentials before signing them in.

I have posted previously about [creating forms with Material UI components](/blog/making-a-form-in-material-ui-with-textfield-and-button), but I did not want to rely on Material UI for this project. Instead, I shifted to using simple HTML and Tailwind CSS for my styling. The idea behind grabbing information from the user using React is similar to the previous post. I used two `input`s and one `button` with some React listeners. Whenever either of the `input` fields changes (which means the user entered information) I update a state variable to keep track of that data. Then when the user clicks the `button`, I already have the entered information stored in state to be used in the `button`s `onClick` handler. The following is the barebones HTML, but I will add some Tailwind styling in just a second.

```jsx
export default function SigninPage() {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSignInEmailFieldChange(event) {
    event.preventDefault();
    setSignInEmail(event.target.value);
  }

  function handleSignInPasswordFieldChange(event) {
    event.preventDefault();
    setSignInPassword(event.target.value);
  }

  async function handleSignIn(event) {
    event.preventDefault();
    setErrorMessage('');

    try {
      // Sign In logic using signInEmail and signInPassword state
      setErrorMessage('There was an error signing in');
    } catch (err) {
      // Remediation logic
      setErrorMessage('There was an error signing in');
    }
  }

  return(
    <div>
      <label>Email address</label>
      <input
        type="email"
        placeholder=""
        value={signInEmail}
        onChange={(e) => handleSignInEmailFieldChange(e)}
      />
      <label>Password</label>
      <input
        type="password"
        placeholder=""
        value={signInPassword}
        onChange={(e) => handleSignInPasswordFieldChange(e)}
      />
      <button
        onClick={handleSignIn}
      >
        Sign In
      </button>
      <p>
        { errorMessage }
      </p>
    </div>
  );
}
```

This should handle all of the logic involved with grabbing and using input given by the user, but anyone who tries to use this will probably not like the outcome. I'm going to add some Tailwind styling, but feel free to run with it from here with your own styling.

```jsx
export default function SigninPage() {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleSignInEmailFieldChange(event) {
    event.preventDefault();
    setSignInEmail(event.target.value);
  }

  function handleSignInPasswordFieldChange(event) {
    event.preventDefault();
    setSignInPassword(event.target.value);
  }

  async function handleSignIn(event) {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // Sign In logic using signInEmail and signInPassword state
      setErrorMessage('There was an error signing in');
      setLoading(false);
    } catch (err) {
      // Remediation logic
      setErrorMessage('There was an error signing in');
      setLoading(false);
    }
  }

  return(
    <div className="flex flex-col items-center justify-center text-center">
      <div className="lg:w-2/5 md:w-3/5 w-4/5">
        <label className="mt-6">Email address</label>
        <input
          type="email"
          className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          placeholder=""
          value={signInEmail}
          onChange={(e) => handleSignInEmailFieldChange(e)}
        />
        <label className="mt-6">Password</label>
        <input
          type="password"
          className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          placeholder=""
          value={signInPassword}
          onChange={(e) => handleSignInPasswordFieldChange(e)}
        />
        <button
          className={`
            bg-white mt-6 border rounded-xl border-gray-300 p-2 hover:bg-purple-500 hover:text-white
            ${
              loading ? "bg-purple-500 text-white animate-pulse" : ""
            }
          `}
          disabled={loading}
          onClick={handleSignIn}
        >
          Sign In
        </button>
        <p className="text-red-900">
          { errorMessage }
        </p>
      </div>
    </div>
  );
}
```

The styling on the outermost `div` centers and aligns everything in a column. The second `div` puts a width constraint on the fields for different screen sizes. The `label`s are given top margin. The `input` fields are styled with some color around the edges whenever they are in focus. The final `p` containing the `errorMessage` will now show the text in red. Lastly, the `button` is styled to show color whenever it is hovered or focused with some extra styling after it is clicked. The `loading` state is turned on whenever the `button` is clicked inside of `handleSignIn` and turned off again whenever the sign in logic completes. While the page is waiting on the sign in logic, the button will remain colored and also pulse to show that user that something is happening behind the scenes.
