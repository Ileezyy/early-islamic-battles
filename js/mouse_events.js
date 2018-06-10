// Vars
var textbox = d3.select(".textbox");

var zoomLevel = map.getZoom();

// Mouse events functions
function nqsource(cb) {
    if (cb.checked) {
        $('.circleNQ').show();
    } else {
        $('.circleNQ').hide();
        $('.labelsNQ').hide();
    }
}

function kensource(cb) {
    if (cb.checked) {
        $('.circleK').show();
    } else {
        $('.circleK').hide();
        $('.labelsK').hide();
    }
}

function battleClick(d) {
    textbox.html(
        "<h2>" + d.properties.name + "</h2><p>" + d.properties.date + "</p><br><p> Deaths: " + d.properties.deaths + "</p><br>" + "<img class=\"circle-img\" src=\"" + d.properties.img + "\">" +
        "<p>" + d.properties.text + "</p><p>ref: " + d.properties.source + "</p><a href=\"" + d.properties.link + "\">" + d.properties.link + "</a>"
    ).style('color', '#000');
};

function battlesMouseOver(d) {
    if (zoomLevel <= 6) {
        d3.select(this).attr("r", 4);
    } else if (zoomLevel >= 6 && zoomLevel <= 8) {
        d3.select(this).attr("r", 5);
    } else if (zoomLevel >= 8) {
        d3.select(this).attr("r", 9);
    }

    div.transition()
        .duration(200)
        .style("opacity", .9);

    div.html(
            "<b>" + d.properties.name + "</b><p>" + d.properties.date + "</p>"
        )
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 40) + "px");
};

function battlesMouseOut(d) {
    zoomLevel = map.getZoom();
    if (zoomLevel <= 6) {
        d3.select(this).attr("r", 2);
    } else if (zoomLevel >= 6 && zoomLevel <= 8) {
        d3.select(this).attr("r", 3);
    } else if (zoomLevel >= 8) {
        d3.select(this).attr("r", 7);
    }

    div.transition()
        .duration(500)
        .style("opacity", 0);
};

$('.labelsNQ').hide();
$('.labelsK').hide();