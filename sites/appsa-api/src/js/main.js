import './../css/custom.css';
const axios = require('axios');
// const baseurl = '/appsa-api';
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
    if (pt === 'yearly') {
        $("#period-semester").prop("checked", false);
    }
    if (pt === 'semester') {
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
    console.log(post_data);
    generate_report(post_data);
});

let destroy_table = () => {
    let table = $("#rsr_table").Datatable();
    table.destroy();
    table.empty();
    $("#rsr_table tbody").children().remove();
}

function generate_table(data) {
    try {
        destroy_table();
    } catch (error) {
        console.log(error);
    }
    data.map(function(x, i) {
        let html = "<tr>";
        html += "<td>" + x['project_title'] + "</td>";
        html += "<td>" + x['indicator'] + "</td>";
        html += "<td style='padding-left:50px;' data-dimension=" + x['dimension_name'] + ">" + x['commodity'] + "</td>";
        html += "<td class='text-right'>" + x['CA-MW'] + "</td>";
        html += "<td class='text-right'>" + x['CA-MZ'] + "</td>";
        html += "<td class='text-right'>" + x['CA-ZA'] + "</td>";
        html += "<td class='text-right'>" + x['TG-MW'] + "</td>";
        html += "<td class='text-right'>" + x['TG-MZ'] + "</td>";
        html += "<td class='text-right'>" + x['TG-ZA'] + "</td>";
        html += "</tr>";
        $("#rsr_table tbody").append(html);
        return html;
    });
    /* dom: 'Brftip', */
	$("#rsr_table").show();
    $('#rsr_table').DataTable({
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
            dataSrc: [0, 1]
        },
        columnDefs: [{
            targets: [0, 1],
            visible: false
        }],
        scrollY: "600px",
        scrollCollapse: true,
        paging: false
    });
	$("#generate-report i").hide();
	$("#scroll-report").click();
}

function generate_report(pd) {
	$("#generate-report i").show();
    axios.post(baseurl + '/api/datatables/' + pd.project_id, pd)
        .then(function(response) {
            generate_table(response.data);
        })
        .catch(function(error) {
            console.log(error);
        });
}

/* Row Grouping with Value
	rowGroup: {
		startRender: null,
		endRender: function(rows, group) {
			let getvalue = (x) => {
				var camw = rows
					.data()
					.pluck(x)
					.reduce(function(a, b) {
						return a + b * 1;
					}, 0);
				return camw;
			}
			return $('<tr/>')
				.append('<td>' + group + '</td>')
				.append('<td>' + getvalue(3) + '</td>')
				.append('<td>' + getvalue(4) + '</td>')
				.append('<td>' + getvalue(5) + '</td>')
				.append('<td>' + getvalue(6) + '</td>')
				.append('<td>' + getvalue(7) + '</td>')
				.append('<td>' + getvalue(8) + '</td>')
		},
		dataSrc: [0, 1]
	},
*/
