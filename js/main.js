// Tooltip var
var div = d3.select("div").append("span")
    .attr("class", "tooltip")
    .style("opacity", 0);

var controls = $('.controls');

// Parse Nasab Quraysh json
d3.json("../data/all_battles_new.json", function(error, data) {
    if (error) throw error;

    groupedCheckboxes(data);
    battlesList(data);

    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "battles");

        overlay.draw = function() {
            var projection = this.getProjection(),
                padding = 10;

            var marker = layer.selectAll("svg")
                .data(data)
                .each(transform) // update existing marker
                .enter().append("svg")
                .each(transform)
                .attr("class", function(d) {
                    if (isNaN(d.properties.deaths) || d.properties.deaths < 1) {
                        return "marker markerK";
                    } else {
                        return "marker markerNQ";
                    }
                }).on("click", battleClick)
                .on("mouseover", battlesMouseOver)
                .on("mouseout", battlesMouseOut);;

            var outer = marker.append("g");
            var arcGroup = layer.append('g');

            // Add a circle.
            outer.filter(function(d) { return d.properties.name != ""; })
                .append("circle")
                .attr("r", 2)
                .attr("cx", padding)
                .attr("cy", padding)
                .attr("fill", function(d) { return color(d.properties.mainsource); })
                .attr("class", function(d) {
                    var name = d.properties.name;
                    name = name.replace(/[\W\s]/g, '');
                    return "circles " + name;
                });
            // marker

            // Add a label.
            outer.append("text")
                .attr("x", padding + 12)
                .attr("y", padding - 2)
                .attr("class", "labels")
                .text(function(d) {
                    return d.properties.name + "  (" + d.properties.date + ")";
                });

            var links = [{
                type: "LineString",
                coordinates: [
                    [data[0].geometry.coordinates[0], data[0].geometry.coordinates[1]],
                    [data[1].geometry.coordinates[0], data[0].geometry.coordinates[1]]
                ]
            }];

            d3.selectAll('.blist-map .item').data(data).on("click", battleClick);

            // Standard enter / update
            var pathArcs = arcGroup.selectAll(".arc")
                .data(links);

            //enter
            pathArcs.enter()
                .append("path")
                .attr('class', 'arc')
                .attr('stroke', '#0000ff')
                .attr('stroke-width', '2px');

            /*update
            pathArcs.attr({
                    //d is the points attribute for this path, we'll draw
                    //  an arc between the points using the arc function
                    d: projection
                });*/

            // Populate map with data
            function transform(d) {
                d = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            };
        };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);

    $(".sourcescb").change(function() {
        var type = this.value,
            // I *think* "inline" is the default.
            display = this.checked ? "inline" : "none";

        d3.selectAll(".circles")
            .filter(function(d) { return d.properties.mainsource === type; })
            .attr("display", display);

        d3.selectAll(".labels")
            .filter(function(d) { return d.properties.mainsource === type; })
            .attr("display", display);
    });

});

$('#exampleModalCenter').on('show.bs.modal', function(e) {

    var button = $(e.relatedTarget) // Button that triggered the modal
    var pdfname = button.data('pdfname') // Extract info from data-* attributes
    var pdfsrc = button.data('pdfsrc') // Extract info from data-* attributes
    var pdfpage = button.data('pdfpage') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);

    pdfsrc = "pdf/" + pdfsrc;

    var options = {
        height: "500px",
        width: "100%",
        page: pdfpage
    };

    PDFObject.embed(pdfsrc, "#pdf-container", options);

    modal.find('.modal-title').text(pdfname);
});

function groupedCheckboxes(data) {
    var groupedData = _.groupBy(data, function(d) { return d.properties.mainsource; });

    for (let i in groupedData) {
        controls.append("<input class='sourcescb' type='checkbox' name='" + i + "' value='" + i + "' checked> " +
            "<span style='display: inline-block; width: 10px; height: 10px; border-radius: 100%; background-color: " + color(i) + "'></span> " + i + " <br>");
    }
}

function battlesList(d) {

    d = d.sort(function(a, b) { return d3.ascending(a.properties.date, b.properties.date); });

    var listItem = "";

    for (var i in d) {
        if (d[i].properties.name !== "") {
            listItem = "<div class='item' lat='" + d[i].geometry.coordinates[1] + "' lng='" + d[i].geometry.coordinates[0] + "' id='" + d[i].id + "' style='color:" + color(d[i].properties.mainsource) + "' onclick='bitemClick()' onmouseover='bitemHover($(this))' onmouseout='bitemOut($(this))'><p>" + d[i].properties.name + "</p><p>" + d[i].properties.date + "</p></div>";
            $(".blist-map").append(listItem);
        }
    }
}

function bitemClick(d) {
    battleClick(d);
}

function bitemHover(d) {
    var bid = $(d).prop('id');
    var lat = $(d).attr('lat');
    var lng = $(d).attr('lng');
    var newPos = new google.maps.LatLng(lat, lng);

    if (zoomLevel < 6) {
        radius = 3;
    } else if (zoomLevel >= 6 && zoomLevel < 10) {
        radius = 5;
    } else if (zoomLevel >= 10 && zoomLevel < 15) {
        radius = 8;
    } else if (zoomLevel >= 15) {
        radius = 10;
    }

    $(d).addClass("itemOnHover");

    // map.setCenter(newPos);

    d3.selectAll(".circles")
        .filter(function(d) { return d.id === bid; })
        .attr("fill", fillColor)
        .attr("r", radius);

    d3.selectAll(".bcircle")
        .filter(function(d) { return d.data.id === bid; })
        .attr("fill", fillColor)
        .attr("r", 4);
}

function bitemOut(d) {
    var bid = $(d).prop('id');

    if (zoomLevel < 6) {
        radius = 2;
    } else if (zoomLevel >= 6 && zoomLevel < 10) {
        radius = 4;
    } else if (zoomLevel >= 10 && zoomLevel < 15) {
        radius = 7;
    } else if (zoomLevel >= 15) {
        radius = 10;
    }

    $(d).removeClass("itemOnHover");

    d3.selectAll(".circles")
        .filter(function(d) { return d.id === bid; })
        .attr("fill", function(d) { return color(d.properties.mainsource); })
        .attr("r", radius);

    d3.selectAll(".bcircle")
        .filter(function(d) { return d.data.id === bid; })
        .attr("fill", function(d) { return color(d.data.properties.mainsource); })
        .attr("r", 3);
}

var rClicked = false;

$(".round-btn").on("click", function() {
    rClicked = !rClicked;

    var closeBtnIcon = $(".fa-times");
    var listBtnIcon = $(".fa-list-ul");

    closeBtnIcon.hide();

    if (rClicked) {
        $(".blist-map").slideDown();
        closeBtnIcon.show();
        listBtnIcon.hide();
    } else {
        $(".blist-map").slideUp();
        closeBtnIcon.hide();
        listBtnIcon.show();
    }
});