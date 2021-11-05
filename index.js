import tt  from "@tomtom-international/web-sdk-maps";

const apiKey = "gBuQtiHC80qAV541N23tKQYRUtZbAKIH";
var map = tt.map({
  key: apiKey,
  container: "map",
  center: [-121.867905, 37.279518],
  zoom: 9,
  // geopoliticalView: "San Jose, California",
});

tt.LngLat;

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

// Routing with the calculated route api

const getRoute = async ({...params}) => {
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

var startAddress = document.getElementById('start-address'),
  destinationAddress = document.getElement('end-address'),
  arriveTime = document.getElementById('arrival-time'),
  isTruck = document.getElementById('is-truck'),
  explosivesPresent = document.getElementById('explosives-present'),
  gasPresent = document.getElementById('gas-present');

document
  .querySelector(".control-panel__btn")
  .addEventListener("click", function (e) {
    e.preventDefault();

    tt.services.calculateRoute({
        key: apiKey,
        locations: "4.8,52.3:4.87,52.37",
        arriveAt: arriveTime ? arriveTime : null,
        travelMode: isTruck.checked ? "truck" : null,
        vehicleLoadType: [explosivesPresent.value, gasPresent.value],
        vehicleCommercial: true,
      })
      .then(function (routeData) {
        console.log(routeData.toGeoJson());
      });
  });

  new tt.Marker({ element: createMarkerElement("start") })
    .setLngLat(startPoint)
    .addTo(map);

    map.addLayer;

    var bounds = new tt.LngLatBounds();
    geojson.features[0].geometry.coordinates.forEach(function (point) {
      bounds.extend(tt.LngLat.convert(point));
    });
    map.fitBounds(bounds, { duration: 200, padding: 50 });

    Object.entries()
