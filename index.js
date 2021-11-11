import tt from "@tomtom-international/web-sdk-maps";
import tt, { services } from "@tomtom-international/web-sdk-services";

// Routing with the calculated route api

const getRoute = async ({ ...params }) => {
  const {} = params;

  const URL = `https://api.tomtom.com/routing/1/calculateRoute/52.50931,13.42936:52.50274,13.43872/json?instructionsType=tagged&language=en-US&routeType=fastest&traffic=true&avoid=unpavedRoads&vehicleCommercial=true&key=${apiKey}`;

  try {
    const req = await fetch(URL);
    const data = await req.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

// sdk
const apiKey = "gBuQtiHC80qAV541N23tKQYRUtZbAKIH";

var map = tt.map({
  key: apiKey,
  container: "map",
  // center: {lon: -121.867905, lat: 37.279518},
  center: [4.8786, 52.3679],
  zoom: 10,
  // geopoliticalView: "San Jose, California",
});

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

// sdk

var startAddress = document.getElementById("start-address"),
  destinationAddress = document.getElementById("end-address"),
  arriveTime = document.getElementById("arrival-time"),
  isTruck = document.getElementById("is-truck"),
  explosivesPresent = document.getElementById("explosives-present"),
  gasPresent = document.getElementById("gas-present");

function createMarkerElement(type) {
  var element = document.createElement("div");
  var innerElement = document.createElement("div");

  element.className = "route-marker";
  innerElement.className = "icon tt-icon -white -" + type;
  element.appendChild(innerElement);
  return element;
}

function addMarkers(feature) {
  var startPoint, endPoint;
  if (feature.geometry.type === "MultiLineString") {
    startPoint = feature.geometry.coordinates[0][0]; //get first point from first line
    endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0]; //get last point from last line
  } else {
    startPoint = feature.geometry.coordinates[0];
    endPoint = feature.geometry.coordinates.slice(-1)[0];
  }

  new tt.Marker({ element: createMarkerElement("start") })
    .setLngLat(startPoint)
    .addTo(map);
  new tt.Marker({ element: createMarkerElement("finish") })
    .setLngLat(endPoint)
    .addTo(map);
}

function findFirstBuildingLayerId() {
  var layers = map.getStyle().layers;
  for (var index in layers) {
    if (layers[index].type === "fill-extrusion") {
      return layers[index].id;
    }
  }

  throw new Error(
    "Map style does not contain any layer with fill-extrusion type."
  );
}

function callbackFn(result) {
  console.log(result);
}
document
  .querySelector(".control-panel__btn")
  .addEventListener("click", function (e) {
    e.preventDefault();

    let startCordinates, endCordinates;

    services
      .fuzzySearch({
        key: apiKey,
        query: `${startAddress.value}`,
        lon: 4.8786,
        lat: 52.3679,
      })
      .then((search) => {
        startCordinates = search.results[0].position;
        console.log(startCordinates);
      });

    services
      .fuzzySearch({
        key: apiKey,
        query: `${destinationAddress.value}`,
        lon: 4.8786,
        lat: 52.3679,
      })
      .then((search) => {
        endCordinates = search.results[0].position;
        console.log(endCordinates);
      });

    function getRoute() {
      services
        .calculateRoute({
          key: apiKey,
          locations: `${JSON.stringify(startCordinates)}:${JSON.stringify(
            endCordinates
          )}`,
          // locations: `${startCordinates.lon}${startCordinates.lat}:${endCordinates.lon}${endCordinates.lat}`,
          // arriveAt: arriveTime ? arriveTime : null,
          travelMode: isTruck.value ?? null,
          vehicleLoadType: [explosivesPresent.value, gasPresent.value],
          vehicleCommercial: true,
        })
        .then(function (response) {
          console.log(response.toGeoJson());
          var geojson = response.toGeoJson();
          map.addLayer(
            {
              id: "route",
              type: "line",
              source: {
                type: "geojson",
                data: geojson,
              },
              paint: {
                "line-color": "#4a90e2",
                "line-width": 8,
              },
            },
            findFirstBuildingLayerId()
          );

          addMarkers(geojson.features[0]);

          var bounds = new tt.LngLatBounds();
          geojson.features[0].geometry.coordinates.forEach(function (point) {
            bounds.extend(tt.LngLat.convert(point)); // creates a bounding area
          });
          map.fitBounds(bounds, {
            duration: 200,
            padding: 50,
            maxZoom: 10,
          }); // zooms the map to the searched route
        });
    }

    setTimeout(getRoute, 5000);
  });

// admin key
const adminkey = "8QfxMVRZI6hkZjSRLeobFHEjsCMYlcnHLjQUR826aPXTaoMt";

//  generate admin-key for location history
var requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    secret: "victor-maps",
  },
  redirect: "follow",
};

fetch(
  "https://api.tomtom.com/locationHistory/1/register?&key=gBuQtiHC80qAV541N23tKQYRUtZbAKIH",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));

// register admin-key for geofencing
var requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    secret: "victor-maps",
  },
  redirect: "follow",
};

fetch(
  "https://api.tomtom.com/geofencing/1/register?&key=gBuQtiHC80qAV541N23tKQYRUtZbAKIH",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));

// create projects for geofencing
var requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    name: "Construction Sites",
  },
  redirect: "follow",
};

fetch(
  "https://api.tomtom.com/geofencing/1/projects/project?adminKey=8QfxMVRZI6hkZjSRLeobFHEjsCMYlcnHLjQUR826aPXTaoMt&key=gBuQtiHC80qAV541N23tKQYRUtZbAKIH",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));

/**
   * response
   * {
	"id": "85f9788d-eb57-4843-9961-13c3e7dddb14",
	"name": "Construction Sites"
}*/

// create object for geofencing

var myHeaders = new Headers();
myHeaders.append("key", "gBuQtiHC80qAV541N23tKQYRUtZbAKIH");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  name: "Truck 1",
  defaultProject: "85f9788d-eb57-4843-9961-13c3e7dddb14",
  properties: {
    maxSpeedKmh: 70,
    driver: "John Doe",
  },
});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: JSON.stringify({
    name: "Truck 1",
    defaultProject: "85f9788d-eb57-4843-9961-13c3e7dddb14",
    properties: {
      maxSpeedKmh: 70,
      driver: "John Doe",
    },
  }),
  redirect: "follow",
};

fetch(
  "https://api.tomtom.com/geofencing/1/objects/object?adminKey=8QfxMVRZI6hkZjSRLeobFHEjsCMYlcnHLjQUR826aPXTaoMt\n&key=gBuQtiHC80qAV541N23tKQYRUtZbAKIH",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));

// creating fence

function createFence(name, longitude, latitude) {
  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      type: "Feature",
      geometry: {
        radius: 70,
        type: "Point",
        shapeType: "Circle",
        coordinates: [longitude, latitude],
      },
    }),
    redirect: "follow",
  };

  fetch(
    "https://api.tomtom.com/geofencing/1/projects/85f9788d-eb57-4843-9961-13c3e7dddb14/fence?adminKey=8QfxMVRZI6hkZjSRLeobFHEjsCMYlcnHLjQUR826aPXTaoMt&key=gBuQtiHC80qAV541N23tKQYRUtZbAKIH",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error));
}

const fence = {
  id: "fff20eea-1b38-463e-a1b5-f80f825e0bee",
  name: "roseville",
};

// list fences

fetch(
  "https://api.tomtom.com/geofencing/1/projects/85f9788d-eb57-4843-9961-13c3e7dddb14/fences?key=gBuQtiHC80qAV541N23tKQYRUtZbAKIH"
)
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
