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

var map = new google.maps.Map(d3.select("#map").node(), {
    zoom: 4.1,
    center: new google.maps.LatLng(28.729316, 44.092853),
    mapTypeControlOptions: {
        mapTypeIds: ['customstyle', google.maps.MapTypeId.SATELLITE]
    },
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
});

var styledMapOptions = {
    name: 'Greyscale'
};

var customStyle = new google.maps.StyledMapType(
    styles, styledMapOptions);


map.mapTypes.set('customstyle', customStyle);
map.setMapTypeId('customstyle');

var width = d3.select(".graph").node().getBoundingClientRect().width;
var height = d3.select(".graph").node().getBoundingClientRect().height;

var scales = d3.select(".graph").append('svg')
    .attr('width', width)
    .attr('height', height);

var g = scales.append("g")
    .attr("transform", "translate(0, " + 0 + ")");

var textbox = d3.select(".textbox");

// .append('div')
//     .attr('width', d3.select(".textbox").node().getBoundingClientRect().width)
//     .attr('height', d3.select(".textbox").node().getBoundingClientRect().height)
//     .attr('class', 'text');

var div = d3.select("div").append("span")
    .attr("class", "tooltip")
    .style("opacity", 0);

var x = d3.scaleLinear()
    .range([150, width - 40]);

var y = d3.scaleLinear()
    .range([200, 100]);

var parseDate = d3.timeParse('%Y');

d3.json("../data/battles.json", function(error, battles) {
    if (error) throw error;

    var data = battles.features;

    console.log(data);

    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "battles");

        overlay.draw = function() {
            var projection = this.getProjection(),
                padding = 10;

            var marker = layer.selectAll("svg")
                .data(data)
                .each(transform) // update existing markers
                .enter().append("svg")
                .each(transform)
                .attr("class", "marker markerNQ");

            // Add a circle.
            marker.append("circle")
                .attr("r", 2)
                .attr("cx", padding)
                .attr("cy", padding)
                .attr("class", function(d) { return "circleNQ " + d.properties.name })
                .on("click", battleClick)
                .on("mouseover", battlesMouseOver)
                .on("mouseout", battlesMouseOut);

            // Add a label.
            marker.append("text")
                .attr("x", padding + 12)
                .attr("y", padding - 2)
                .attr("class", "labels labelsNQ")
                .text(function(d) { return d.properties.name + "  (" + d.properties.date + ")"; });

            marker.append("text")
                .attr("x", padding + 12)
                .attr("y", padding + 9)
                .attr("dy", ".5px")
                .attr("class", "labels labelsNQ")
                .text(function(d) { return "  💀 " + d.properties.deaths; });

            console.log();

            function transform(d) {
                d = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            };
        };
    };

    // x.domain([d3.min(data, function(d) { return d.properties.date; }), 760]);
    // y.domain([0, d3.max(data, function(d) { return d.properties.deaths; })]);

    // g.append("g")
    //     .attr("class", "axis axis-x")
    //     .attr("transform", "translate(0,340)")
    //     .call(d3.axisBottom(x).ticks(20));

    // g.append("g")
    //     .attr("class", "axis axis-y")
    //     .attr("transform", "translate(0,100)")
    //     .style("display", "none")
    //     .call(d3.axisLeft(y).ticks(20));

    // g.selectAll("bar")
    //     .data(data)
    //     .enter().append("rect")
    //     .attr("class", function(d) { return d.properties.name; })
    //     .attr("x", function(d) { return x(d.properties.date); })
    //     .attr("y", function(d) { return y(d.properties.deaths); })
    //     .attr("width", 1)
    //     .attr("height", function(d) { return 340 - y(d.properties.deaths); });

    var cell = g.append("g")
        .attr("class", "cells")
        .selectAll("g").data(d3.voronoi()
            .extent([
                [-40, -40],
                [400 + 40, 300 + 40]
            ])
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .polygons(data)).enter().append("g");

    // Bind our overlay to the map…
    overlay.setMap(map);

});

d3.json("../data/battles-k.json", function(error, battles) {
    if (error) throw error;

    var data = battles.features;

    console.log(data);

    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "battles");

        overlay.draw = function() {
            var projection = this.getProjection(),
                padding = 10;

            var marker = layer.selectAll("svg")
                .data(data)
                .each(transform) // update existing markers
                .enter().append("svg")
                .each(transform)
                .attr("class", "marker markerK");

            // Add a circle.
            marker.append("circle")
                .attr("r", 2)
                .attr("cx", padding)
                .attr("cy", padding)
                .attr("class", function(d) { return "circleK " + d.properties.name })
                .on("click", battleClick)
                .on("mouseover", battlesMouseOver)
                .on("mouseout", battlesMouseOut);

            // Add a label.
            marker.append("text")
                .attr("x", padding + 12)
                .attr("y", padding)
                .attr("dy", ".31em")
                .attr("class", "labels labelsK")
                .text(function(d) { return d.properties.name + "  (" + d.properties.date + ")"; });

            // var outerCircle = marker.append("circle")
            //     .attr("cx", padding)
            //     .attr("cy", padding)
            //     .attr("r", 5)
            //     .style("fill", "none")
            //     .style("stroke", "black")
            //     .style("stroke-width", 1);

            // var outerOriginX = padding + ((5) * Math.sin(0));
            // var outerOriginY = padding + ((5) * Math.cos(0));

            function transform(d) {
                d = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            };

            // function battleClick(d) { // Add interactivity
            //     textbox.html(
            //         "<h2>" + d.properties.name + "</h2><p>" + d.properties.date + "</p><br>" + "<img class=\"circle-img\" src=\"" + d.properties.img + "\">" +
            //         "<p>" + d.properties.text + "</p><p>ref: " + d.properties.source + "</p><a href=\"" + d.properties.link + "\">" + d.properties.link + "</a>"
            //     ).style('color', '#000');
            // };

            // function battlesMouseOver(d) {
            //     d3.select(this).attr("r", 5);

            //     var bar = g.select("rect");

            //     div.transition()
            //         .duration(200)
            //         .style("opacity", .9);

            //     div.html(
            //             "<b>" + d.properties.name + "</b><p>" + d.properties.date + "</p>"
            //         )
            //         .style("left", (d3.event.pageX + 10) + "px")
            //         .style("top", (d3.event.pageY - 40) + "px");
            // };

            // function battlesMouseOut(d) {
            //     if (zoomLevel <= 6) {
            //         d3.select(this).attr("r", 2);
            //     } else if (zoomLevel >= 6 && zoomLevel <= 8) {
            //         d3.select(this).attr("r", 3);
            //     } else if (zoomLevel >= 8) {
            //         d3.select(this).attr("r", 7);
            //     }
            //     div.transition()
            //         .duration(500)
            //         .style("opacity", 0);
            // };
        };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);

});

zoomLevel = map.getZoom();

function nqsource(cb) {
    if (cb.checked) {
        $('.circleNQ').show();
        $('.labelsNQ').show();

    } else {
        $('.circleNQ').hide();
        $('.labelsNQ').hide();
    }
}

function kensource(cb) {
    if (cb.checked) {
        $('.circleK').show();
        $('.labelsK').show();
    } else {
        $('.circleK').hide();
        $('.labelsK').hide();
    }
}

// d3.json("../data/battles-geo.json", function(error, battles) {
//     if (error) throw error;

//     var data = topojson.feature(battles, battles.objects.battles_geojson).features;
// });

google.maps.event.addListener(map, 'zoom_changed', function() {
    zoomLevel = map.getZoom();
    if (zoomLevel <= 6) {
        var sel = d3.selectAll("circle")
            .attr("r", 2).style("stroke-width", "1px");
        sel.transition()
            .duration(200);
        $('.labelsNQ').hide();
        $('.labelsK').hide();
        // map.setMapTypeId('customstyle');
    } else if (zoomLevel >= 5 && zoomLevel <= 8) {
        var sel = d3.selectAll("circle")
            .attr("r", 4).style("stroke-width", "2px");
        sel.transition()
            .duration(200)
        $('.labelsNQ').hide();
        $('.labelsK').hide();
        // map.setMapTypeId('customstyle');
    } else if (zoomLevel >= 8) {
        var sel = d3.selectAll("circle")
            .attr("r", 7).style("stroke-width", "3px");
        sel.transition()
            .duration(200);
        $('.labelsNQ').show();
        $('.labelsK').show();
        // map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    }
});

google.maps.event.addListener(map, 'maptypeid_changed', function() {
    var typeid = map.getMapTypeId();
    if (typeid == 'customstyle') {
        console.log("IT'S CUSTOm");
        d3.selectAll("text").style("fill", "black")
        d3.selectAll(".circleK").style("fill", "red").style("stroke", "white");
        d3.selectAll(".circleNQ").style("fill", "black").style("stroke", "white");
        $(".kencircle").css("background", "red").css("border", "1px solid white");
        $(".nqcircle").css("background", "black").css("border", "1px solid white");
        $(".controls").css("color", "black");
    } else if (typeid == "satellite") {
        console.log("IT'S SATELLITE");
        d3.selectAll("text").style("fill", "white")
        d3.selectAll(".circleK").style("fill", "white").style("stroke", "red");
        d3.selectAll(".circleNQ").style("fill", "white").style("stroke", "black");
        $(".kencircle").css("background", "white").css("border", "1px solid red");
        $(".nqcircle").css("background", "white").css("border", "1px solid black");
        $(".controls").css("color", "white");
    }
});

function battleClick(d) { // Add interactivity
    textbox.html(
        "<h2>" + d.properties.name + "</h2><p>" + d.properties.date + "</p><br><p> Deaths: " + d.properties.deaths + "</p><br>" + "<img class=\"circle-img\" src=\"" + d.properties.img + "\">" +
        "<p>" + d.properties.text + "</p><p>ref: " + d.properties.source + "</p><a href=\"" + d.properties.link + "\">" + d.properties.link + "</a>"
    ).style('color', '#000');
};

function battlesMouseOver(d) {
    if (zoomLevel <= 6) {
        d3.select(this).attr("r", 4);
    } else if (zoomLevel >= 6 && zoomLevel <= 8) {
        d3.select(this).attr("r", 5);
    } else if (zoomLevel >= 8) {
        d3.select(this).attr("r", 9);
    }
    // d3.select(this).attr("r", 5);

    div.transition()
        .duration(200)
        .style("opacity", .9);

    div.html(
            "<b>" + d.properties.name + "</b><p>" + d.properties.date + "</p>"
        )
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 40) + "px");
};

function battlesMouseOut(d) {
    zoomLevel = map.getZoom();
    if (zoomLevel <= 6) {
        d3.select(this).attr("r", 2);
    } else if (zoomLevel >= 6 && zoomLevel <= 8) {
        d3.select(this).attr("r", 3);
    } else if (zoomLevel >= 8) {
        d3.select(this).attr("r", 7);
    }

    div.transition()
        .duration(500)
        .style("opacity", 0);
};