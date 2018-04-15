var width = 1100,
    height = 747;

var projection = d3.geoEquirectangular()
    .center([46.8, 29.25])
    .scale(1720);

var canvas = d3.select(".svg-container").append("canvas")
    .attr("width", width)
    .attr("height", height);

var svg = d3.select(".new-container").append("svg")
    .attr("width", width)
    .attr("height", height);

var context = canvas.node().getContext("2d");

var pathNew = d3.geoPath()
    .projection(projection);

var path = d3.geoPath()
    .projection(projection).context(context);

var checkBox = document.getElementById("reliefCB");
var isChecked = checkBox.checked;

d3.json("../data/middleeast.json", function(error, arab) {
    d3.json("../data/battles-geo.json", function(error, battles) {

        var battlesData = topojson.feature(battles, battles.objects.battles_geojson).features;
        var countries = topojson.feature(arab, arab.objects.countries).features;

        svg.selectAll(".countries")
            .data(topojson.feature(arab, arab.objects.countries).features)
            .enter().append("path")
            .attr("class", function(d) {
                if (isChecked === true) {
                    return "country " + d.properties.GU_A3;
                } else {
                    $('path').removeClass('country');
                    return "no-relief " + d.properties.GU_A3;
                }
            })
            .attr("d", pathNew)
            .append('svg:title')
            .text(function(d) { return d.properties.NAME; });

        var points = svg.selectAll(".point")
            .data(battlesData);

        points.exit().remove();

        points.enter().append("circle")
            .attr("r", function(d) {
                return d.properties.deaths / 1.5;
            })
            .attr("transform", function(d) {
                return "translate(" + projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]) + ")";
            })
            .attr("class", function(d) {
                return "point " + d.properties.name;
            })
            .append('svg:title')
            .text(function(d) { return d.properties.deaths; });

        var labels = svg.selectAll(".battle-label")
            .data(battlesData);
        labels.exit().remove();
        labels.enter().append("text")
            .attr("class", function(d) {
                return "battle-label " + d.properties.name;
            })
            .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
            .attr("x", function(d) { return d.geometry.coordinates[0] > -3 ? 8 : -8; })
            .attr("dy", ".35em")
            .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -3 ? "start" : "end"; })
            .text(function(d) {
                return d.properties.name;
            });
    });
});

function draw(cb) {
    if (cb.checked === true) {
        d3.request("../data/arabian.tif")
            .responseType('arraybuffer')
            .get(function(error, tiffData) {
                d3.json("../data/toporivers.json", function(error, allrivers) {
                    var riversData = topojson.feature(allrivers, allrivers.objects.allrivers).features;
                    var tiff = GeoTIFF.parse(tiffData.response);
                    var image = tiff.getImage();
                    var rasters = image.readRasters();
                    var tiepoint = image.getTiePoints()[0];
                    var pixelScale = image.getFileDirectory().ModelPixelScale;
                    var geoTransform = [tiepoint.x, pixelScale[0], 0, tiepoint.y, 0, -1 * pixelScale[1]];
                    var invGeoTransform = [-geoTransform[0] / geoTransform[1], 1 / geoTransform[1], 0, -geoTransform[3] / geoTransform[5], 0, 1 / geoTransform[5]];

                    var tempData = new Array(image.getHeight());
                    for (var j = 0; j < image.getHeight(); j++) {
                        tempData[j] = new Array(image.getWidth());
                        for (var i = 0; i < image.getWidth(); i++) {
                            tempData[j][i] = rasters[1][i + j * image.getWidth()];
                        }
                    }

                    var imgData = image.readRGB(function(raster) {
                        canvas.width = image.getWidth();
                        canvas.height = image.getHeight();
                        var imageData = context.createImageData(image.getWidth(), image.getHeight());
                        var data = imageData.data;
                        var o = 0;
                        for (var i = 0; i < raster.length; i += 9) {
                            data[o] = raster[i];
                            data[o + 1] = raster[i + 1];
                            data[o + 2] = raster[i + 2];
                            data[o + 3] = 255;
                            o += 4;
                        }

                        context.putImageData(imageData, 0, 0);

                        var grdH = context.createLinearGradient(0, 0, 1090, 0);
                        grdH.addColorStop(0, "rgba(255,255,255,0)");
                        grdH.addColorStop(0.85, "rgba(255,255,255,0)");
                        grdH.addColorStop(1, "white");

                        context.fillStyle = grdH;
                        context.fillRect(0, 0, canvas.width, canvas.height);

                        var grdV = context.createLinearGradient(0, 0, 0, 745);
                        grdV.addColorStop(0, "rgba(255,255,255,0)");
                        grdV.addColorStop(0.85, "rgba(255,255,255,0)");
                        grdV.addColorStop(1, "white");

                        context.fillStyle = grdV;
                        context.fillRect(0, 0, canvas.width, canvas.height);

                        var grdD = context.createLinearGradient(0, 0, 1095, 746);
                        grdD.addColorStop(0, "rgba(255,255,255,0)");
                        grdD.addColorStop(0.5, "rgba(255,255,255,0)");
                        grdD.addColorStop(1, "white");

                        context.fillStyle = grdD;
                        context.fillRect(0, 0, canvas.width, canvas.height);
                    });
                    svg.selectAll(".rivers")
                        .attr("display", "inline")
                        .data(riversData)
                        .enter().append("path")
                        .attr("class", function(d) {
                            return "rivers " + d.properties.name;
                        })
                        .attr("d", pathNew);

                    $('.no-relief').addClass('country');
                    $('.no-relief').removeClass('no-relief');

                });
            });
    } else {
        context.clearRect(0, 0, width, height);
        svg.selectAll(".rivers")
            .attr("display", "none");

        $('.country').addClass('no-relief');
        $('.country').removeClass('country');
    }
}