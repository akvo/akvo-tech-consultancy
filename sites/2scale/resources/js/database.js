import { db, storeDB } from './dexie';
const axios = window.axios;

const table = db.databases;
const fetchData = (endpoint) => {
    return new Promise((resolve, reject) => {
        axios.get('/api/datatables' + endpoint) .then(res=> {
            // console.log('fetch network', res);
            // storeDB({
            //     table : table,
            //     data : {name: endpoint, data: res.data},
            //     key : {name: endpoint}
            // });
            resolve(res.data);
        }).catch(error=> {
            reject(error);
        });
    });
};

const endpoint=$("meta[name='data-url']").attr("content");
const loadData = async (endpoint) => {
    const res = await table.get({name: endpoint});
    if (res === undefined) {
        return fetchData(endpoint);
    }
    console.log('not fetch network', res);
    return res.data;
}
const getdata=loadData(endpoint);

const createRows=(data, rowType)=> {
    let html="<tr>";
    data.forEach((d, i)=> {
        html +="<td>";
        if (rowType==="head") {
            html +=d.text;
        }
        if (rowType==="body") {
            html +=d.text;
        }
        html +="</td>";
    }
    );
    html+="</tr>";
    return html;
}

const createTable=(data, rowType)=> {
    let html="<t"+rowType+">";
    if (rowType==="body") {
        data.forEach((r, i)=> {
            html +=createRows(r.data, rowType);
        });
    }
    if (rowType==="head") {
        html+=createRows(data, rowType);
    }
    html+="</t"+rowType+">";
    $("#datatables").append(html);
    return true;
}

getdata.then(res=> {
    createTable(res.questions, "head");
    $("#loader-spinner").remove();
	return res.datapoints;
}).then(datapoints=> {
    createTable(datapoints, "body");
	return true;
}).then(status=> {
    if (status) {
		$('#datatables thead tr').clone(true).appendTo( '#example thead' );
        $('#datatables thead tr:eq(1) th').each( function (i) {
			var title = $(this).text();
			$(this).html( '<input type="text" placeholder="Search"/>' );
			$( 'input', this ).on( 'keyup change', () => {
				if ( table.column(i).search() !== this.value ) {
					table.column(i).search( this.value ).draw();
				}
			});
        });
        $("#datatables").DataTable( {
            dom: 'Birftp',
			buttons: [ 'copy', 'excel', 'csv', 'colvis'],
			scrollX: true,
            scrollY: '75vh',
			height: 400,
			paging: false,
			fixedHeader: true,
			scrollCollapse: true,
        });
		// Material Design example
		$('#datatables_wrapper').find('label').each(function () {
			$(this).parent().append($(this).children());
		}
		);
		$('#datatables_wrapper .dataTables_filter').find('input').each(function () {
			const $this=$(this);
			$this.attr("placeholder", "Search");
			$this.removeClass('form-control-sm');
		}
		);
		$('#datatables_wrapper .dataTables_length').addClass('d-flex flex-row');
		$('#datatables_wrapper .dataTables_filter').addClass('md-form');
		$('#datatables_wrapper select').removeClass( 'custom-select custom-select-sm form-control form-control-sm');
		$('#datatables_wrapper select').addClass('mdb-select');
		$('#datatables_wrapper .dataTables_filter').find('label').remove();
    }
    return true;
});
