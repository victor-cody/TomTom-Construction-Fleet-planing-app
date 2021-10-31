import tt from "@tomtom-international/web-sdk-maps";

var map = tt.map({
  key: "gBuQtiHC80qAV541N23tKQYRUtZbAKIH",
  container: "map",
  center: [-121.867905, 37.279518],
  zoom: 9,
  // geopoliticalView: "San Jose, California",
});

tt.LngLat;

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

// Routing with the calculated route api

const getRoute = async ({ ...params }) => {
  const {} = params;
};
