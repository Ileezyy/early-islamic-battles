var width = 960,
    height = 750;

var projection = d3.geo.albers()
    .center([50, 26])
    .rotate([0, 4])
    .parallels([40, 0])
    .scale(1500)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var chartGroup = svg.append('g');

d3.json("../data/middle_east_topo.json", function(error, arab) {
    chartGroup.selectAll(".countries")
        .data(topojson.feature(arab, arab.objects.middle_east).features)
        .enter().append("path")
        .attr("class", function(d) {
            return "country " + d.properties.GU_A3;
        })
        .attr("d", path);

    chartGroup.selectAll(".country-label")
        .data(topojson.feature(arab, arab.objects.middle_east).features)
        .enter().append("text")
        .attr("class", function(d) {
            return "country-label " + d.properties.GU_A3;
        })
        .attr("transform", function(d) {
            return "translate(" + path.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .text(function(d) {
            if (d.properties.NAME_LEN > 15) {
                return d.properties.ABBREV;
            } else {
                return d.properties.NAME;
            }
        });

    d3.json("../data/battles-geo.json", function(error, battles) {
        chartGroup.selectAll(".point")
            .data(topojson.feature(battles, battles.objects.battles_geojson).features)
            .enter().append("circle")
            .attr("r", 3)
            .attr("transform", function(d) {
                return "translate(" + projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]) + ")";
            })
            .attr("class", function(d) {
                return "point " + d.properties.name;
            });

        chartGroup.selectAll(".battle-label")
            .data(topojson.feature(battles, battles.objects.battles_geojson).features)
            .enter().append("text")
            .attr("class", function(d) {
                return "battle-label " + d.properties.name;
            })
            .attr("x", function(d) {
                return path.centroid(d)[0] + 5;
            })
            .attr("y", function(d) {
                return path.centroid(d)[1];
            })
            .attr("text-anchor", "start")
            .text(function(d) {
                return d.properties.name;
            });
    });
});