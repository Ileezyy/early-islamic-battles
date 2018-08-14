var icons = ["circle", "caret-up", "square"];

$(document).ready(function() {
    var select = $("#mainsourceicon")
    $.each(icons, function(a, b) {
        // select.append($("<option/>").attr("value", b).text(b));
        select.append("<option><i class='fas fa-" + b + "'></i>some</option>");
    });
    // select.append(select);
});

$(document).ready(function() {
    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $(".upload-container"); //Fields wrapper
    var x = 1; //initlal text box count

    $(".add-more-icon").on("click", function(e) { //on add input button click
        e.preventDefault();

        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $.get("../templates/uploadForm.html", function(data) {
                $(wrapper).append(data);
            });
        }
    });

    $(wrapper).on("click", ".remove_field", function(e) { //user click on remove text
        e.preventDefault();
        $(this).parent().parent('.inside-wrapper').remove();
        x--;
    })
});

$("#battleForm").submit(function(e) {
    e.preventDefault();

    var form_data = new FormData($("#battleForm").get(0));
    var inputFiles = $('#battleForm input[type="file"]');
    var files = [];

    var inputData = $('form#battleForm').serializeObject();
    console.log(inputData);

    if (inputFiles.prop('files').length > 0) {
        inputFiles.each(function() {
            var new_file = $(this).prop('files')[0];
            console.log("ALL files", $(this).prop('files')[0]);
            files.push(new_file);
        });

        $.each(files, function(i, file) {
            form_data.append("file", file);

            $.ajax({
                url: 'php/upload.php', // point to server-side PHP script
                dataType: 'text', // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'POST',
                success: function(output) {
                    console.log(output); // display response from the PHP script, if any
                }
            });
        });

        for (let j = 0; j < files.length; j++) {
            inputData.pdf[j].src = files[j].name;
        }
    }

    d3.json("/data/all_battles_new1.json", function(error, datax) {

        var data = datax.nodes;

        // for (let k = 0; k < data.length; k++) {
        //     data[k].pdf = [{ "name": "", "author": "", "extra": "", "src": "", "startpage": "" }];
        // }

        for (let k = 0; k < data.length; k++) {
            if (data[k].properties.mainsource === "The Great Arab Conquests") {
                data[k].properties.sourceimg = "https://i.imgur.com/MwhL29m.jpg";
            } else if (data[k].properties.mainsource === "Nasab Quraysh") {
                data[k].properties.sourceimg = "https://i.imgur.com/fLb7OAj.jpg";
            } else {
                data[k].properties.sourceimg = "";
            }
        }


        datax.nodes.push(inputData);
        console.log("after push", datax);

        for (let i = 0; i < data.length; i++) {

            data[i].id = "id" + i;
            if (data[i].properties.name !== "") {

                if (typeof data[i].geometry.coordinates[0] === 'string' ||
                    typeof data[i].geometry.coordinates[1] === 'string' ||
                    typeof data[i].properties.deaths === 'string' ||
                    typeof data[i].properties.date === 'string') {

                    data[i].geometry.coordinates[0] = Number(data[i].geometry.coordinates[0]);
                    data[i].geometry.coordinates[1] = Number(data[i].geometry.coordinates[1]);
                    data[i].properties.deaths = Number(data[i].properties.deaths);
                    data[i].properties.date = Number(data[i].properties.date);

                    for (let j = 0; j < data[i].pdf.length; j++) {
                        if (typeof data[i].pdf[j].startpage === 'string') {
                            data[i].pdf[j].startpage = Number(data[i].pdf[j].startpage);
                        }
                    }
                }
            }
        }

        console.log("New", datax);

        saveToFile(datax);
    });
});

function saveToFile(data) {
    var jsonString = JSON.stringify(data);
    var inputForm = document.getElementById('battleForm');
    $.ajax({
        url: 'php/save.php',
        data: {
            'jsonString': jsonString
        },
        type: 'POST',
        success: function() {
            alert("New record has been added");
            inputForm.reset();
        }
    });
}

function saveUpdated(data) {
    var jsonString = JSON.stringify(data);
    $.ajax({
        url: 'php/save.php',
        data: {
            'jsonString': jsonString
        },
        type: 'POST',
        success: function() {
            alert("Record has been updated");
            // window.location.reload();
        }
    });
}

function deleteItem(itemId) {
    var confirmRes = confirm("Do you really want to delete this record?");
    if (confirmRes) {
        d3.json("/data/all_battles_new1.json", function(error, datax) {
            if (error) throw error;

            var data = datax.nodes;
            console.log("before", datax);

            console.log(itemId);

            datax.nodes = data.filter(function(item) {
                return item.id !== itemId;
            });

            // console.log(filtered);
            console.log("after", datax);

            saveDeleted(datax);
        });
    }
}

function saveDeleted(data) {
    var jsonString = JSON.stringify(data);
    $.ajax({
        url: 'php/save.php',
        data: {
            'jsonString': jsonString
        },
        type: 'POST',
        success: function() {
            if (!alert('Item has been deleted successfully')) { window.location.reload(); }
        }
    });
}

$("#resetForm").submit(function(e) {
    e.preventDefault();

    var confirmRes = confirm("Do you really want to reset the database?");
    if (confirmRes) {
        var data = {
            "nodes": [{
                "type": "",
                "geometry": {
                    "type": "",
                    "coordinates": ["", ""]
                },
                "properties": {
                    "name": "",
                    "deaths": "",
                    "date": "",
                    "source": "",
                    "link": "",
                    "text": "",
                    "img": "",
                    "mainsource": ""
                },
                "id": "",
                "pdf": [{
                    "name": "",
                    "author": "",
                    "extra": "",
                    "src": "",
                    "startpage": ""
                }]
            }],
            "links": [{
                "campaign": "",
                "source": "",
                "target": ""
            }]
        };

        saveReset(data);
    }
});

function saveReset(data) {
    alert("Sorry! Permission required. Contact the admin.");
    /*var jsonString = JSON.stringify(data);
    $.ajax({
        url: 'php/save.php',
        data: {
            'jsonString': jsonString
        },
        type: 'POST',
        success: function() {
            if (!alert('Item has been deleted successfully')) { window.location.reload(); }
        }
    });*/
}

$(document).ready(function() {
    d3.json("/data/all_battles_new1.json", function(error, datax) {
        if (error) throw error;

        var data = datax.nodes;

        data = data.sort(function(a, b) { return d3.ascending(a.properties.date, b.properties.date); });

        for (var i in data) {

            if (data[i].properties.name !== "") {
                var name = data[i].properties.name;
                var text = data[i].properties.text;
                var source = data[i].properties.source;
                var mainsource = data[i].properties.mainsource;

                if (name.indexOf("'") >= 0) {
                    name = name.replace(/'/g, '&#39;');
                    console.log(name);
                } else if (source.indexOf("'") >= 0) {
                    source = source.replace(/'/g, '&#39;');
                } else if (text.indexOf("'") >= 0) {
                    text = text.replace(/'/g, '&#39;');
                } else if (text.indexOf("'") >= 0) {
                    mainsource = mainsource.replace(/'/g, '&#39;');
                }

                var listItem = "<a id=" + data[i].id + " class='list-group-item flex-column align-items-start'>" +
                    "<div class='d-flex w-100 justify-content-between'>" + "<div><span>" + data[i].properties.name + "</span><span> (" + data[i].properties.date + ")</span>" +
                    "<!-- <button class='btn collapse-btn' data-target='#col" + data[i].id + "' data-toggle='collapse' role='button' aria-expanded='false' aria-controls='col" + data[i].id + "'>" + "<i class='fas fa-caret-down'></i>" + "</button>--></div>" +
                    "<small>" +
                    "<button class='btn icons-btn' type='button' data-toggle='modal' data-target='#editBattleModal' " +
                    " data-bid='" + data[i].id + "' " +
                    " data-bname='" + name + "' " +
                    " data-bdate='" + data[i].properties.date + "' " +
                    " data-bdeaths='" + data[i].properties.deaths + "' " +
                    " data-blat='" + data[i].geometry.coordinates[0] + "' " +
                    " data-blng='" + data[i].geometry.coordinates[1] + "' " +
                    " data-bsrc='" + source + "' " +
                    " data-blink='" + data[i].properties.link + "' " +
                    " data-bimg='" + data[i].properties.img + "' " +
                    " data-bmainsource='" + mainsource + "' " +
                    " data-btext='" + text + "'><i class='fas fa-edit'></i></button>" +
                    "<button class='btn icons-btn' onclick=deleteItem($(this).closest('a').attr('id'))><i class='fas fa-times-circle'></i></button>" +
                    "</small></div></a>"

                var collapse = "<div class='collapse' id='col" + data[i].id + "'>" +
                    "<div class='card card-body'> " +
                    "<p>Name: " + data[i].properties.name + "</p>" +
                    "<p>Date: " + data[i].properties.date + "</p>" +
                    "</div> </div>";

                $('#battles-list .list-group').append(listItem + collapse);
            }
        }
    });
});

$('#editBattleModal').on('show.bs.modal', function(event) {
    $('.upload-container .inside-wrapper').html("");
    // console.log("sdsd" + data);
    var button = $(event.relatedTarget) // Button that triggered the modal
    var bid = button.data('bid');
    var name = button.data('bname') // Extract info from data-* attributes
    var date = button.data('bdate') // Extract info from data-* attributes
    var lat = button.data('blat') // Extract info from data-* attributes
    var lng = button.data('blng') // Extract info from data-* attributes
    var deaths = button.data('bdeaths') // Extract info from data-* attributes
    var src = button.data('bsrc') // Extract info from data-* attributes
    var img = button.data('bimg') // Extract info from data-* attributes
    var link = button.data('blink') // Extract info from data-* attributes
    var text = button.data('btext') // Extract info from data-* attributes
    var mainsource = button.data('bmainsource') // Extract info from data-* attributes

    var modal = $(this);
    // modal.find('.modal-title').text('The ' + data.name + ' battle')
    modal.find('#editname').val(name);
    modal.find('#editdate').val(date);
    modal.find('#editdeaths').val(deaths);
    modal.find('#editlat').val(lat);
    modal.find('#editlng').val(lng);
    modal.find('#editsrc').val(src);
    modal.find('#editimg').val(img);
    modal.find('#editurl').val(link);
    modal.find('#edittext').val(text);
    modal.find('#editid').val(bid);
    modal.find('#editmainsource').val(mainsource);

    d3.json("/data/all_battles_new1.json", function(error, datax) {
        if (error) throw error;

        var data = datax.nodes;

        for (let i in data) {
            if (bid === data[i].id) {
                console.log(bid);
                for (let j = 0; j < data[i].pdf.length; j++) {
                    var updateUpload = "<div class='form-group col-md-12'>" +
                        "<label class='control-label'>PDF file</label>" +
                        "<div class='file-old-name'><span>Current file name: </span><p>" + data[i].pdf[j].src + "</p></div>" +
                        "<input class='form-control' type='file' name='file' onchange='fileSelected($(this))' accept='application/pdf>" +
                        "<input id='editpdfsrc' type='hidden' name='pdf[][src]' value='" + data[i].pdf[j].src + "'>" +
                        "</div>" +
                        "<div class='form-group col-md-5'> <label class='control-label'>Source title</label>" +
                        "<input id='editpdfname' class='form-control' type='text' name='pdf[][name]' placeholder='Source title' value='" + data[i].pdf[j].name + "'></div>" +
                        "<div class='form-group col-md-5'> <label class='control-label'>Author name</label>" +
                        "<input id='editpdfauthor' class='form-control' type='text' name='pdf[][author]' placeholder='Author name' value='" + data[i].pdf[j].author + "'></div>" +
                        "<div class='form-group col-md-2'> <label class='control-label'>Page</label>" +
                        "<input id='editpdfstartpage' class='form-control' type='number' name='pdf[][startpage]' placeholder='Starting page (1 by default)' min='1' value='" + data[i].pdf[j].startpage + "'></div>" +
                        "<div class='form-group col-md-12'> <label class='control-label'>Additional information</label>" +
                        "<input id='editpdfextra' class='form-control' type='text' name='pdf[][extra]' placeholder='Additional information' value='" + data[i].pdf[j].extra + "'></div>";

                    if (data[i].pdf.length === 1) {
                        $('.upload-container .inside-wrapper').html(updateUpload);

                        if (data[i].pdf[0].src == "") {
                            $('.upload-container .inside-wrapper').html("");
                        }
                    } else {
                        console.log("inside if", data[i].pdf.length);
                        $('.upload-container .inside-wrapper').append(updateUpload);
                    }
                }
            }
        }
    });

});

function fileSelected(e) {
    console.log(e);
    e.closest('.col-md-12').find('p').text(e[0].files[0].name);
    e.closest('.col-md-12').find('p').css("color", "green");
    e.closest('.col-md-12').find('span').text("New file name: ");

}

// update
$("#updateBattleForm").submit(function(e) {
    e.preventDefault();

    var form_data = new FormData($("#updateBattleForm").get(0));
    var inputFile = $('#updateBattleForm input[type="file"]');
    var files = [];
    var inputData = $(this).serializeObject();

    if (inputFile.length > 0 && inputFile.prop('files').length > 0) {

        inputFile.each(function() {
            var new_file = $(this).prop('files')[0];
            files.push(new_file);
        });

        $.each(files, function(i, file) {
            form_data.append("file", file);

            $.ajax({
                url: 'php/upload.php', // point to server-side PHP script
                dataType: 'text', // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'POST',
                success: function(output) {
                    console.log(output); // display response from the PHP script, if any
                }
            });
        });
    } else {
        console.log("Array is 0");
    }

    if (files.length > 0) {
        files = files.filter(function(element) {
            return element !== undefined;
        });

        for (let j = 0; j < files.length; j++) {
            console.log(files);
            inputData.pdf[j].src = files[j].name;
            // console.log("inside for", inputData.pdf[j].src);
        }
    }

    d3.json("/data/all_battles_new1.json", function(error, datax) {
        if (error) throw error;

        var data = datax.nodes;

        console.log(inputData.id);

        for (let i in data) {

            if (inputData.id === data[i].id) {
                data[i] = inputData;
                // console.log(data[i]);
                if (data[i].pdf) {
                    console.log("pdf", data[i]);
                } else {
                    console.log("NOthing");

                }
            }

            if (typeof data[i].geometry.coordinates[0] === 'string' ||
                typeof data[i].geometry.coordinates[1] === 'string' ||
                typeof data[i].properties.deaths === 'string' ||
                typeof data[i].properties.date === 'string') {

                data[i].geometry.coordinates[0] = Number(data[i].geometry.coordinates[0]);
                data[i].geometry.coordinates[1] = Number(data[i].geometry.coordinates[1]);
                data[i].properties.deaths = Number(data[i].properties.deaths);
                data[i].properties.date = Number(data[i].properties.date);

                if (data[i].pdf) {
                    for (let j = 0; j < data[i].pdf.length; j++) {
                        if (typeof data[i].pdf[j].startpage === 'string') {
                            data[i].pdf[j].startpage = Number(data[i].pdf[j].startpage);
                        }
                    }
                }
            }
        }

        console.log(inputData);
        console.log(datax);

        saveUpdated(datax);
    });
});

function searchBattles(input) {
    // Declare variables
    var filter, main, inDiv, a, i;

    // input = document.getElementById('searchListBar');
    filter = input.value.toLowerCase();
    main = document.getElementById("mylist");
    a = main.getElementsByTagName('a');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < a.length; i++) {
        // inDiv = a[i].getElementsByTagName("div")[0].firstChild;
        inDiv = a[i].getElementsByTagName("span")[0];
        inDivNum = a[i].getElementsByTagName("span")[1];
        if (inDiv.innerHTML.toLowerCase().indexOf(filter) > -1 || inDivNum.innerHTML.toLowerCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}