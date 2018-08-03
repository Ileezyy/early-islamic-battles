jQuery.event.special.touchstart = {
    setup: function(_, ns, handle) {
        if (ns.includes("noPreventDefault")) {
            this.addEventListener("touchstart", handle, { passive: false });
        } else {
            this.addEventListener("touchstart", handle, { passive: true });
        }
    }
};

// Google Maps init mapTypeId: google.maps.MapTypeId.SATELLITE, 28.467299, 56.240357
var styles = {
    default: [{
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "administrative",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [{
                    "color": "#d6d6d6"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "road",
            "stylers": [{
                "visibility": "off"
            }]
        }
    ],
    grey: [{
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "administrative",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [{
                    "color": "#d6d6d6"
                },
                {
                    "visibility": "on"
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
            "featureType": "road",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#ffffff"
            }]
        }
    ]
};

// Map init 
// mapTypeControlOptions: {
//     mapTypeIds: ['customstyle', 'terrain']
// },
var map = new google.maps.Map(d3.select("#map").node(), {
    zoom: 4.1,
    center: new google.maps.LatLng(29.929316, 40.092853),
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
});

map.setOptions({ draggableCursor: "url(https://i.imgur.com/NPPyb1R.png), auto" });
map.setOptions({ draggingCursor: "url(https://i.imgur.com/NPPyb1R.png), auto" });

map.setOptions({ styles: styles['grey'] });

// Custom style types declaration
var styledMapOptions = {
    name: 'Greyscale'
};

var customStyle = new google.maps.StyledMapType(
    styles['grey'], styledMapOptions);

map.mapTypes.set('customstyle', customStyle);
map.setMapTypeId('customstyle');

// Map events
google.maps.event.addListener(map, 'zoom_changed', function() {

    zoomLevel = map.getZoom();
    d3.selectAll('text').attr("fill", "black");
    $('.battles svg').css({ "width": "15px", "height": "15px" });

    if (zoomLevel < 6) {
        map.setMapTypeId('customstyle');
        var sel = d3.selectAll(".circles")
            .attr("r", 3);
        sel.transition()
            .duration(200);
        $('.labels').fadeOut();
        $(".links").fadeOut();
        $(".lines-legend").fadeOut();

    } else if (zoomLevel >= 6 && zoomLevel < 10) {
        map.setMapTypeId('terrain');
        map.setOptions({ styles: styles['grey'] });
        var sel = d3.selectAll(".circles")
            .attr("r", 5);
        sel.transition()
            .duration(200);
        $('.battles svg').css({ "width": "20px", "height": "20px" });
        $(".links").fadeIn();
        $(".lines-legend").fadeIn();

    } else if (zoomLevel >= 10 && zoomLevel < 15) {
        map.setMapTypeId('terrain');
        map.setOptions({ styles: styles['default'] });

        var sel = d3.selectAll(".circles")
            .attr("r", 7);
        sel.transition()
            .duration(200);

        $('.battles svg').css({ "width": "150px", "height": "50px" });

        $('.labels').fadeIn();

    } else if (zoomLevel >= 15) {
        map.setMapTypeId('satellite');
        var sel = d3.selectAll(".circles")
            .attr("r", 9);

        d3.selectAll('text').attr("fill", "white");

        sel.transition()
            .duration(200);

        $('.battles svg').css({ "width": "200px", "height": "50px" });
    }
});