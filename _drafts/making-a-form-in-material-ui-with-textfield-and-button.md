

```javascript
<TextField id="filled-basic" label="Email" variant="filled" onChange={(e) => this.handleTravelBuddyTextFieldChange(e)} />
<Button
  variant="contained"
  startIcon={<AddIcon />}
  onClick={(e) => this.addTravelPartner(e)}
>
```

```javascript
handleTravelBuddyTextFieldChange(event) {
  this.setState({
    travelPartnerTextField: event.target.value,
  });
}

async addTravelPartner(event) {
  event.preventDefault();
  const { mapId, travelPartnerTextField } = this.state;
  const updates = {
    mapId,
    writers: {
      push: travelPartnerTextField,
    },
  };

  const {
    updateMap: {
      writers: success,
    },
  } = await fetcher(addTravelPartnerMutation, { map: updates });
  if (!success) return;

  this.componentDidMount();
}
```
