// Tooltip var
var div = d3.select("div").append("span")
    .attr("class", "tooltip")
    .style("opacity", 0);

var overlay = new google.maps.OverlayView(),
    padding = 10,
    radius = 3,
    node_coord = {};

// Parse Nasab Quraysh json
d3.json("../data/all_battles_new1.json", function(error, datax) {
    if (error) throw error;

    var data = datax.nodes;

    /*
     * Beeswarm
     */

    opacityScale = d3.scaleLinear().domain(d3.extent(data, function(d) {
        return d.properties.date;
    })).range([0.15, 1]);

    data = data.filter(function(d) {
        return d.properties.name != ""
    });

    x.domain(d3.extent(data, function(d) {
        return d.properties.date;
    }));

    noUiSlider.create(slider, {
        start: [d3.min(data, function(d) {
            return d.properties.date - 1;
        }), d3.max(data, function(d) {
            return d.properties.date + 1;
        })],
        step: 1,
        behaviour: 'drag',
        connect: true,
        range: {
            'min': d3.min(data, function(d) {
                return d.properties.date - 1;
            }),
            'max': d3.max(data, function(d) {
                return d.properties.date + 1;
            })
        },
        pips: {
            mode: 'count',
            values: 20,
            density: 5,
            stepped: true
        }
    });

    var simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(function(d) {
            return x(d.properties.date);
        }).strength(3))
        .force("y", d3.forceY(height / 2))
        .force("collide", d3.forceCollide(5))
        .stop();

    for (var i = 0; i < 100; ++i) simulation.tick();

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(20));

    g.selectAll(".axis--x").style("display", "none");

    myslider.noUiSlider.on("update", function() {
        minDate = myslider.noUiSlider.get()[0];
        maxDate = myslider.noUiSlider.get()[1];

        var newData = data.filter(function(site) { return site.properties.date < maxDate; })
            .filter(function(site) { return site.properties.date > minDate; });
        displayCircles(newData);
    });

    /*
     * END
     */

    groupedCheckboxes(data);
    linesLegends(datax.links);
    battlesList(data);

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "battles");

        overlay.draw = function() {
            var projection = this.getProjection();

            var marker = layer.selectAll("svg")
                .data(data)
                .each(transform) // update existing marker
                .enter().append("svg")
                .each(transform)
                .attr("class", "marker")
                .on("click", battleClick)
                .on("mouseover", battlesMouseOver)
                .on("mouseout", battlesMouseOut);

            var markerLink = layer.selectAll(".links")
                .data(datax.links)
                .each(pathTransform)
                .enter().append("svg")
                .attr("class", "links")
                .style("position", "absolute")
                .style("display", "none")
                .each(pathTransform);

            var outer = marker.append("g");

            // Add a circle.
            outer.filter(function(d) { return d.properties.name != ""; })
                .append("circle")
                .attr("r", 3)
                .attr("cx", padding)
                .attr("cy", padding)
                .attr("fill", function(d) { return color(d.properties.mainsource); })
                .style("opacity", function(d) { return opacityScale(d.properties.date); })
                .attr("stroke", "#eee")
                .attr("stroke-width", 1)
                .attr("class", function(d) {
                    var name = d.properties.name;
                    name = name.replace(/[\W\s]/g, '');
                    return "circles " + name;
                });

            // Add a label.
            outer.append("text")
                .attr("x", padding + 12)
                .attr("y", padding - 2)
                .attr("class", "labels")
                .text(function(d) {
                    return d.properties.name + "  (" + d.properties.date + ")";
                });

            function pathTransform(d) {
                var t, b, l, r, w, h, currentSvg;
                var d1 = new Object();
                var d2 = new Object();
                $(this).empty();
                d1.x = node_coord[d.source + "," + 0]
                d1.y = node_coord[d.source + "," + 1]
                d2.x = node_coord[d.target + "," + 0]
                d2.y = node_coord[d.target + "," + 1]

                if (d1.y < d2.y) {
                    t = d1.y;
                    b = d2.y;
                } else {
                    t = d2.y;
                    b = d1.y;
                }
                if (d1.x < d2.x) {
                    l = d1.x;
                    r = d2.x;
                } else {
                    l = d2.x;
                    r = d1.x;
                }

                var x1 = 0,
                    y1 = 0,
                    x2 = 0,
                    y2 = 0;
                if ((d1.y < d2.y) && (d1.x < d2.x)) {
                    x2 = r - l;
                    y2 = b - t;
                } else if ((d1.x > d2.x) && (d1.y > d2.y)) {
                    x2 = r - l;
                    y2 = b - t;
                } else if ((d1.y < d2.y) && (d1.x > d2.x)) {
                    x1 = r - l;
                    y2 = b - t;
                } else if ((d1.x < d2.x) && (d1.y > d2.y)) {
                    x1 = r - l;
                    y2 = b - t;
                }

                var dx = x2 - x1,
                    dy = y2 - y1,
                    dr = Math.sqrt(dx * dx + dy * dy);

                currentSvg = d3.select(this)
                    .style("left", (l + 2 * radius) + "px")
                    .style("top", (t + 2 * radius) + "px")
                    .style("width", (r - l + radius) + "px")
                    .style("height", (b - t + radius) + "px");

                currentSvg.append("svg:defs")
                    .append("svg:marker")
                    .attr("id", "arrow")
                    .attr("refX", 6)
                    .attr("refY", 6)
                    .attr("markerWidth", 20)
                    .attr("markerHeight", 20)
                    .attr("orient", "auto")
                    .append("path")
                    .attr("d", "M 0 0 12 6 0 12 3 6")
                    .style("fill", "rgba(0,0,0,0.25)");

                currentSvg.append("svg:line")
                    .style("stroke-width", 1.5)
                    .style("stroke", function(d) { return colorLine(d.campaign) })
                    .attr("x1", x1)
                    .attr("y1", y1)
                    .attr("x2", x2)
                    .attr("y2", y2)
                    .attr("marker-end", "url(#arrow)");

                // var pathe = "M" + x1 + "," + y1 +
                //     "A" + dr + "," + dr + " 0 0 1," + x2 + "," + y2;

                // currentSvg.append("svg:path")
                //     .attr("d", pathe)
                //     .style("stroke-width", 2)
                //     .style("stroke", function(d) { return color(d.campaign) })
                //     .style("fill", "none")
                //     .attr("marker-middle", "url(#arrow)");

                return currentSvg;
            }

            // Populate map with data
            function transform(d, i) {
                d = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
                d = projection.fromLatLngToDivPixel(d);

                node_coord[i + "," + 0] = d.x - padding;
                node_coord[i + "," + 1] = d.y - padding;

                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            };

            d3.selectAll('.blist-map .item').data(data).on("click", battleClick);
        };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);

    $(".sourcescb").change(function() {
        var type = this.value,
            display = this.checked ? "inline" : "none";

        d3.selectAll(".circles")
            .filter(function(d) { return d.properties.mainsource === type; })
            .attr("display", display);

        d3.selectAll(".labels")
            .filter(function(d) { return d.properties.mainsource === type; })
            .attr("display", display);

        d3.selectAll(".bcircle")
            .filter(function(d) { return d.data.properties.mainsource === type; })
            .attr("display", display);
    });

});