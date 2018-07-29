// Vars
var color = d3.scaleOrdinal()
    .range(d3.schemeCategory10);

var textbox = d3.select(".textbox");

var zoomLevel = map.getZoom();

var cbNQ = true,
    cbKen = true;

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

var index = false;
var sourcesTitle = "";
var imgsrc = "";
var deathsInfo = "";

function battleClick(d) {
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
    // d3.select(this).selectAll('text').attr("fill", "black");
    // if (index) {
    // if (zoomLevel > 0) {
    //     d3.select(this).attr("r", 9).attr("fill", "red");
    // }
    // } else {
    d3.select(this).selectAll('circle.circles').attr("fill", "red");
    // if (d.id === d.data.id || d.data.id === d.id) {
    //     d3.selectAll('circle').attr("fill", "red");
    // }
    if (zoomLevel < 6) {
        d3.select(this).selectAll('circle.circles').attr("r", 3);
    } else if (zoomLevel >= 6 && zoomLevel < 10) {
        d3.select(this).selectAll('circle.circles').attr("r", 5);
    } else if (zoomLevel >= 10 && zoomLevel < 15) {
        d3.select(this).selectAll('circle.circles').attr("r", 8);
    } else if (zoomLevel >= 15) {
        d3.select(this).selectAll('circle.circles').attr("r", 10);
    }

    div.transition()
        .duration(200)
        .style("opacity", .9);

    div.html(
            "<b>" + d.properties.name + "</b><p>" + d.properties.date + "</p>"
        )
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 40) + "px");
    // }
}


function battlesMouseOut(d) {
    // d3.select(this).selectAll('text').attr("fill", "black");
    zoomLevel = map.getZoom();
    // if (index) {
    // if (zoomLevel > 0) {
    //     d3.select(this).attr("r", 9).attr("fill", "red");
    // }
    // } else {
    // if (isNaN(d.properties.deaths) || d.properties.deaths < 1) {
    //     d3.select(this).selectAll('circle').attr("fill", "#008eff");
    // } else {
    //     d3.select(this).selectAll('circle').attr("fill", "black");
    // }
    d3.select(this).selectAll('circle').attr("fill", function(d) { return color(d.properties.mainsource); })

    if (zoomLevel < 6) {
        d3.select(this).selectAll('circle.circles').attr("r", 2);
    } else if (zoomLevel >= 6 && zoomLevel < 10) {
        d3.select(this).selectAll('circle.circles').attr("r", 4);
    } else if (zoomLevel >= 10 && zoomLevel < 15) {
        d3.select(this).selectAll('circle.circles').attr("r", 7);
    } else if (zoomLevel >= 15) {
        d3.select(this).selectAll('circle.circles').attr("r", 10);
    }

    div.transition()
        .duration(500)
        .style("opacity", 0);
    // }
}



$('.labelsNQ').hide();
$('.labelsK').hide();