$(document).ready(function() {
    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $(".upload-container"); //Fields wrapper
    var add_button = $("#addmorebtn"); //Add button ID

    var x = 1; //initlal text box count
    $(add_button).on("click", function(e) { //on add input button click
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
        $(this).parent().parent('div').remove();
        x--;
    })
});

$("#battleForm").submit(function(e) {
    e.preventDefault();

    var form_data = new FormData($("#battleForm").get(0));
    var files = [];

    $('input[type="file"]').each(function() {
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

    var inputData = $('form#battleForm').serializeObject();

    console.log(inputData);

    for (let j = 0; j < files.length; j++) {
        inputData.pdf[j].src = files[j].name;
        console.log("inside for", inputData.pdf[j].src);
    }

    d3.json("/data/all_battles_new.json", function(error, data) {

        /*for (let k = 0; k < data.length; k++) {
            data[k].pdf = [{ "name": "", "author": "", "pubdate": "", "src": "", "startpage": "", "dateofdeath": "" }];
        }*/

        data.push(inputData);

        for (let i = 0; i < data.length; i++) {
            data[i].id = "id" + i;

            if (typeof data[i].geometry.coordinates[0] === 'string' ||
                typeof data[i].geometry.coordinates[1] === 'string' ||
                typeof data[i].properties.deaths === 'string' ||
                typeof data[i].properties.date === 'string') {

                data[i].geometry.coordinates[0] = Number(data[i].geometry.coordinates[0]);
                data[i].geometry.coordinates[1] = Number(data[i].geometry.coordinates[1]);
                data[i].properties.deaths = Number(data[i].properties.deaths);
                data[i].properties.date = Number(data[i].properties.date);

                for (let j = 0; j < data[i].pdf.length; j++) {
                    console.log(data[i].pdf[j]);

                    if (typeof data[i].pdf[j].startpage === 'string' ||
                        typeof data[i].pdf[j].pubdate === 'string') {

                        data[i].pdf[j].pubdate = Number(data[i].pdf[j].pubdate);
                        data[i].pdf[j].startpage = Number(data[i].pdf[j].startpage);
                    }
                }
            }
        }

        console.log("New", data);

        saveToFile(data);
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
            window.location.reload();
        }
    });
}

function deleteItem(itemId) {
    var confirmRes = confirm("Do you really want to delete this record?");
    if (confirmRes) {
        d3.json("/data/all_battles_new.json", function(error, data) {
            if (error) throw error;

            console.log(itemId);

            var filtered = data.filter(function(item) {
                return item.id !== itemId;
            });

            console.log(filtered);

            saveDeleted(filtered);
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

$(document).ready(function() {
    d3.json("/data/all_battles_new.json", function(error, data) {
        if (error) throw error;

        data = data.sort(function(a, b) { return d3.ascending(a.properties.date, b.properties.date); })

        for (var i in data) {
            var listItem = "<a id=" + data[i].id + " class='list-group-item flex-column align-items-start'>" +
                "<div class='d-flex w-100 justify-content-between'>" + "<div>" + data[i].properties.name + " (" + data[i].properties.date + ") " +
                "<button class='btn collapse-btn' data-target='#col" + data[i].id + "' data-toggle='collapse' role='button' aria-expanded='false' aria-controls='col" + data[i].id + "'>" + "<i class='fas fa-caret-down'></i>" + "</button></div>" +
                "<small>" +
                "<button class='btn icons-btn' type='button' data-toggle='modal' data-target='#editBattleModal' " +
                " data-bid='" + data[i].id + "' " +
                " data-bname='" + data[i].properties.name + "' " +
                " data-bdate='" + data[i].properties.date + "' " +
                " data-bdeaths='" + data[i].properties.deaths + "' " +
                " data-blat='" + data[i].geometry.coordinates[0] + "' " +
                " data-blng='" + data[i].geometry.coordinates[1] + "' " +
                " data-bsrc='" + data[i].properties.source + "' " +
                " data-blink='" + data[i].properties.link + "' " +
                " data-bimg='" + data[i].properties.img + "' " +
                " data-btext='" + data[i].properties.text + "'><i class='fas fa-edit'></i></button>" +
                "<button class='btn icons-btn' onclick=deleteItem($(this).closest('a').attr('id'))><i class='fas fa-times-circle'></i></button>" +
                "</small></div></a>"

            var collapse = "<div class='collapse' id='col" + data[i].id + "'>" +
                "<div class='card card-body'> " +
                "<p>Name: " + data[i].properties.name + "</p>" +
                "<p>Date: " + data[i].properties.date + "</p>" +
                "</div> </div>";

            $('#battles-list .list-group').append(listItem + collapse);
        }
    });
});

$('#editBattleModal').on('show.bs.modal', function(event) {
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

    // var text = button.data('editpdf-file') // Extract info from data-* attributes
    // var text = button.data('editpdf-src') // Extract info from data-* attributes

    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    console.log("sdsd", name);

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
});

// update
$("#updateBattleForm").submit(function(e) {
    e.preventDefault();

    var inputData = $(this).serializeObject();

    d3.json("/data/all_battles_new.json", function(error, data) {
        if (error) throw error;

        console.log(inputData.id);

        for (let i in data) {
            if (inputData.id === data[i].id) {
                data[i] = inputData;
            }

            if (typeof data[i].geometry.coordinates[0] === 'string' ||
                typeof data[i].geometry.coordinates[1] === 'string' ||
                typeof data[i].properties.deaths === 'string' ||
                typeof data[i].properties.date === 'string') {

                data[i].geometry.coordinates[0] = Number(data[i].geometry.coordinates[0]);
                data[i].geometry.coordinates[1] = Number(data[i].geometry.coordinates[1]);
                data[i].properties.deaths = Number(data[i].properties.deaths);
                data[i].properties.date = Number(data[i].properties.date);
            }
        }
        console.log(inputData);
        console.log(data);

        saveUpdated(data);
    });
});