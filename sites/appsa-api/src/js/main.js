import './../css/custom.css';
const axios = require("axios");
const baseurl = $("meta[name=path]").attr("content");


let post_data = {};
let project_option = () => {
    return $("input[name='project-option']:checked").map(function(_, el) {
        return $(el).val();
    }).get();
};

let project_selection = () => {
    return $("input[name='project-selection']:checked").map(function(_, el) {
        return $(el).val();
    }).get();
};

let project_type = () => {
    return $("input[name='period-type']:checked").map(function(_, el) {
        return $(el).val();
    }).get();
};

let date_selected = (x) => {
    return $("#period-" + x + "-select option:selected").text();
};

let showModal = (html) => {
    $(".modal-data").children().remove();
    $(".modal-data").append("<div>" + html + "</div>");
    $("#modal").modal('toggle');
    $('#modal').on('hidden.bs.modal', function() {
        $(".modal-data").children().remove();
        $(".text-comment").remove();
    });
};

let generateModal = (data) => {
    data = JSON.parse(data);
    if (data.length > 0) {
        let indicator = (data[0]['indicator_name']);
        let indicator_id = (data[0]['indicator_id']);
        let dimension_name = (data[0]['dimension_name']);
        $("#modal-title").text(indicator);
        $("#modal-subtitle").text(dimension_name);
        let html = "<table class='table table-striped'>";
        html += "<thead>";
        html += "<tr>";
        html += "<td>Report Date</td>";
        html += "<td>Country</td>";
        html += "<td>Disaggregation</td>";
        html += "<td>Value</td>";
        html += "</tr>"
        html += "</thead>";
        html += "<tbody>";
        let content = data.map(x => {
            html += "<tr>";
            html += "<td>" + x.date + "</td>";
            html += "<td>" + x.country + "</td>";
            html += "<td>" + x.commodity + "</td>";
            html += "<td>" + x.value + "</td>";
            html += "</tr>";
        });
        html += "</tbody>";
        html += "<table>";
        showModal(html);
        axios.get('/api/indicator_period_framework/indicator/' + indicator_id)
            .then(response => {
                $(".text-comment").remove();
                response.data.map(x => {
                    if (x['actual_comment'].length > 0) {
                        $(".modal-comment").append("<div class='text-comment'>" + x['actual_comment'] + "</div>");
                    }
                });
            });
        return true;
    }
    return true;
};

let generateGroup = (val, json) => {
    let html = "<td class='text-right has-data' data-details='" + JSON.stringify(json) + "'>" + val + "</td>";
    return html;
}

let generateReport = (pd) => {
    $("#generate-report i").show();
    axios.post(baseurl + "/api/datatables/" + pd.project_id, pd)
        .then(response => {
            generateTable(response.data);
        })
        .catch(error => { console.log(error); })
};


let update_data = () => {
    let inputVal = project_type();
    let pt = '';
    if (inputVal.length > 0) {
        pt = inputVal[0];
    }
    if (pt === "yearly") {
        $("#period-semester").prop("checked", false);
    }
    if (pt === "semester") {
        $("#period-yearly").prop("checked", false);
    }
    let data = {
        'filter_date': date_selected(pt),
        'project_id': project_selection(),
        'project_option': project_option(),
    };
    return data;
};

$("#generate-report").on('click', () => {
    post_data = update_data();
    generateReport(post_data);
});

let destroyTable = () => {
    let table = $("#rsr_table").Datatable();
    table.destroy();
    table.empty();
    $("#rsr_table tbody").children().remove();
};

let createRow = (data, col_type, country) => {
    col_type += "-" + country;
    let details = col_type + "-D";
    let tdclass = "no-data";
    if (data[details] !== null) {
        tdclass = "has-data";
    }
    let html = "<td class='text-right " + tdclass + "' data-details='" + JSON.stringify(data[details]) + "'>";
    html += data[col_type];
    html += "</td>";
    return html;
}

let generateTable = (response) => {
    if ($.fn.DataTable.isDataTable('#rsr_table')) {
        $('#rsr_table').DataTable().destroy();
    }
    $('#rsr_table tbody').empty();
    let data = response.values;
    let resultTitle = response.result_titles;
    let groupTitle = response.titles;
    data.map((x, i) => {
        let html = "<tr>";
        html += "<td>" + x['project_title'] + "</td>";
        html += "<td>" + x['indicator'] + "</td>";
        html += "<td>" + x['dimension_name'] + "</td>";
        html += "<td style='padding-left:50px;'>" + x['commodity'] + "</td>";
        ["TTL", "MW","MZ", "ZA"].map(tvalue => {
            html += createRow(x, "TG", tvalue );
        });
        ["MW","MZ", "ZA", "TTL"].map(tvalue => {
            html += createRow(x, "CA", tvalue );
        });
        html += "</tr>";
        $("#rsr_table tbody").append(html);
        return html;
    });
    /* dom: 'Brftip', */
    $("#rsr_table").show();
    const table = $("#rsr_table").DataTable({
        dom: 'Brftip',
        ordering: false,
        buttons: ['copy', 'print', 'excel', 'pdf'],
        fixedHeader: true,
        rowGroup: {
            startRender: (rows, group) => {
                let getattr = (x) => {
                    let rowidx = rows[0];
                    let camw = rows.cells().column(x).nodes();
                    let cells = [];
                    rowidx.map((a,i) => {
                        let json = camw[a].dataset.details;
                        try { cells.push(JSON.parse(json)[0]); }
                        catch(error) { console.log('no-data'); }
                        return true;
                    });
                    return cells;
                }
                let getvalue = (x) => {
                    let camw = rows
                        .data()
                        .pluck(x)
                        .reduce((a, b) => {
                            return a + b * 1;
                        }, 0);
                    return camw;
                }

                if (groupTitle.indexOf(group) === -1) {
                    let html = '';
                    [4,5,6,7,8,9,10,11].map((x) => {
                        let td = getvalue(x);
                        let act = getattr(x);
                        html += generateGroup(td, act);
                    })
                    return $("<tr/>")
                        .append("<td>" + group + "</td>")
                        .append(html)
                }
                if (resultTitle.indexOf(group) === -1) {
                    return $("<tr/>")
                        .append("<td colspan=9><span class='badge badge-light'>Add Comments</span> "+group+"</td>")
                }
                return $("<tr/>")
                    .append("<td colspan=9>" + group + "</td>")
            },
            endRender: null,
            dataSrc: [0, 1, 2]
        },
        columnDefs: [{
            targets: [0, 1, 2],
            visible: false
        }],
        scrollY: (screen.height - 400).toString() + "px",
        scrollCollapse: true,
        responsive: true,
        paging: false
    });
    table.columns.adjust();
    $('div.dataTables_filter input').addClass('search');
    $("#rsr_table tbody").on('click', 'td', function() {
        let cell = table.cell(this);
        let abs = $(this).attr('data-details');
        generateModal(abs);
    });
    $("#generate-report i").hide();
    $("#scroll-report").click();
};
