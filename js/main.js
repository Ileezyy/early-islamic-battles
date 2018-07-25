// Tooltip var
var div = d3.select("div").append("span")
    .attr("class", "tooltip")
    .style("opacity", 0);

var controls = $('.controls');

// Parse Nasab Quraysh json
d3.json("../data/all_battles_new.json", function(error, data) {
    if (error) throw error;

    groupedCheckboxes(data);

    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "battles");

        overlay.draw = function() {
            var projection = this.getProjection(),
                padding = 10;

            var marker = layer.selectAll("svg")
                .data(data)
                .each(transform) // update existing markers
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
                .on("mouseout", battlesMouseOut);

            // Add a circle.
            marker.filter(function(d) { return d.properties.name != ""; })
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
            marker.append("text")
                .attr("x", padding + 12)
                .attr("y", padding - 2)
                .attr("class", function(d) {
                    if (isNaN(d.properties.deaths) || d.properties.deaths < 1) {
                        return "labels labelsK";
                    } else {
                        return "labels labelsNQ";
                    }
                })
                .text(function(d) {
                    return d.properties.name + "  (" + d.properties.date + ")";
                });

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
    });

});

$('#exampleModalCenter').on('show.bs.modal', function(e) {

    var button = $(e.relatedTarget) // Button that triggered the modal
    var pdfname = button.data('pdfname') // Extract info from data-* attributes
    var pdfsrc = button.data('pdfsrc') // Extract info from data-* attributes
    var pdfpage = button.data('pdfpage') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    console.log(pdfname + " " + "pdf/" + pdfsrc);

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