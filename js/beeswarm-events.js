function mouseOverCircle(d) {

    if (zoomLevel < 6) {
        radius = 4;
    } else if (zoomLevel >= 6 && zoomLevel < 10) {
        radius = 6;
    } else if (zoomLevel >= 10 && zoomLevel < 15) {
        radius = 8;
    } else if (zoomLevel >= 15) {
        radius = 10;
    }

    d3.selectAll('.circles')
        .filter(function(t) { return t.id === d.data.id })
        .attr("fill", fillColor)
        .attr("r", radius);

    ttDiv.transition()
        .duration(200)
        .style("opacity", .9);

    ttDiv.html(
        "<b>" + d.data.properties.name + "</b><p>" + d.data.properties.date + " AD</p>"
    );
}

function mouseOutCircle(d) {

    if (zoomLevel < 6) {
        radius = 3;
    } else if (zoomLevel >= 6 && zoomLevel < 10) {
        radius = 5;
    } else if (zoomLevel >= 10 && zoomLevel < 15) {
        radius = 7;
    } else if (zoomLevel >= 15) {
        radius = 9;
    }

    d3.selectAll('.circles')
        .filter(function(t) { return t.id === d.data.id })
        .attr("fill", function(t) { return color(t.properties.mainsource); }).attr("r", radius);

    ttDiv.style("opacity", 0);
}

function startAnim() {
    var first = myslider.noUiSlider.get()[0];
    var second = myslider.noUiSlider.get()[1];

    timerVar = setInterval(function() {
        /// call your function here
        if (first < 750 || second < 750) {
            myslider.noUiSlider.set([first++, second++]);
        }
    }, 1000);
}

function stopAnim() {
    clearInterval(timerVar);
}

function playAnimation() {
    temp = !temp;
    if (temp) {
        startAnim();
        $("#animPlayBtn").html("Pause");
    } else {
        stopAnim();
        $("#animPlayBtn").html("Play");
    }
}