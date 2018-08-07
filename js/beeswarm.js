var svg = d3.select("#beeswarm"),
    margin = {
        top: 0,
        right: 40,
        bottom: 0,
        left: 20
    },
    width = d3.select(".beeswarm-container").node().getBoundingClientRect().width - margin.left - margin.right,
    height = d3.select(".beeswarm-container").node().getBoundingClientRect().height - 70;

var ttDiv = d3.select(".beeswarm-container").append("span")
    .attr("class", "tooltips")
    .style("opacity", 0);

var formatValue = d3.format(",d");

var x = d3.scaleLinear()
    .rangeRound([0, width]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var myslider = document.getElementById('slider');

var temp = false,
    timerVar, minDate, maxDate, opacityScale;

d3.json("../data/all_battles_new1.json", function(error, battles) {
    if (error) throw error;

    var data = battles.nodes;

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

    // displayCircles(data)
    myslider.noUiSlider.on("update", function() {
        minDate = myslider.noUiSlider.get()[0];
        maxDate = myslider.noUiSlider.get()[1];

        var newData = data.filter(function(site) { return site.properties.date < maxDate; })
            .filter(function(site) { return site.properties.date > minDate; });
        displayCircles(newData);
    });
});

function displayCircles(data) {

    g.selectAll("circle").style("fill", "#ebebeb").exit().remove();

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
        .attr("class", function(d) {
            var name = d.data.properties.name;
            name = name.replace(/[\W\s]/g, '');
            return "bcircle " + name;
        })
        .style("opacity", function(d) { return opacityScale(d.data.properties.date); })
        .attr("fill", function(d) { return color(d.data.properties.mainsource); })
        .attr("cx", function(d) {
            return d.data.x;
        })
        .attr("cy", function(d) {
            return d.data.y;
        })
        .attr("r", 3);

    cell.append("path")
        .attr("d", function(d) {
            return "M" + d.join("L") + "Z";
        })
        .filter(function(d) { return d3.select(this).attr("fill") !== "#ebebeb"; })
        .on("click", battleClickWData)
        .on("mouseover", mouseOverCircle)
        .on("mouseout", mouseOutCircle);

    cell.selectAll("circle").exit().remove();
}