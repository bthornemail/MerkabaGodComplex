// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;

function initMap() {
  const sydney = new google.maps.LatLng(34.0023538,-118.3670356);
const Westside  = new google.maps.LatLngBounds [
    google.maps.LatLngBounds
]
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 14
  });

  const request = {
    query: "Hamburger",
    fields: ["name", "geometry"],
    radius: 8.67,
    location: sydney,
    type: [
        'restaurant',
        'bakery',
        'cafe',
        'liquor_store',
        'meal_delivery',
        'meal_takeaway',
        // 'store',
        // 'supermarket'
    ]
  };

  service = new google.maps.places.PlacesService(map);
//   service.findPlaceFromQuery(request, (results, status) => {
//     console.log(results)
//     console.log(status)
//     if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//       for (let i = 0; i < results.length; i++) {
//         createMarker(results[i]);
//       }

//       map.setCenter(results[0].geometry.location);
//     }
//   });
  service.textSearch(request, callback);
}


function callback(results, status) {

    console.log(results)
    console.log(status)
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
   
    }
  }
function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

window.initMap = initMap;
