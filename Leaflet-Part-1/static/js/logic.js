// 
var mapBackGround = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


var map = L.map("map", {
  center: [36.1749700, -115.1372200],
  zoom: 3
});

mapBackGround.addTo(map);
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (earthquakeData) {
var legend = L.control({
  position: "topleft"
});


legend.onAdd = function () {
  let container = L.DomUtil.create("div", "info legend");

  depths = [90, 70, 50, 30, 10, -10];
  //  colours= ["darkred","red","orange","yellow","yellowgreen","green"];
  colours = ["#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"];

   container.innerHTML += "<p><b>Depth</b></p>"

  for (var i = 0; i < depths.length; i++) {
    // console.log("LOOP", depths[i], colours[i]);
    // container.innerHTML += "<i style= 'background:" + colours[i] + "'> </i>
    //     <span>" + depths[i] +"</span>"

    container.innerHTML += "<i style='background: "
      + colours[i]
      + "'></i> "
      + depths[i]
      + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");


  }

  return container;

};

legend.addTo(map);


function createCircleColor(depth) {
  if (depth > 90) {
    return "darkred";
  } else if (depth > 70) {
    return "red";
  } else if (depth > 50) {
    return "orange";
  } else if (depth > 30) {
    return "yellow";
  } else if (depth > 10) {
    return "yellowgreen"
  } else {
    return "green"
  }
};

function createStyle(feature) {
  return {
    opacity: .55,
    color: "black",
    weight: 0.1,
    fillColor: createCircleColor(feature["geometry"]
    ["coordinates"][2]),
    radius: feature.properties.mag * 7
  }
};

  L.geoJson(earthquakeData, {
    pointToLayer: function (feature, coordinates) {
      return L.circleMarker(coordinates).bindPopup(("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<h4> Magnitude: " + feature.properties.mag +"</h4>"))
    },
    style: createStyle
  }).addTo(map);
});

