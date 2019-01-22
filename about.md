---
layout: page
title: About Me
comments: true
---

Howdy. I am a computer engineering major and German minor studying at Texas A&M University. I like to travel, learn languages, and program. I spent a year living in Germany when I was a junior in high school where I became fluent in Germany and traveled all over Europe. One of my goals is to travel to every continent. I am also a software developer. I am planning on updating this site so that I can translate what I am learning into my own words. [Here is a tweet that I find interesting about this.](https://twitter.com/swyx/status/1009174159690264579)
Below is a map showing the countries that I have traveled to that I made at [this website](https://www.amcharts.com/visited_countries/#AT,CZ,FR,DE,HU,IT,NL,PL,SK,BS,TC,US,AR). I would also like to include my social media accounts. You can find my [Instagram here](https://www.instagram.com/tmoneyfish/) and my [Twitter here](https://twitter.com/tmoneyfish). I am not too active on either, but I have some posts about my travels.
<script src="https://www.amcharts.com/lib/3/ammap.js" type="text/javascript"></script>
<script src="https://www.amcharts.com/lib/3/maps/js/worldHigh.js" type="text/javascript"></script>
<script src="https://www.amcharts.com/lib/3/themes/dark.js" type="text/javascript"></script>
<div id="mapdiv" style="width: 1000px; height: 450px;"></div>
<div style="width: 1000px; font-size: 70%; padding: 5px 0; text-align: center; background-color: #535364; margin-top: 1px; color: #B4B4B7;"><a href="https://www.amcharts.com/visited_countries/" style="color: #B4B4B7;">Create your own visited countries map</a> or check out the <a href="https://www.amcharts.com/" style="color: #B4B4B7;">JavaScript Charts</a>.</div>
<script type="text/javascript">
var map = AmCharts.makeChart("mapdiv",{
    type: "map",
    theme: "dark",
    projection: "mercator",
    panEventsEnabled : true,
    backgroundColor : "#535364",
    backgroundAlpha : 1,
    zoomControl: {
    zoomControlEnabled : true
    },
    dataProvider : {
    map : "worldHigh",
    getAreasFromMap : true,
    areas :
    [
        {
            "id": "AT",
            "showAsSelected": true
        },
        {
            "id": "CZ",
            "showAsSelected": true
        },
        {
            "id": "FR",
            "showAsSelected": true
        },
        {
            "id": "DE",
            "showAsSelected": true
        },
        {
            "id": "HU",
            "showAsSelected": true
        },
        {
            "id": "IT",
            "showAsSelected": true
        },
        {
            "id": "NL",
            "showAsSelected": true
        },
        {
            "id": "PL",
            "showAsSelected": true
        },
        {
            "id": "SK",
            "showAsSelected": true
        },
        {
            "id": "BS",
            "showAsSelected": true
        },
        {
            "id": "TC",
            "showAsSelected": true
        },
        {
            "id": "US",
            "showAsSelected": true
        },
        {
            "id": "AR",
            "showAsSelected": true
        }
    ]
    },
    areasSettings : {
    autoZoom : true,
    color : "#B4B4B7",
    colorSolid : "#84ADE9",
    selectedColor : "#84ADE9",
    outlineColor : "#666666",
    rollOverColor : "#9EC2F7",
    rollOverOutlineColor : "#000000"
    }
});
</script>