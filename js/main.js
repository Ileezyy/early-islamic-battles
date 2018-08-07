// Tooltip var
var div = d3.select("div").append("span")
    .attr("class", "tooltip")
    .style("opacity", 0);

$(function() {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
})

var controls = $('.controls');
var linesLegend = $('.lines-legend');

var colorLine = d3.scaleOrdinal()
    .range(d3.schemeAccent);

// Parse Nasab Quraysh json
d3.json("../data/all_battles_new1.json", function(error, datax) {
    if (error) throw error;

    var data = datax.nodes;

    var opacityScale = d3.scaleLinear().domain(d3.extent(data, function(d) {
        return d.properties.date;
    })).range([0.15, 1]);

    groupedCheckboxes(data);
    linesLegends(datax.links);
    battlesList(data);

    // lines color
    // var colorLine = d3.scaleOrdinal()
    //     .domain(d3.extent(data, function(d) {
    //         return d.properties.date;
    //     }))
    //     .range(["#ffebcc", "#ffd699", "#ffc266", "#ffad33", "#ff9900", "#cc7a00", "#995c00", "#663d00", "#331f00"]);

    // var colorLine = d3.scaleOrdinal(d3.interpolateBlues).range(d3.extent(data, function(d) {
    //     return d.properties.date;
    // }));

    // var colorLine = d3.scaleLinear()
    //     .domain([d3.min(data, function(d) { return d.properties.date }), d3.max(data, function(d) { return d.properties.date })])
    //     .range(["red", "white", "green", "blue", "yellow", "black"]);

    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "battles");

        overlay.draw = function() {
            var radius = 3;

            var projection = this.getProjection(),
                padding = 10;

            var node_coord = {};

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
                });

            var markerLink = layer.selectAll(".links")
                .data(datax.links)
                .each(pathTransform)
                .enter().append("svg")
                .attr("class", "links")
                .style("position", "absolute")
                .style("display", "none")
                .each(pathTransform);

            var outer = marker.append("g");

            // Add a circle.
            outer.filter(function(d) { return d.properties.name != ""; })
                .append("circle")
                .attr("r", 3)
                .attr("cx", padding)
                .attr("cy", padding)
                .attr("fill", function(d) { return color(d.properties.mainsource); })
                .style("opacity", function(d) { return opacityScale(d.properties.date); })
                .attr("stroke", "#eee")
                .attr("stroke-width", 1)
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

            function pathTransform(d) {
                var t, b, l, r, w, h, currentSvg;
                var d1 = new Object();
                var d2 = new Object();
                $(this).empty();
                d1.x = node_coord[d.source + "," + 0]
                d1.y = node_coord[d.source + "," + 1]
                d2.x = node_coord[d.target + "," + 0]
                d2.y = node_coord[d.target + "," + 1]

                if (d1.y < d2.y) {
                    t = d1.y;
                    b = d2.y;
                } else {
                    t = d2.y;
                    b = d1.y;
                }
                if (d1.x < d2.x) {
                    l = d1.x;
                    r = d2.x;
                } else {
                    l = d2.x;
                    r = d1.x;
                }

                var x1 = 0,
                    y1 = 0,
                    x2 = 0,
                    y2 = 0;
                if ((d1.y < d2.y) && (d1.x < d2.x)) {
                    x2 = r - l;
                    y2 = b - t;
                } else if ((d1.x > d2.x) && (d1.y > d2.y)) {
                    x2 = r - l;
                    y2 = b - t;
                } else if ((d1.y < d2.y) && (d1.x > d2.x)) {
                    x1 = r - l;
                    y2 = b - t;
                } else if ((d1.x < d2.x) && (d1.y > d2.y)) {
                    x1 = r - l;
                    y2 = b - t;
                }

                var dx = x2 - x1,
                    dy = y2 - y1,
                    dr = Math.sqrt(dx * dx + dy * dy);

                currentSvg = d3.select(this)
                    .style("left", (l + 2 * radius) + "px")
                    .style("top", (t + 2 * radius) + "px")
                    .style("width", (r - l + radius) + "px")
                    .style("height", (b - t + radius) + "px");

                currentSvg.append("svg:defs")
                    .append("svg:marker")
                    .attr("id", "arrow")
                    .attr("refX", 6)
                    .attr("refY", 6)
                    .attr("markerWidth", 20)
                    .attr("markerHeight", 20)
                    .attr("orient", "auto")
                    .append("path")
                    .attr("d", "M 0 0 12 6 0 12 3 6")
                    .style("fill", "rgba(0,0,0,0.25)");

                currentSvg.append("svg:line")
                    .style("stroke-width", 1.5)
                    .style("stroke", function(d) { return colorLine(d.campaign) })
                    .attr("x1", x1)
                    .attr("y1", y1)
                    .attr("x2", x2)
                    .attr("y2", y2)
                    .attr("marker-end", "url(#arrow)");

                // var pathe = "M" + x1 + "," + y1 +
                //     "A" + dr + "," + dr + " 0 0 1," + x2 + "," + y2;

                // currentSvg.append("svg:path")
                //     .attr("d", pathe)
                //     .style("stroke-width", 2)
                //     .style("stroke", function(d) { return color(d.campaign) })
                //     .style("fill", "none")
                //     .attr("marker-middle", "url(#arrow)");

                return currentSvg;
            }

            // Populate map with data
            function transform(d, i) {
                d = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
                d = projection.fromLatLngToDivPixel(d);

                node_coord[i + "," + 0] = d.x - padding;
                node_coord[i + "," + 1] = d.y - padding;

                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            };

            marker.on("click", battleClick)
                .on("mouseover", battlesMouseOver)
                .on("mouseout", battlesMouseOut);

            d3.selectAll('.blist-map .item').data(data).on("click", battleClick);
        };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);

    $(".sourcescb").change(function() {
        var type = this.value,
            display = this.checked ? "inline" : "none";

        d3.selectAll(".circles")
            .filter(function(d) { return d.properties.mainsource === type; })
            .attr("display", display);

        d3.selectAll(".labels")
            .filter(function(d) { return d.properties.mainsource === type; })
            .attr("display", display);

        d3.selectAll(".bcircle")
            .filter(function(d) { return d.data.properties.mainsource === type; })
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

function linesLegends(data) {
    var groupedData = _.groupBy(data, function(d) { return d.campaign; });

    for (let i in groupedData) {
        linesLegend.append("<div><span>" + i + "</span> <span style='color: " + colorLine(i) + "; font-weight: bold'>&#10230;</span></div>");
    }
}

function groupedCheckboxes(data) {
    var groupedDatas = _.groupBy(data, function(d) { return d.properties.mainsource; });
    var sourceimg = "",
        tooltip;

    for (let i in groupedDatas) {
        if (groupedDatas[i][0].properties.sourceimg !== "") {
            sourceimg = groupedDatas[i][0].properties.sourceimg;
            // tooltip = "<button data-toggle=\"tooltip\" data-html=\"true\" data-placement=\"auto\" title=\"<div style='padding: 0; width: 60px; height: 120px; background: center / contain no-repeat url(" + sourceimg + ")'></div>\">" + i + "</button>"
            tooltip = "<button data-toggle=\"tooltip\" data-html=\"true\" title=\"<img height='160px' src='" + sourceimg + "'>\">" + i + "</button>"
        } else {
            sourceimg = "";
            tooltip = "<button data-toggle=\"tooltip\" data-html=\"true\" title=\"" + i + "\">" + i + "</button>"
        }

        controls.append("<input class='sourcescb' type='checkbox' name='" + i + "' value='" + i + "' checked> " +
            "<span style='display: inline-block; width: 10px; height: 10px; border-radius: 100%; background-color: " + color(i) + "'></span>" + tooltip + "<br>");
    }
}

function battlesList(d) {

    var nd = d.sort(function(a, b) { return d3.ascending(a.properties.date, b.properties.date); });

    var listItem = "";

    for (var i in nd) {
        if (nd[i].properties.name !== "") {
            listItem = "<div class='item' lat='" + nd[i].geometry.coordinates[1] + "' lng='" + nd[i].geometry.coordinates[0] + "' id='" + nd[i].id + "' style='color:" + color(nd[i].properties.mainsource) + "' onclick='bitemClick()' onmouseover='bitemHover($(this))' onmouseout='bitemOut($(this))'><p>" + nd[i].properties.name + "</p><p>" + nd[i].properties.date + "</p></div>";
            $(".blist-map").append(listItem);
        }
    }
}

function searchBattlesOnMap(input) {
    // Declare variables
    var filter, main, inDiv, a, i;

    // input = document.getElementById('searchListBar');
    filter = input.value.toLowerCase();
    main = document.getElementById("mapList");
    a = main.getElementsByTagName('div');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < a.length; i++) {
        // inDiv = a[i].getElementsByTagName("div")[0].firstChild;
        inDiv = a[i].getElementsByTagName("p")[0];
        inDivNum = a[i].getElementsByTagName("p")[1];
        if (inDiv.innerHTML.toLowerCase().indexOf(filter) > -1 || inDivNum.innerHTML.toLowerCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
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
        radius = 4;
    } else if (zoomLevel >= 6 && zoomLevel < 10) {
        radius = 6;
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
        radius = 3;
    } else if (zoomLevel >= 6 && zoomLevel < 10) {
        radius = 5;
    } else if (zoomLevel >= 10 && zoomLevel < 15) {
        radius = 7;
    } else if (zoomLevel >= 15) {
        radius = 9;
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
    var listBtnIcon = $(".fa-list");

    closeBtnIcon.hide();

    if (rClicked) {
        $(".blist-container").slideDown();
        closeBtnIcon.show();
        listBtnIcon.hide();
    } else {
        $(".blist-container").slideUp();
        closeBtnIcon.hide();
        listBtnIcon.show();
    }
});