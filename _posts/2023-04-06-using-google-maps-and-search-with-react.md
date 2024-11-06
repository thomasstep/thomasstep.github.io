---
layout: post
title:  "Using Google Maps and Search with React"
author: Thomas
tags: [ dev, front end, javascript ]
description: Adding Google Maps to a React app
---

When I started remaking [Elsewhere](https://elsewhere.thomasstep.com/) I knew I wanted to refresh the map. The first version of Elsewhere used a third part React component that helped render Google Maps. It was fine but a few features were missing and it was not actively developed. When I started thinking of other options, I was going to switch over to Mapbox. They seem to have a clean, first-party React component that's ready to use. Fast forward to putting my hands on the keyboard ready to code, and I searched for something that lead me to a [first-party Google Maps React component](https://github.com/googlemaps/react-wrapper). This post will be about working with the `@googlemaps/react-wrapper` component, showing some code built around/with it, and hopefully giving others a good jumping-off point for integrating Google Maps into their applications.

First things first, you will need an API key to use this component. Google Maps isn't free. Go to the [Google Developer console](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjjveOdwpb-AhWtmmoFHeW5DsgQFnoECAsQAQ&url=https%3A%2F%2Fconsole.cloud.google.com%2F&usg=AOvVaw1GxwHR1WZnDu0xsR-djCrv) to create an API key. There is [documentation online](https://developers.google.com/maps/documentation/javascript/get-api-key) to help get all this set up. A word to the wise, you will have to set up billing with a credit card, so make sure to restrict your API key(s).

After we have our API key, we're ready to jump into code. Assuming you already have the package installed and ready to go, you will need to set up two components before seeing anything on the screen. The `@googlemaps/react-wrapper` component really only handles the Javascript of downloading and making the Google Maps API available. You still need to load it. For now, let's assume the API is loaded and available, let's build a map.

There are a few things I want to go over before showing the code for this since there are a few "gotchas" with how all this works. Google Maps uses `ref`s to grab onto elements and render the map, which means we'll need React's `useRef`. We will be passing the [Map's options](https://developers.google.com/maps/documentation/javascript/reference/map#Map.setOptions) as a deeply nested object (as seen in the [API docs](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions)), so we will need to write a custom hook since React does not do deep comparisons. Lastly, event listeners function differently on Maps than how they would on normal elements, so we will need to manually clear and re-add those listeners if the props ever change while the Map is rendered.

Without further ado, here is a `Map` component.

```jsx
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { createCustomEqual } from 'fast-equals';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) => {
  if (
    isLatLngLiteral(a)
    // eslint-disable-next-line no-undef
    || a instanceof google.maps.LatLng
    // eslint-disable-next-line no-undef
    || b instanceof google.maps.LatLng
  ) {
    // eslint-disable-next-line no-undef
    return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
  }
  // TODO extend to other types
  // use fast-equals for other objects
  return deepEqual(a, b);
});

function useDeepCompareMemoize(value) {
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

function useDeepCompareEffectForMaps(callback, dependencies) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

function Map({
  bounds,
  onClick,
  onIdle,
  children,
  style,
  ...options
}) {
  const mapRef = useRef(null);
  const [map, setMap] = useState();

  // Setup map
  useEffect(() => {
    if (mapRef.current && !map) {
      // eslint-disable-next-line no-undef
      const newMap = new window.google.maps.Map(mapRef.current, {});

      setMap(newMap);

      if (bounds) {
        newMap.fitBounds(bounds);
      }
    }
  }, [mapRef, map]);

  // Because React does not do deep comparisons, a custom hook is used
  // See discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      // Something similar can be done with any other listener that is added to the map
      // eslint-disable-next-line no-undef
      ['click', 'idle'].forEach((eventName) => google.maps.event.clearListeners(map, eventName));
      if (onClick) {
        map.addListener('click', onClick);
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds);
    }
  }, [map, bounds]);

  return (
    <>
      <div ref={mapRef} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
        return null;
      })}
    </>
  );
}

Map.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  bounds: PropTypes.object,
  onClick: PropTypes.func,
  onIdle: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node).isRequired,
    PropTypes.node.isRequired,
  ]),
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object.isRequired,
};

Map.defaultProps = {
  bounds: null,
  onClick: () => {},
  onIdle: () => {},
  children: null,
};

export default Map;
```

[Here](https://github.com/googlemaps/js-samples/blob/c1036e60d2f50056fba1617a1be507b00b6cac5a/dist/samples/react-map/docs/index.jsx) is another version of that code.

The next step before we can see the `Map` being rendered is to wrap it. This is the not-as-glamorous part, which is why I saved it until after the flashy component. You probably noticed the `// eslint-disable-next-line no-undef` comment littered throughout the component. That's because we are assuming that `google` is out there somewhere on the document and we can grab it out of the ether. If we don't wrap the `Map` component, then it won't be there and we get errors galore.

To wrap and render the `Map` component we need to do something like this.

```jsx
const loadingRender = (status) => {
  switch (status) {
    case Status.LOADING:
      return <LoadingPage />;
    case Status.FAILURE:
      return <LoadingPage />;
    case Status.SUCCESS:
      return <LoadingPage />;
    default:
      return <LoadingPage />;
  }
};

...

<Wrapper
  apiKey={yourApiKey}
  render={loadingRender}
  libraries={['places']}
>
  <Map yourProps={goHere}/>
</Wrapper>
```

The `loadingRender` function assumes you have a `LoadingPage` component, otherwise, you can exclude `render={loadingRender}`. You will need to read `yourApiKey` from somewhere...up to you. And `libraries={['places']}` also loads the additional [Google Maps Places library](https://developers.google.com/maps/documentation/javascript/places), so if you are not using that library feel free to exclude that prop.

Once that wrapped `Map` is rendered, you should see a map! Wow.

To the astute observers, you probably noticed something funky going on in the `Map` component related to the `children`. The reason is that a Google Map doesn't really accept children but we can add additional decoration to the map which one might believe are children. Particularly markers. Adding a simple map isn't that much fun, now we have to draw something on it.

Markers are easy to render compared to maps. No refs, but we still need to baby the listeners and options.

```jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function Marker({
  onClick,
  onDragEnd,
  ...options
}) {
  const [marker, setMarker] = useState();
  const [clickListener, setClickListener] = useState();
  const [dragEndListener, setDragEndListener] = useState();

  useEffect(() => {
    if (!marker) {
      // eslint-disable-next-line no-undef
      const newMarker = new google.maps.Marker();
      const clk = newMarker.addListener('click', (e) => {
        onClick(e);
      });
      setClickListener(clk);
      const de = newMarker.addListener('dragend', (e) => {
        const lat = newMarker.position.lat();
        const lng = newMarker.position.lng();
        onDragEnd(e, lat, lng);
      });
      setDragEndListener(de);
      setMarker(newMarker);
    }

    // Remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
        // eslint-disable-next-line no-undef
        google.maps.event.removeListener(clickListener);
        // eslint-disable-next-line no-undef
        google.maps.event.removeListener(dragEndListener);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  // This effect updates click listeners by removing the old
  //  one and adding a new one
  useEffect(() => {
    if (marker && clickListener) {
      // eslint-disable-next-line no-undef
      google.maps.event.removeListener(clickListener);
      const clk = marker.addListener('click', (e) => {
        onClick(e);
      });
      setClickListener(clk);
    }
  }, [marker, onClick]);
  return null;
}

Marker.propTypes = {
  onClick: PropTypes.func,
  onDragEnd: PropTypes.func,
};

Marker.defaultProps = {
  onClick: () => {},
  onDragEnd: () => {},
};

export default Marker;
```

One additional piece to note, the `onDragEnd` function is one passed in if you are storing and updating the locations of the `Marker`s being drawn. Otherwise, you can remove that piece. It took me an untrivial amount of time to get working which is why I left it. You will also need to add the `draggable` prop on the `Marker` to get passed into the `options`. It might look something like this.

{% raw %}
```jsx
<Wrapper
  apiKey={yourApiKey}
  render={loadingRender}
  libraries={['places']}
>
  <Map yourProps={goHere}>
    <Marker
      position={{
        lat: 21.126227,
        lng: -11.404002,
      }}
      draggable
      onDragEnd={(e, lat, lng) => {
        // Do something with lat/lng
      }}
    />
  </Map>
</Wrapper>
```
{% endraw %}

It's also possible to add some level of customization to a `Marker` by changing the icon in the middle of the bubble. Google has something called advanced markers, but when I was looking into them they didn't seem well-featured. Maybe by the time you're reading this, they will be ready for production and you can style markers even further.

{% raw %}
```jsx
<Wrapper
  apiKey={yourApiKey}
  render={loadingRender}
  libraries={['places']}
>
  <Map yourProps={goHere}>
    <Marker
      position={{
        lat: 21.126227,
        lng: -11.404002,
      }}
      draggable
      onDragEnd={(e, lat, lng) => {
        // do something with lat/lng
      }}
      label={{
        text: '\ue145',
        fontFamily: 'Material Icons',
        color: '#ffffff',
        fontSize: '18px',
      }}
    />
  </Map>
</Wrapper>
```
{% endraw %}

Of course, doing this means that you will need to have the Material Icons font downloaded somewhere on your page, like in the `<head>` of your document. Something like this should do the trick.

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
```

The final piece that I wanted to mention is the Places API that I briefly mentioned earlier in the `Wrapper`. If you do load this API, then you can add searching to your map. You'll need some sort of input ref to attach the library to and then you can set the search context based on locations that the map is positioned over. For ease of example, I'm going to add this into the `Map` component. In the `Map` component, you will need to add two `useEffect` hooks and add an `<input>` to the render.

```jsx
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [autocompleteWidget, setAutocompleteWidget] = useState();

  // Setup autocomplete
  useEffect(() => {
    if (inputRef.current && !autocompleteWidget) {
      // eslint-disable-next-line no-undef
      const acw = new google.maps.places.Autocomplete(inputRef.current);
      autocompleteRef.current = acw;
      setAutocompleteWidget(acw);
    }
  }, [inputRef, autocompleteWidget]);

  // Additional map-dependent autocomplete setup
  // This is where searches are clicked
  useEffect(() => {
    if (map && autocompleteWidget) {
      autocompleteWidget.bindTo('bounds', map);
      autocompleteWidget.addListener('place_changed', () => {
        const place = autocompleteWidget.getPlace();

        if (!place.geometry || !place.geometry.location) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          // window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }

        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        // What you do know is up to you
        // You could use state to draw another Marker at this location
        // Or anything else really. The beauty of programming I guess.
      });
    }
  }, [map, autocompleteWidget]);
```

And just like that, all my knowledge on this subject has been transferred. We've rendered a map, drawn markers on the map, and added a search box. Pretty nifty. That's hours of my life right there, so put it to good use, please.
