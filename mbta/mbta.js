var stations = {
    "South Station": {lat: 42.352271, lng: -71.05524200000001},
    "Andrew": {lat: 42.330154, lng: -71.057655},
    "Porter Square": {lat: 42.3884, lng: -71.11914899999999},
    "Harvard Square": {lat: 42.373362, lng: -71.118956},
    "JFK/UMass": {lat: 42.320685, lng: -71.052391},
    "Savin Hill": {lat: 42.31129, lng: -71.053331},
    "Park Street": {lat: 42.35639457, lng: -71.0624242},
    "Broadway": {lat: 42.342622, lng: -71.056967},
    "North Quincy": {lat: 42.275275, lng: -71.029583},
    "Shawmut": {lat: 42.29312583, lng: -71.06573796000001},
    "Davis": {lat: 42.39674, lng: -71.121815},
    "Alewife": {lat: 42.395428, lng: -71.142483},
    "Kendall/MIT": {lat: 42.36249079, lng: -71.08617653},
    "Charles/MGH": {lat: 42.361166, lng: -71.070628},
    "Downtown Crossing": {lat: 42.355518, lng: -71.060225},
    "Quincy Center": {lat: 42.251809, lng: -71.005409},
    "Quincy Adams": {lat: 42.233391, lng: -71.007153},
    "Ashmont": {lat: 42.284652, lng: -71.06448899999999},
    "Wollaston": {lat: 42.2665139, lng: -71.0203369},
    "Fields Corner": {lat: 42.300093, lng: -71.061667},
    "Central Square": {lat: 42.365486, lng: -71.103802},
    "Braintree": {lat: 42.2078543, lng: -71.0011385},
};

function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 42.352271, lng: -71.05524200000001},
        zoom: 10
    });
}
