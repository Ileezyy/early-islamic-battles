// Tooltip var
var div = d3.select("div").append("span")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Parse Nasab Quraysh json
d3.json("../data/all_battles_new.json", function(error, battles) {
    if (error) throw error;

    var data = battles;

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
                .attr("class", function(d) {
                    if (isNaN(d.properties.deaths) || d.properties.deaths < 1) {
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
                .attr("fill", function(d) {
                    if (isNaN(d.properties.deaths) || d.properties.deaths < 1) {
                        return "#008eff"
                    } else {
                        return "black"
                    }
                })
                .attr("class", function(d) {
                    if (isNaN(d.properties.deaths) || d.properties.deaths < 1) {
                        return "circles circleK " + d.properties.name;
                    } else {
                        return "circles circleNQ " + d.properties.name;
                    }
                })
                .on("click", battleClick);

            marker.on("mouseover", battlesMouseOver)
                .on("mouseout", battlesMouseOut);

            // Add a label.
            marker.append("text")
                .attr("x", padding + 12)
                .attr("y", padding - 2)
                .attr("class", function(d) {
                    if (isNaN(d.properties.deaths) || d.properties.deaths < 1) {
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
        };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);
});