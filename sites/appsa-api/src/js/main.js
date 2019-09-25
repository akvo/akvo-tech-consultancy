import './../css/custom.css';
const axios = require("axios");
//const baseurl = '/appsa-api';
const baseurl = '';


let post_data = {};
let project_option = () => {
    return $("input[name='project-option']:checked").map(function(_, el) {
        return $(el).val();
    }).get();
}

let project_selection = () => {
    return $("input[name='project-selection']:checked").map(function(_, el) {
        return $(el).val();
    }).get();
}

let project_type = () => {
    return $("input[name='period-type']:checked").map(function(_, el) {
        return $(el).val();
    }).get();
}

let date_selected = (x) => {
    return $("#period-" + x + "-select option:selected").text();
}

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
    generate_report(post_data);
});

let destroyTable = () => {
    let table = $("#rsr_table").Datatable();
    table.destroy();
    table.empty();
    $("#rsr_table tbody").children().remove();
}

function createRow(data, col_type, country) {
    col_type += "-" + country;
    let details = col_type + "-D";
    let tdclass = "";
    if (data[details] !== null) {
        tdclass = "has-data";
    }
    let html = "<td class='text-right "+tdclass+"' data-details='"+JSON.stringify(data[details])+"'>";
    html += data[col_type];
    html += "</td>";
    return html;
}

function generateTable(response) {
    let data = response.values;
    let resultTitle = response.result;
    data.map((x, i) => {
        let html = "<tr>";
        html += "<td>" + x['project_title'] + "</td>";
        html += "<td>" + x['indicator'] + "</td>";
        html += "<td style='padding-left:50px;'>" + x['commodity'] + "</td>";
        html += createRow(x, "CA", "TTL");
        html += createRow(x, "CA", "MW");
        html += createRow(x, "CA", "MZ");
        html += createRow(x, "CA", "ZA");
        html += createRow(x, "TG", "MW");
        html += createRow(x, "TG", "MZ");
        html += createRow(x, "TG", "ZA");
        html += createRow(x, "TG", "TTL");
        html += "</tr>";
        $("#rsr_table tbody").append(html);
        return html;
    });
    /* dom: 'Brftip', */
	$("#rsr_table").show();
    const table = $("#rsr_table").DataTable({
        dom: 'Brftip',
        ordering: false,
        buttons: [{
            extend: 'print',
            text: 'Print Report',
            exportOptions: {
                modifier: {
                    page: 'current'
                }
            }
        }],
        rowGroup: {
            startRender: function(rows, group) {
                    let getvalue = (x) => {
                        var camw = rows
                            .data()
                            .pluck(x)
                            .reduce(function(a, b) {
                                return a + b * 1;
                            }, 0);
                        return camw;
                    }
                    if (resultTitle.indexOf(group) === -1){
                        return $("<tr/>")
                            .append("<td>" + group + "</td>")
                            .append("<td class='text-right'>" + getvalue(3) + "</td>")
                            .append("<td class='text-right'>" + getvalue(4) + "</td>")
                            .append("<td class='text-right'>" + getvalue(5) + "</td>")
                            .append("<td class='text-right'>" + getvalue(6) + "</td>")
                            .append("<td class='text-right'>" + getvalue(7) + "</td>")
                            .append("<td class='text-right'>" + getvalue(8) + "</td>")
                            .append("<td class='text-right'>" + getvalue(9) + "</td>")
                            .append("<td class='text-right'>" + getvalue(10) + "</td>")
                    }
                    if (resultTitle.indexOf(group) > -1){
                        return $("<tr/>")
                            .append("<td colspan=9>" + group + "</td>")
                    }
            },
            endRender: null,
            dataSrc: [0, 1]
        },
        columnDefs: [{
            targets: [0, 1],
            visible: false
        }],
        scrollY: "600px",
        scrollCollapse: true,
        responsive:true,
        paging: false,
    });
    table.columns.adjust();
    $('div.dataTables_filter input').addClass('search');
    $("#rsr_table tbody").on( 'click', 'td', function () {
        let cell = table.cell(this);
        let abs = $(this).attr('data-details');
        abs = JSON.parse(abs);
        let html = "<table class='table table-bordered'>";
        html += "<thead>";
        html += "<tr>";
        html += "<td>Report Date</td>";
        html += "<td>Country</td>";
        html += "<td>Indicator</td>";
        html += "<td>Disaggregation</td>";
        html += "<td>Value</td>";
        html += "</tr>"
        html += "</thead>";
        html += "<tbody>";
        let content = abs.map(x => {
            html += "<tr>";
            html += "<td>" + x.date + "</td>";
            html += "<td>" + x.country + "</td>";
            html += "<td>" + x.indicator_name + "</td>";
            html += "<td>" + x.commodity + "</td>";
            html += "<td>" + x.value + "</td>";
            html += "</tr>";
        });
        html += "</tbody>";
        html += "<table>";
        $(".modal-body").append("<div>" + html + "</div>");
        $("#modal").modal('toggle');
        $('#modal').on('hidden.bs.modal', function () {
            $(".modal-body").children().remove();
        })
    });
	$("#generate-report i").hide();
	$("#scroll-report").click();
}

function generate_report(pd) {
	$("#generate-report i").show();
    axios.post(baseurl + "/api/datatables/" + pd.project_id, pd)
        .then(response => {
            generateTable(response.data);
        })
        .catch(error => console.log(error))
}
