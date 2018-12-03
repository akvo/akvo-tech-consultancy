var frm = $("form#stack_search");
$(frm).removeAttr('onsubmit');

var btn4 = $('#stack_search a:last-child');
$(btn4).removeAttr('onclick');

function icon(fa){
    return "<i class='fa fa-"+fa+"'></i>";
}
function col(id, order, searchable){
    return {data:id,name:id,orderable:order,searchable:searchable};
}

$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

$.fn.dataTable.Buttons.defaults.dom.button.className = 'btn btn-light my-2 my-sm-0';

var data_table = $('#school_table').DataTable({
    pageLength:10,
    autoWidth: false,
	processing: true,
	serverSide: true,
	ajax: {
		url: 'api/database',
		method: 'POST'
	},
	columns: [
        col('L', true, true),
        col('province', true, true),
        col('school_type', true, true),
        col('registration', true, true),
        col('R', false, true),
        col('total_students', true, false),
        col('total_teacher', true, false),
        col('total_toilet', true, false),
        col('bg_toilet', false, false),
        col('washing_facilities', false, false),
        col('safe_to_drink', false, false),
        col('annual_grant', false, false),
        col('community_support', false, false),
	],
    lengthMenu: [
        [ 10, 25, 50, 100, -1 ],
        [ '10 rows', '25 rows', '50 rows', '100 rows', 'Show all' ]
    ],
	dom: 'Brtpi',
    buttons: [
        { extend: 'print',
          text: icon('print'),
          key: { key: 'p', altkey: true }
        },
        { extend: 'excel',
          text: icon('file-excel-o'),
          key: { key: 'x', altkey: true }},
        { extend: 'pdf',
          text: icon('file-pdf-o'),
          key: { key: 'd', altkey: true }},
        { extend: 'csv',
          text: icon('file-text-o'),
          key: { key: 'c', altkey: true }},
        { extend: 'colvis', fade:0, text: icon('table')},
        { extend: 'pageLength', fade:0},
    ],
	initComplete: function () {
		$('.dt-buttons.btn-group').prependTo('.form-inline');
		$('.dt-buttons.btn-group').show();
	}
});

$("#find").removeAttr('onkeydown');
$('#school_table tbody').on('click', 'tr', function () {
	var data = data_table.row( this ).data();
	getDetails(data['A'],'id');
});

$(btn4).on('click', function () {
	searchTable();
    var column = data_table.column( $(this).attr('data-column') );
    column.visible( ! column.visible() );
});

$(frm).on('submit', function() {
    event.preventDefault()
	searchTable();
});

function searchTable(){
	let search_val = $('#find').val();
	data_table.search(search_val).draw();
}

