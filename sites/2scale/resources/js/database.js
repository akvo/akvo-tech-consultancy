const axios = require('axios');
const endpoint = $("meta[name='data-url']").attr("content");

const getdata = axios.get('/api/datatables' + endpoint)
    .then(res => {
        console.log(res.data);
        return res.data
    })
    .catch(error => {
        console.error(error);
        throw error;
    });

const createRows = (data, rowType) => {
    let html = "<tr>";
    data.forEach((d, i) => {
        html += "<td>";
        if (rowType === "head") {
            html += d.short_text;
        }
        if (rowType === "body") {
            html += d.answer;
        }
        html += "</td>";
    });
    html += "</tr>";
    return html;
}

const createTable = (data, rowType) => {
    let html = "<t" + rowType + ">";
    if (rowType === "body") {
        data.forEach((r, i) => {
            html += createRows(r.data, rowType);
        });
    }
    if (rowType === "head") {
        html += createRows(data, rowType);
    }
    html += "</t" + rowType + ">";
    $("#datatables").append(html);
    return true;
}

getdata
    .then(res => {
        createTable(res.questions, "head")
        return res.datapoints;
    })
    .then(datapoints => {
        createTable(datapoints, "body")
        return true;
    })
    .then(status => {
        if (status) {
            $("#datatables").DataTable({
                scrollX: true,
                scrollCollapse: true,
                paging:false,
                fixedColumns:true,
            });
        }
        return true;
    });
