var svg = d3.select("#beeswarm"),
    margin = {
        top: 0,
        right: 50,
        bottom: 0,
        left: 75
    },
    width = d3.select(".beeswarm-container").node().getBoundingClientRect().width - margin.left - margin.right,
    height = d3.select(".beeswarm-container").node().getBoundingClientRect().height - 70;

// width = svg.attr("width") - margin.left - margin.right,
// height = svg.attr("height") - margin.top - margin.bottom;

var formatValue = d3.format(",d");

var x = d3.scaleLinear()
    .rangeRound([0, width]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var myslider = document.getElementById('slider');

var temp = false,
    timerVar;

noUiSlider.create(slider, {
    start: [590, 640],
    step: 1,
    behaviour: 'drag',
    connect: true,
    range: {
        'min': 590,
        'max': 750
    },
    pips: {
        mode: 'count',
        values: 17,
        density: 3,
        stepped: true
    }
});

// d3.csv("flare.csv", type, function(error, data) {
d3.json("../data/all_battles_new.json", function(error, battles) {
    if (error) throw error;

    var data = battles;

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
        .call(d3.axisBottom(x).ticks(20));

    g.selectAll(".axis--x").style("display", "none");

    myslider.noUiSlider.on("update", function() {
        var newData = data.filter(function(site) {
            return site.properties.date < myslider.noUiSlider.get()[1];
        }).filter(function(site) {
            return site.properties.date > myslider.noUiSlider.get()[0];
        });
        displayCircles(newData);
    });
});

function displayCircles(data) {
    // console.log(cbNQ);
    // g.selectAll("circle").transition().duration(200)
    //     .attr("r", 1).remove();
    g.selectAll("circle").remove();

    if (cbNQ == false) {
        g.selectAll("bcircleNQ").remove();
        $('.bcircleNQ').hide();
    }
    if (cbKen == false) {
        g.selectAll("bcircleK").remove();
        $('.bcircleK').hide();
    }

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
            if (isNaN(d.data.properties.deaths) || d.data.properties.deaths < 1) {
                return "bcircle bcircleK"
            } else {
                return "bcircle bcircleNQ"
            }
        })
        .attr("fill", function(d) {
            if (isNaN(d.data.properties.deaths) || d.data.properties.deaths < 1) {
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
        })
        .attr("r", 3);

    cell.append("path")
        .attr("d", function(d) {
            return "M" + d.join("L") + "Z";
        })
        .on("click", battleClickWData)
        .on("mouseover", mouseOverCircle)
        .on("mouseout", mouseOutCircle);

    cell.append("title")
        .text(function(d) {
            return d.data.properties.name + "\n" + d.data.properties.date + "\n" + d.data.properties.deaths;
        });
}

function mouseOverCircle(d) {
    d3.select(this).selectAll('circles').attr("fill", "red");
}

function mouseOutCircle(d) {
    d3.select(this).selectAll('circles').attr("fill", "white");
}

function startAnim() {
    var first = myslider.noUiSlider.get()[0];
    var second = myslider.noUiSlider.get()[1];

    timerVar = setInterval(function() {
        /// call your function here
        if (first < 750 || second < 750) {
            slider.noUiSlider.set([first++, second++]);
            console.log(myslider.noUiSlider.get());
        }
    }, 1000);
}

function stopAnim() {
    clearInterval(timerVar);
}

function playAnimation() {
    temp = !temp;
    console.log(temp);
    if (temp) {
        startAnim();
        $("#animPlayBtn").html("Pause");
    } else {
        stopAnim();
        $("#animPlayBtn").html("Play");
    }
}