// Tooltip var
var div = d3.select("div").append("span")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Parse Nasab Quraysh json
d3.json("../data/battles.json", function(error, battles) {
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

// Parse The Great Arab Conquests json
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

});