var stations = {
    "Alewife": {lat: 42.395428, lng: -71.142483},
    "Davis": {lat: 42.39674, lng: -71.121815},
    "Porter Square": {lat: 42.3884, lng: -71.11914899999999},
    "Harvard Square": {lat: 42.373362, lng: -71.118956},
    "Central Square": {lat: 42.365486, lng: -71.103802},
    "Kendall/MIT": {lat: 42.36249079, lng: -71.08617653},
    "Charles/MGH": {lat: 42.361166, lng: -71.070628},
    "Park Street": {lat: 42.35639457, lng: -71.0624242},
    "Downtown Crossing": {lat: 42.355518, lng: -71.060225},
    "South Station": {lat: 42.352271, lng: -71.05524200000001},
    "Broadway": {lat: 42.342622, lng: -71.056967},
    "Andrew": {lat: 42.330154, lng: -71.057655},
    "JFK/UMass": {lat: 42.320685, lng: -71.052391},
    "North Quincy": {lat: 42.275275, lng: -71.029583},
    "Wollaston": {lat: 42.2665139, lng: -71.0203369},
    "Quincy Center": {lat: 42.251809, lng: -71.005409},
    "Quincy Adams": {lat: 42.233391, lng: -71.007153},
    "Braintree": {lat: 42.2078543, lng: -71.0011385},
    "Savin Hill": {lat: 42.31129, lng: -71.053331},
    "Fields Corner": {lat: 42.300093, lng: -71.061667},
    "Shawmut": {lat: 42.29312583, lng: -71.06573796000001},
    "Ashmont": {lat: 42.284652, lng: -71.06448899999999},
};

var stopNames = Object.keys(stations);

var map;
var myLocation;

function initMap() {
    var marker = [];
    var infoWindow = [];
    // Displays Google Maps
    map = new google.maps.Map(document.getElementById("map"), {
        center: stations["South Station"],
        zoom: 13
    });
    // Creates markers for each station
    for (var i = 0; i < stopNames.length; i++) {
        marker[i] = new google.maps.Marker({position: stations[stopNames[i]], map: map, icon: "subway.png"});
        google.maps.event.addListener(marker[i], "click", (function(marker, infoWindow, content) {
            return function() {
                if (infoWindow != undefined)
                    infoWindow.close();
                infoWindow = new google.maps.InfoWindow();
                infoWindow.setContent(content);
                infoWindow.open(map, marker);
            }
        }(marker[i], infoWindow[i], stopNames[i])));
    }
    // Draw polyline connecting the stations
    drawPolyline();
    findMyLocation();
}

function drawPolyline() {
    // Create array of coordinates from Alewife to Braintree
    var AlewifetoBraintree = [];
    for (var i = 0; i < stopNames.length - 4; i++) {
        AlewifetoBraintree[i] = stations[stopNames[i]];
    }
    // Create array of coordinates from JFK/UMass to Ashmont
    var JFKtoAshmont = [stations["JFK/UMass"], stations["Savin Hill"],
    stations["Fields Corner"], stations["Shawmut"], stations["Ashmont"]];
    // Combine the two arrays
    var allStations = [AlewifetoBraintree, JFKtoAshmont];
    // For each array, draw a polyline connecting all the stations
    for (var k = 0; k < allStations.length; k++) {
        var polylinePath = new google.maps.Polyline({
            path: allStations[k],
            strokeWeight: 2,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0
        });
        polylinePath.setMap(map);
    }
}

function findMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            myLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
        showMyLocation();
        });
    }
    else {
        alert("Geolocation is not support.");
    }
}

function showMyLocation() {
    var infoWindow;
    map.panTo(myLocation);
    var marker = new google.maps.Marker({position: myLocation, map: map, icon: "person.png"});
    google.maps.event.addListener(marker, "click", (function(marker, infoWindow) {
        return function() {
            if (infoWindow != undefined)
                infoWindow.close();
            infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent(findNearestStation());
            infoWindow.open(map, marker);
        }
    }(marker, infoWindow)));
}

function findNearestStation() {
    var station = stopNames[0];
    var myCoord = new google.maps.LatLng(myLocation);
    var stationCoord = new google.maps.LatLng(stations[station]);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(myCoord, stationCoord);
    var new_distance;

    for (var i = 1; i < stopNames.length; i++) {
        stationCoord = new google.maps.LatLng(stations[stopNames[i]]);
        new_distance = google.maps.geometry.spherical.computeDistanceBetween(myCoord, stationCoord);
        if (distance > new_distance) {
            station = stopNames[i];
            distance = new_distance;
        }
    }

    distance *= 0.00062137;
    showNearestStation(stations[station]);

    return "<p>Nearest Station: " + station + "</p><p>Distance: " + distance + " miles</p>";
}

function showNearestStation(station) {
    var polylinePath = new google.maps.Polyline({
        path: [myLocation, station],
        strokeWeight: 2,
        strokeColor: "#000000",
        strokeOpacity: 1.0
    });
    polylinePath.setMap(map);
}
