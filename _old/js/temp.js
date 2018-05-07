var width = 1100,
    height = 770;

var projection = d3.geoAlbers()
    .center([53, 26])
    .rotate([-3, 5])
    .parallels([30, 0])
    .scale(1500)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select(".svg-container").append("svg")
    .attr("width", width)
    .attr("height", height);

var chartGroup = svg.append('g');

var minDate;
var maxDate;

d3.json("../data/middleeast.json", function(error, arab) {
    var countries = topojson.feature(arab, arab.objects.countries).features;
    chartGroup.selectAll(".countries")
        .data(topojson.feature(arab, arab.objects.countries).features)
        .enter().append("path")
        .attr("class", function(d) {
            return "country " + d.properties.GU_A3;
        })
        .attr("d", path)
        .append('svg:title')
        .text(function(d) { return d.properties.NAME; });

    // chartGroup.selectAll(".country-label")
    //     .data(topojson.feature(arab, arab.objects.countries).features)
    //     .enter().append("text")
    //     .attr("class", function(d) {
    //         return "country-label " + d.properties.GU_A3;
    //     })
    //     .attr("transform", function(d) {
    //         return "translate(" + path.centroid(d) + ")";
    //     })
    //     .attr("dy", ".35em")
    //     .text(function(d) {
    //         if (d.properties.NAME_LEN > 15) {
    //             return d.properties.ABBREV;
    //         } else {
    //             return d.properties.NAME;
    //         }
    //     });

    d3.json("../data/battles-geo.json", function(error, battles) {

        var battlesData = topojson.feature(battles, battles.objects.battles_geojson).features;
        // console.log(battlesData[0].properties.date);

        for (var i in battlesData) {
            console.log(battlesData[i]);
            if (battlesData[i].properties.date > minDate && battlesData[i].properties.date < maxDate) {

            }
        }

        var points = chartGroup.selectAll(".point")
            .data(battlesData);

        points.exit().remove();

        points.enter().append("circle")
            .attr("r", function(d) {
                return d.properties.deaths / 1.5;
            })
            .attr("transform", function(d) {
                return "translate(" + projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]) + ")";
            })
            .attr("class", function(d) {
                return "point " + d.properties.name;
            })
            .append('svg:title')
            .text(function(d) { return d.properties.deaths; });

        var labels = chartGroup.selectAll(".battle-label")
            .data(battlesData);
        labels.exit().remove();
        labels.enter().append("text")
            .attr("class", function(d) {
                return "battle-label " + d.properties.name;
            })
            .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
            .attr("x", function(d) { return d.geometry.coordinates[0] > -3 ? 8 : -8; })
            .attr("dy", ".35em")
            .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -3 ? "start" : "end"; })
            .text(function(d) {
                return d.properties.name;
            });
    });

    d3.json("../data/rivers_topo.json", function(error, rivers) {
        // console.log(rivers);
        chartGroup.selectAll(".rivers")
            .data(topojson.feature(rivers, rivers.objects.rivers).features)
            .enter().append("path")
            .attr("class", function(d) {
                return "rivers " + d.properties.name;
            })
            .attr("d", path)
            .append('svg:title')
            .text(function(d) { return d.properties.name_en; });
    });
});

var isClicked = false;

function arrangeLabels() {
    isClicked = !isClicked;
    var move = 1;
    if (isClicked) {
        while (move > 0) {
            move = 0;
            svg.selectAll(".battle-label").each(function() {
                var that = this,
                    a = this.getBoundingClientRect();
                svg.selectAll(".battle-label").each(function() {
                    if (this != that) {
                        var b = this.getBoundingClientRect();
                        if ((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) &&
                            (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
                            // overlap, move labels
                            var dx = (Math.max(0, a.right - b.left) +
                                    Math.min(0, a.left - b.right)) * 0.01,
                                dy = (Math.max(0, a.bottom - b.top) +
                                    Math.min(0, a.top - b.bottom)) * 0.02,
                                tt = d3.transform(d3.select(this).attr("transform")),
                                to = d3.transform(d3.select(that).attr("transform"));
                            move += Math.abs(dx) + Math.abs(dy);

                            to.translate = [to.translate[0] + dx, to.translate[1] + dy];
                            tt.translate = [tt.translate[0] - dx, tt.translate[1] - dy];
                            d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                            d3.select(that).attr("transform", "translate(" + to.translate + ")");
                            a = this.getBoundingClientRect();
                        }
                    }
                });
            });
        }
    } else {
        location.reload();
    }
}

slider.noUiSlider.on('change', function() {

    minDate = slider.noUiSlider.get()[0];
    maxDate = slider.noUiSlider.get()[1];

    // console.log(minDate);
    // var points = chartGroup.selectAll(".point")
    //     .data(topojson.feature(battles, battles.objects.battles_geojson).features);
    // points.exit().remove();
    // points.enter().append("circle")
    //     .attr("r", function(d) {
    //         return d.properties.deaths / 1.5;
    //     })
    //     .attr("transform", function(d) {
    //         return "translate(" + projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]) + ")";
    //     })
    //     .attr("class", function(d) {
    //         return "point " + d.properties.name;
    //     })
    //     .append('svg:title')
    //     .text(function(d) { return d.properties.deaths; });

    // var labels = chartGroup.selectAll(".battle-label")
    //     .data(topojson.feature(battles, battles.objects.battles_geojson).features);
    // labels.exit().remove();
    // labels.enter().append("text")
    //     .attr("class", function(d) {
    //         return "battle-label " + d.properties.name;
    //     })
    //     .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
    //     .attr("x", function(d) { return d.geometry.coordinates[0] > -3 ? 8 : -8; })
    //     .attr("dy", ".35em")
    //     .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -3 ? "start" : "end"; })
    //     .text(function(d) {
    //         return d.properties.name;
    //     });
});