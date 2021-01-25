```javascript
<TextField
  onKeyDown={(e) => (
    e.keyCode === 13 ? enterKeyPressedReaction(e) : null
  )}
/>
```