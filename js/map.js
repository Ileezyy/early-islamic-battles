// Google Maps init mapTypeId: google.maps.MapTypeId.SATELLITE, 28.467299, 56.240357
var styles = [{
        "elementType": "geometry",
        "stylers": [{
            "color": "#f5f5f5"
        }]
    },
    {
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#616161"
        }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#f5f5f5"
        }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
                "color": "#c0c0c0"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#bdbdbd"
        }]
    },
    {
        "featureType": "administrative.neighborhood",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "administrative.province",
        "stylers": [{
                "color": "#a9a9a9"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [{
            "color": "#ebebeb"
        }]
    },
    {
        "featureType": "poi",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#eeeeee"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#757575"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "color": "#e5e5e5"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#9e9e9e"
        }]
    },
    {
        "featureType": "road",
        "stylers": [{
            "color": "#fff"
        }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#ffffff"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "road.arterial",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#757575"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "color": "#dadada"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#616161"
        }]
    },
    {
        "featureType": "road.local",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#9e9e9e"
        }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#c9c9c9"
        }]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
                "color": "#ffffff"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#9e9e9e"
        }]
    }
];

// Map init
var map = new google.maps.Map(d3.select("#map").node(), {
    zoom: 4.1,
    center: new google.maps.LatLng(29.929316, 40.092853),
    mapTypeControlOptions: {
        mapTypeIds: ['customstyle', google.maps.MapTypeId.SATELLITE]
    },
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
});

map.setOptions({ draggableCursor: "url(https://i.imgur.com/NPPyb1R.png), auto" });
map.setOptions({ draggingCursor: "url(https://i.imgur.com/NPPyb1R.png), auto" });

// Custom style types declaration
var styledMapOptions = {
    name: 'Greyscale'
};

var customStyle = new google.maps.StyledMapType(
    styles, styledMapOptions);

map.mapTypes.set('customstyle', customStyle);
map.setMapTypeId('customstyle');

// Map events
google.maps.event.addListener(map, 'zoom_changed', function() {
    zoomLevel = map.getZoom();
    if (zoomLevel <= 6) {
        var sel = d3.selectAll(".circles")
            .attr("r", 2).style("stroke-width", "1px");
        sel.transition()
            .duration(200);
        $('.labelsNQ').hide();
        $('.labelsK').hide();
    } else if (zoomLevel >= 5 && zoomLevel <= 8) {
        var sel = d3.selectAll(".circles")
            .attr("r", 4).style("stroke-width", "2px");
        sel.transition()
            .duration(200)
        $('.labelsNQ').hide();
        $('.labelsK').hide();
    } else if (zoomLevel >= 8) {
        var sel = d3.selectAll(".circles")
            .attr("r", 7).style("stroke-width", "3px");
        sel.transition()
            .duration(200);
        $('.labelsNQ').show();
        $('.labelsK').show();
    }
});

google.maps.event.addListener(map, 'maptypeid_changed', function() {
    var typeid = map.getMapTypeId();
    if (typeid == 'customstyle') {
        console.log("IT'S CUSTOm");
        d3.selectAll("text").style("fill", "black")
        d3.selectAll(".circleK").style("fill", "#008eff").style("stroke", "white");
        d3.selectAll(".circleNQ").style("fill", "black").style("stroke", "white");
        $(".kencircle").css("background", "#008eff").css("border", "1px solid white");
        $(".nqcircle").css("background", "black").css("border", "1px solid white");
        $(".controls").css("color", "black");
    } else if (typeid == "satellite") {
        console.log("IT'S SATELLITE");
        d3.selectAll("text").style("fill", "white")
        d3.selectAll(".circleK").style("fill", "white").style("stroke", "#008eff");
        d3.selectAll(".circleNQ").style("fill", "white").style("stroke", "black");
        $(".kencircle").css("background", "white").css("border", "1px solid #008eff");
        $(".nqcircle").css("background", "white").css("border", "1px solid black");
        $(".controls").css("color", "white");
    }
});