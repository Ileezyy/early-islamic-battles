var svg = d3.select("#beeswarm"),
    margin = {
        top: 5,
        right: 25,
        bottom: 30,
        left: 25
    },
    width = d3.select(".beeswarm-container").node().getBoundingClientRect().width - margin.left - margin.right,
    height = d3.select(".beeswarm-container").node().getBoundingClientRect().height - margin.top - margin.bottom;

// width = svg.attr("width") - margin.left - margin.right,
// height = svg.attr("height") - margin.top - margin.bottom;

var formatValue = d3.format(",d");

var x = d3.scaleLinear()
    .rangeRound([0, width]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.csv("flare.csv", type, function(error, data) {
d3.json("../data/battles.json", function(error, battles) {
    d3.json("../data/battles-k.json", function(error, battlesK) {
        if (error) throw error;

        var data = d3.merge([battles.features, battlesK.features]);

        x.domain(d3.extent(data, function(d) {
            return d.properties.date;
        }));

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
            .call(d3.axisBottom(x).ticks(21));

        var cell = g.append("g")
            .attr("class", "cells")
            .selectAll("g").data(d3.voronoi()
                .extent([
                    [-margin.left, -margin.top],
                    [width + margin.right, height + margin.top]
                ])
                .x(function(d) {
                    return d.x;
                })
                .y(function(d) {
                    return d.y;
                })
                .polygons(data)).enter().append("g");

        cell.append("circle")
            .attr("r", 3)
            .attr("fill", function(d) {
                if (isNaN(d.data.properties.deaths)) {
                    return "#008eff"
                } else {
                    return "black"
                }
            })
            .attr("cx", function(d) {
                return d.data.x;
            })
            .attr("cy", function(d) {
                return d.data.y;
            });

        cell.append("path")
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .on("click", battleClickWData);

        cell.append("title")
            .text(function(d) {
                return d.data.properties.name + "\n" + d.data.properties.date + "\n" + d.data.properties.deaths;
            });
    });
});

function type(d) {
    if (!d.properties.date) return;
    d.properties.date = +d.properties.date;
    return d;
}