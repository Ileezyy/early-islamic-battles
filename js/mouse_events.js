// Vars
var color = d3.scaleOrdinal()
    .range(d3.schemeCategory10);

var textbox = d3.select(".textbox");

var zoomLevel = map.getZoom();

var cbNQ = true,
    cbKen = true;

var radius = 3;
var fillColor = "black";

var index = false;
var sourcesTitle = "";
var imgsrc = "";
var deathsInfo = "";

// Mouse events functions
function nqsource(cb) {
    // console.log(cb.checked);

    if (cb.checked) {
        cbNQ = true;
        $('.markerNQ').show();
        $('.bcircleNQ').show();
    } else {
        cbNQ = false;
        $('.markerNQ').hide();
        $('.bcircleNQ').hide();
        $('.labelsNQ').hide();
    }
    // console.log(cbNQ);

}

function kensource(cb) {
    if (cb.checked) {
        cbKen = false;
        $('.markerK').show();
        $('.bcircleK').show();
    } else {
        cbKen = false;
        $('.markerK').hide();
        $('.bcircleK').hide();
        $('.labelsK').hide();
    }
}

function battleClick(d) {
    var newPos = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);

    if (zoomLevel < 6) {
        map.setZoom(6);
    }

    map.panTo(newPos);

    // index = !index;

    // d3.selectAll(".circles")
    //     .classed("grey", function(d, i) {
    //         return !d3.select(this).classed("grey");
    //     });

    // d3.select(this).selectAll('.circles').attr("r", 9).attr("fill", "red");

    /*if (index) {
        d3.selectAll('.circles').attr("fill", "lightgrey");
    } else {
        d3.selectAll(".circles")
            .attr("fill", function(d) {
                if (isNaN(d.properties.deaths) || d.properties.deaths < 1) {
                    return "#008eff";
                } else {
                    return "black";
                }
            });
    }*/

    // d3.select(this).attr("r", 9).attr("fill", "red");
    // $(".map-overlay").show();

    // console.log(d.pdf[0].name);

    if (d.pdf[0].src === "") {
        sourcesTitle = "";
    } else {
        sourcesTitle = "<hr><h4>PDF sources</h4>"
    }

    if (d.properties.img === "") {
        imgsrc = "";
    } else {
        imgsrc = "<img class='circle-img' src='" + d.properties.img + "'>";
    }

    if (d.properties.deaths < 1) {
        deathsInfo = "";
    } else {
        deathsInfo = "<p> Deaths: " + d.properties.deaths + "</p>";
    }

    textbox.html(
        "<h2>" + d.properties.name + "</h2><p>" + d.properties.date + ", " + d.properties.mainsource + "</p>" + deathsInfo + imgsrc +
        "<p>" + d.properties.text + "</p><p>ref: " + d.properties.source + "</p><a href=\"" + d.properties.link + "\">" + d.properties.link + "</a>" + sourcesTitle
    ).style('color', '#000');

    for (let i in d.pdf) {
        if (d.pdf[i].src === "") {
            $('.textbox').append("");
        } else {
            $('.textbox').append("<button type='button' class='btn btn-pdf' data-toggle='modal' data-target='#exampleModalCenter' data-pdfname='" +
                d.pdf[i].name +
                "' data-pdfsrc='" + d.pdf[i].src + "' data-pdfpage='" + d.pdf[i].startpage + "'>" + d.pdf[i].name +
                "</button><br>");
        }
    }
}

function battleClickWData(d) {

    var newPos = new google.maps.LatLng(d.data.geometry.coordinates[1], d.data.geometry.coordinates[0]);

    if (zoomLevel < 6) {
        map.setZoom(6);
    }
    map.panTo(newPos);

    if (d.data.pdf[0].src === "") {
        sourcesTitle = "";
    } else {
        sourcesTitle = "<hr><h4>PDF sources</h4>"
    }

    if (d.data.properties.img === "") {
        imgsrc = "";
    } else {
        imgsrc = "<img class='circle-img' src='" + d.data.properties.img + "'>";
    }

    if (d.data.properties.deaths < 1) {
        deathsInfo = "";
    } else {
        deathsInfo = "<p> Deaths: " + d.data.properties.deaths + "</p>";
    }

    textbox.html(
        "<h2>" + d.data.properties.name + "</h2><p>" + d.data.properties.date + ", " + d.data.properties.mainsource + "</p>" + deathsInfo + imgsrc +
        "<p>" + d.data.properties.text + "</p><p>ref: " + d.data.properties.source + "</p><a href=\"" + d.data.properties.link + "\">" + d.data.properties.link + "</a>" + sourcesTitle
    ).style('color', '#000');

    for (let i in d.data.pdf) {
        if (d.data.pdf[i].src === "") {
            $('.textbox').append("");
        } else {
            console.log(d.data.pdf[i]);
            $('.textbox').append("<button type='button' class='btn btn-pdf' data-toggle='modal' data-target='#exampleModalCenter' data-pdfname='" +
                d.data.pdf[i].name +
                "' data-pdfsrc='" + d.data.pdf[i].src + "' data-pdfpage='" + d.data.pdf[i].startpage + "'>" + d.data.pdf[i].name +
                "</button><br>");
        }
    }

}

function battlesMouseOver(d) {

    if (zoomLevel < 6) {
        radius = 4;
    } else if (zoomLevel >= 6 && zoomLevel < 10) {
        radius = 6;
    } else if (zoomLevel >= 10 && zoomLevel < 15) {
        radius = 8;
    } else if (zoomLevel >= 15) {
        radius = 10;
    }

    d3.select(this).selectAll('.circles')
        .attr("fill", fillColor)
        .attr("r", radius);

    d3.selectAll(".bcircle")
        .filter(function(t) {
            return t.data.id === d.id;
        }).attr("fill", fillColor)
        .attr("r", 4);

    div.transition()
        .duration(200)
        .style("opacity", .9);

    div.html(
            "<b>" + d.properties.name + "</b><p>" + d.properties.date + "</p>"
        )
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 40) + "px");
}


function battlesMouseOut(d) {
    zoomLevel = map.getZoom();

    if (zoomLevel < 6) {
        radius = 3;
    } else if (zoomLevel >= 6 && zoomLevel < 10) {
        radius = 5;
    } else if (zoomLevel >= 10 && zoomLevel < 15) {
        radius = 7;
    } else if (zoomLevel >= 15) {
        radius = 9;
    }

    d3.select(this).selectAll('.circles')
        .attr("fill", function(d) { return color(d.properties.mainsource); })
        .attr("r", radius);

    d3.selectAll(".bcircle")
        .filter(function(t) {
            return t.data.id === d.id;
        })
        .attr("fill", function(d) { return color(d.data.properties.mainsource); })
        .attr("r", 3);

    div.transition()
        .duration(500)
        .style("opacity", 0);
}

$('.labelsNQ').hide();
$('.labelsK').hide();