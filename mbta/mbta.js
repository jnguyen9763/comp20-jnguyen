var stations = {
    "Alewife": {coord: {lat: 42.395428, lng: -71.142483}, stop_id: "place-andrw"},
    "Davis": {coord: {lat: 42.39674, lng: -71.121815}, stop_id: "place-davis"},
    "Porter Square": {coord: {lat: 42.3884, lng: -71.11914899999999}, stop_id: "place-portr"},
    "Harvard Square": {coord: {lat: 42.373362, lng: -71.118956}, stop_id: "place-harsq"},
    "Central Square": {coord: {lat: 42.365486, lng: -71.103802}, stop_id: "place-cntsq"},
    "Kendall/MIT": {coord: {lat: 42.36249079, lng: -71.08617653}, stop_id: "place-knncl"},
    "Charles/MGH": {coord: {lat: 42.361166, lng: -71.070628}, stop_id: "place-chmnl"},
    "Park Street": {coord: {lat: 42.35639457, lng: -71.0624242}, stop_id: "place-pktrm"},
    "Downtown Crossing": {coord: {lat: 42.355518, lng: -71.060225}, stop_id: "place-dwnxg"},
    "South Station": {coord: {lat: 42.352271, lng: -71.05524200000001}, stop_id: "place-sstat"},
    "Broadway": {coord: {lat: 42.342622, lng: -71.056967}, stop_id: "place-brdwy"},
    "Andrew": {coord: {lat: 42.330154, lng: -71.057655}, stop_id: "place-andrw"},
    "JFK/UMass": {coord: {lat: 42.320685, lng: -71.052391}, stop_id: "place-jfk"},
    "North Quincy": {coord: {lat: 42.275275, lng: -71.029583}, stop_id: "place-nqncy"},
    "Wollaston": {coord: {lat: 42.2665139, lng: -71.0203369}, stop_id: "place-wlsta"},
    "Quincy Center": {coord: {lat: 42.251809, lng: -71.005409}, stop_id: "place-qnctr"},
    "Quincy Adams": {coord: {lat: 42.233391, lng: -71.007153}, stop_id: "place-qamnl"},
    "Braintree": {coord: {lat: 42.2078543, lng: -71.0011385}, stop_id: "place-brntn"},
    "Savin Hill": {coord: {lat: 42.31129, lng: -71.053331}, stop_id: "place-shmnl"},
    "Fields Corner": {coord: {lat: 42.300093, lng: -71.061667}, stop_id: "place-fldcr"},
    "Shawmut": {coord: {lat: 42.29312583, lng: -71.06573796000001}, stop_id: "place-smmnl"},
    "Ashmont": {coord: {lat: 42.284652, lng: -71.06448899999999}, stop_id: "place-asmnl"}
};

var stopNames = Object.keys(stations);

var map;
var myLocation;

function initMap() {
    var marker = [];
    var infoWindow = [];
    var stop_id;
    // Displays Google Maps
    map = new google.maps.Map(document.getElementById("map"), {
        center: stations["South Station"]["coord"],
        zoom: 13
    });
    // Creates markers for each station
    for (var i = 0; i < stopNames.length; i++) {
        marker[i] = new google.maps.Marker({title: stopNames[i], position: stations[stopNames[i]]["coord"], map: map, icon: "subway.png"});
        stop_id = stations[stopNames[i]]["stop_id"];
        google.maps.event.addListener(marker[i], "click", (function(marker, infoWindow, stop_id) {
            return function() {
                if (infoWindow != undefined)
                    infoWindow.close();
                infoWindow = new google.maps.InfoWindow();
                getInformation(stop_id, infoWindow, marker.title);
                infoWindow.open(map, marker);
            }
        }(marker[i], infoWindow[i], stop_id)));
    }
    // Draw polyline connecting the stations
    drawPolyline();
    findMyLocation();
}

function getInformation(stationID, infoWindow, stationName) {
    var request = new XMLHttpRequest();
    var url = "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + stationID;
    request.open("get", url, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var arrivalTime, departureTime, direction;
            var data = request.responseText;
            var schedule = JSON.parse(data);
            schedule = schedule["data"];
            var content = "<div class='header'>";
            content += stationName + "</div><table><tr><th>Arrival Time</th><th>Departure Time</th><th>Direction</th></tr>";
            if (schedule.length == 0) {
                content += "<tr><td>Not Available</td><td>Not Available</td><td>Not Available</td></tr>";
            }
            for (var i = 0; i < schedule.length; i++) {
                    arrivalTime = correctInfo(schedule[i]["attributes"]["arrival_time"]);
                    departureTime = correctInfo(schedule[i]["attributes"]["departure_time"]);
                    direction = correctInfo(schedule[i]["attributes"]["direction_id"]);
                    content += "<tr><td>" + arrivalTime + "</td><td>" + departureTime + "</td><td>" + direction + "</td></tr>";
            }
            content += "</table>";
            infoWindow.setContent(content);
        }
        if (request.readyState == 4 && request.status != 200) {
            alert("An error has occured.");
        }
    }
    request.send();
}

function correctInfo(information) {
    if (information == 0)
        return "Ashmont/Braintree";
    else if (information == 1)
        return "Alewife";
    else if (information == null)
        return "Not Available";
    else
        return information.substr(11, 8);
}

function drawPolyline() {
    // Create array of coordinates from Alewife to Braintree
    var AlewifetoBraintree = [];
    for (var i = 0; i < stopNames.length - 4; i++) {
        AlewifetoBraintree[i] = stations[stopNames[i]]["coord"];
    }
    // Create array of coordinates from JFK/UMass to Ashmont
    var JFKtoAshmont = [stations["JFK/UMass"]["coord"], stations["Savin Hill"]["coord"],
    stations["Fields Corner"]["coord"], stations["Shawmut"]["coord"], stations["Ashmont"]["coord"]];
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
    var stationCoord = new google.maps.LatLng(stations[station]["coord"]);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(myCoord, stationCoord);
    var new_distance;

    for (var i = 1; i < stopNames.length; i++) {
        stationCoord = new google.maps.LatLng(stations[stopNames[i]]["coord"]);
        new_distance = google.maps.geometry.spherical.computeDistanceBetween(myCoord, stationCoord);
        if (distance > new_distance) {
            station = stopNames[i];
            distance = new_distance;
        }
    }

    distance *= 0.00062137 * 100;
    distance = Math.round(distance) / 100;
    showNearestStation(stations[station]["coord"]);

    return "<div><span class='bold'>Nearest Station:</span> " + station + "</div><div><span class='bold'>Distance:</span> " + distance + " miles</div>";
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
