var map, infoWindow;
var incidentIcons = defineIconPaths();

function loadReportIncidentPage() {
    initMap();
    initAutocomplete();
}

function initMap() {
    var location = {
        lat: 53.418354,
        lng: -7.903726
    };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: location
    });

    google.maps.event.addListener(map, 'click', function (event) {
        reportNewIncidentOnMarker(event.latLng.lat(), event.latLng.lng());
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

/*
            infoWindow = new google.maps.InfoWindow;
            infoWindow.setPosition(pos);
            infoWindow.setContent('Your Location');
            infoWindow.open(map);*/
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow
            .setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.'
                : 'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('autocomplete').value;
    if (address) {
        console.log("address: " + address);
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: '
                    + status);
            }
        });
    }
}

// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete')), {
            types: ['geocode']
        });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

//added
var place;

function fillInAddress() {
    // Get the place details from the autocomplete object.

    //changed
    place = autocomplete.getPlace();

    for (var component in componentForm) {
        document.getElementById(component).value = '';
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }

    }
    syncMapWithAddress();
}

//added
var currLat, currLng;

// Function to use the the browser's 'navigator.geolocation' object to get current location of user
function geolocate() {
    if (navigator.geolocation) {

        //added

        navigator.geolocation.getCurrentPosition(function (position) {
            currLat = position.coords.latitude;
            currLng = position.coords.longitude;

            var geolocation = {
                //changed
                lat: currLat,
                lng: currLng
            };

            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

function syncMapWithAddress() {
    if (map) {
        var geocoder = new google.maps.Geocoder();
        geocodeAddress(geocoder, map);
    }
}

function defineIconPaths() {
    var iconBasePath = 'mapicons/';
    return [
        iconBasePath + 'burning-car.png',
        iconBasePath + 'semaphore.png',
        iconBasePath + 'street-light.png',
        iconBasePath + 'theft.png',
        iconBasePath + 'robbery.png',
        iconBasePath + 'road-work.png'
    ];
}

function plotIncident(incident) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(incident.latitude, incident.longitude),
        icon: incidentIcons[incident.type.id],
        map: map
    });
    infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContentForIncident(incident)
    });
    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });
}

function plotIncidents(incidents) {
    $.each(incidents, function (index, incident) {
        plotIncident(incident);
    });
}

function createInfoWindowContentForIncident(incident) {
    // ` denotes JavaScript ECMA 6 template string
    var content =
        `<div>` +
        `    <div>` +
        `        ${incident.type.description} incident <br/>` +
        `        ${incident.image} <br/>` +
        `        ${incident.message} <br/>` +
        `        ${incident.date}` +
        `    </div>` +
        `</div>`;
    return content;
}


function reportNewIncidentOnMarker(latitude, longitude) {
    infoWindow.close();
    $(function () {
        $("#newIncidentForm").dialog({
            modal: true,
            resizable: true,
            show: 'blind',
            hide: 'blind',
            width: 400,
            dialogClass: 'ui-dialog-osx',
            buttons: {
                "Report": function() {
                    saveIncident(latitude, longitude);
                    $(this).dialog("close");
                },
                "Close": function() {
                    $(this).dialog('close');
                }
            }
        });
    });

}