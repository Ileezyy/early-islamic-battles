$(function() {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
})

var controls = $('.controls');
var linesLegend = $('.lines-legend');

var colorLine = d3.scaleOrdinal()
    .range(d3.schemeSet1);

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
        linesLegend.append("<div><span>" + i + "</span> <span style='color: " + colorLine(i) + "; font-weight: bold'>&#10145;</span></div>");
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