/* Tooltip var
var div = d3.select("#map").append("span")
    .attr("class", "tooltip")
    .style("opacity", 0);*/

var overlay = new google.maps.OverlayView(),
    layer, projection, marker;

var nqchecked = $("#nq");

// Parse Nasab Quraysh json
d3.json("../data/battles.json", function(error, battlesNQ) {
    if (error) throw error;
    d3.json("../data/battles-k.json", function(error, battlesK) {
        if (error) throw error;

        var data = d3.merge([battlesNQ.features, battlesK.features]);

        overlay.onAdd = function() {

            layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
                .attr("class", "battles");

            overlay.draw = function() {

                projection = this.getProjection(),
                    padding = 10;

                myslider.noUiSlider.on("set", function() {
                    var newData = data.filter(function(d) {
                        return d.properties.date < myslider.noUiSlider.get()[1];
                    }).filter(function(d) {
                        return d.properties.date > myslider.noUiSlider.get()[0];
                    });
                    displayNQ(newData);
                });

                marker = layer.selectAll("svg")
                    .data(data)
                    .each(transform) // update existing markers
                    .enter().append("svg");

                marker.on("mouseover", battlesMouseOver)
                    .on("mouseout", battlesMouseOut)
                    .on("click", battleClick);

                // Add a label.
                marker.append("text")
                    .attr("x", padding + 12)
                    .attr("y", padding - 2)
                    .attr("class", function(d) {
                        if (isNaN(d.properties.deaths)) {
                            return "labels labelsK";
                        } else {
                            return "labels labelsNQ";
                        }
                    })
                    .text(function(d) {
                        return d.properties.name + "  (" + d.properties.date + ")";
                    });

                // Populate map with data
                function transform(d) {
                    d = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left", (d.x - padding) + "px")
                        .style("top", (d.y - padding) + "px");
                };
                // displayNQ(data);
            };
        };

        // Bind our overlay to the map…
        overlay.setMap(map);
    });
});

function displayNQ(data) {

    layer.selectAll(".circles").remove();

    marker = layer.selectAll("svg")
        .data(data)
        .attr("class", function(d) {
            if (isNaN(d.properties.deaths)) {
                return "marker markerK";
            } else {
                return "marker markerNQ";
            }
        });

    // Add a circle.
    marker.append("circle")
        .attr("r", 2)
        .attr("cx", padding)
        .attr("cy", padding)
        .attr("class", function(d) {
            // if (isNaN(d.properties.deaths)) {
            //     return "circles circleK " + d.properties.name;
            // } else {
            //     return "circles circleNQ " + d.properties.name;
            // }
            return "circles " + d.properties.name;
        })
        .attr("fill", function(d) {
            if (typeof d.properties.deaths !== 'number') {
                return "#008eff"
            } else {
                return "black"
            }
        });
}

/* Parse The Great Arab Conquests json
d3.json("../data/battles-k.json", function(error, battles) {
    if (error) throw error;

    var data = battles.features;

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

            var simulation = d3.forceSimulation(data)
                .force("x", d3.forceX(function(d) {
                    return x(d.properties.date);
                }).strength(3))
                .force("y", d3.forceY(height / 2))
                .force("collide", d3.forceCollide(5))
                .stop();

            for (var i = 0; i < 100; ++i) simulation.tick();

            // Add a circle.
            marker.append("circle")
                .attr("r", 2)
                .attr("cx", padding)
                .attr("cy", padding)
                .attr("class", function(d) { return "circles circleK " + d.properties.name })
                .on("click", battleClick);

            marker.on("mouseover", battlesMouseOver)
                .on("mouseout", battlesMouseOut);

            // Add a label.
            marker.append("text")
                .attr("x", padding + 12)
                .attr("y", padding)
                .attr("dy", ".31em")
                .attr("class", "labels labelsK")
                .text(function(d) { return d.properties.name + "  (" + d.properties.date + ")"; });

            // Populate map with data
            function transform(d) {
                d = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            };
        };
    };

    // Bind our overlay to the map
    overlay.setMap(map);

});*/