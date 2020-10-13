/*
 *
 * Global Map Functions
 *
 */

let maps;
let customs;
let goToView;
let zoomMap;
let getTemplates;


const getTemplate = () => {
    let data = JSON.parse(localStorage.getItem('data'));
    const template = customs.custom(data);
    let js = localStorage.getItem("template");
    return (js === null) ? false : template[js];
};

// pop up details
const getDetails = (a, atype) => {
    let template = getTemplate();
    let datapointid = (atype === 'id') ? a : $(a).attr('data');
    template.popup(datapointid);
    $('#profile-menu').click();
    $('#detail_modal').modal('show');
};

const focusTo = () => {
    event.preventDefault()
    let latlng = $('#zoom_find').val();
    let id = $('#find').attr('data-search');
    latlng = latlng.split(',');
    latlng = [parseFloat(latlng[0]), parseFloat(latlng[1])];
    goToView(new L.LatLng(latlng[1], latlng[0]), 18);
    getDetails(id, 'id');
};

const focusNormal = () => {
    let latlng = JSON.parse(localStorage.getItem('configs')).center;
    goToView(new L.LatLng(latlng[0], latlng[1]), 11);
};

const searchData = (request) => {
    let configs = JSON.parse(localStorage.getItem('configs'));
    let data = JSON.parse(localStorage.getItem('data'));
    let properties = _.map(data.features, (x) => x.properties);
    let search = [];
    _.forEach(configs['search'], (x) => {
        _.forEach(properties, (y) => {
            if (y[x].toLowerCase().includes(request.term.toLowerCase())) {
                y.searchKey = x;
                y.popup = configs['popup'];
                search.push(y);    
            }
        });
    });
    return search.slice(0, 10);
};

const jqUI = () => {
    $("#find").autocomplete({
        minLength: 4,
        maxResults: 10,
        source: (request, response) => {
            response(searchData(request));
        },
        focus: (event, ui) => {
            // $("#find").val(ui.item[ui.item.searchKey]);
            $("#find").val(ui.item[ui.item.popup]);
            $("#find").attr('data-search', ui.item.data_point_id);
            $("#zoom_find").val(ui.item.PTS);
            return false;
        },
        select: (event, ui) => {
            // $("#find").val(ui.item[ui.item.searchKey]);
            console.log(ui.item);
            $("#find").val(ui.item[ui.item.popup]);
            return false;
        }
    })
    .autocomplete("instance")._renderItem = (ul, item) => {
        return $("<li>")
            .append("<div><span class='search-province'>" + item[item.popup] + "</span><span class='badge badge-small badge-primary'>"+ item[item.searchKey] +"</span></div>")
            .appendTo(ul);
    };
};

const toggleLegend = (it, state) => {
    let rem_class = $(it).attr('class');
    $('.marker.' + rem_class).hide();
};

const restartCluster = (el, key) => {
    var filter = $(el).attr('class').split(' ')[0];
    $('.marker .' + filter).remove();
};

const downloadData = () => {
    let configs = JSON.parse(localStorage.getItem('configs'));
    let data = JSON.parse(localStorage.getItem('data'));
    let filter, dwl = [];
    if (!configs.shapefile) {
        filter = data.features.filter(x => x.properties.status === 'active');
        dwl = filter.map(x => x.properties);
    }
    if (configs.shapefile) {
        data.features.features.filter(x => {
            if (x.properties.data) {
                x.properties.data.filter(y => {
                    if (y.status === 'active') {
                        dwl.push(y);
                    }
                }); 
            }
        });
    }
    exportExcel(dwl, configs);
};

const exportExcel = (filter, configs) => {
    // let configs = JSON.parse(localStorage.getItem('configs'));
    var CsvString = "";
    var lines = [];
    let headers = [];

    const configsExcept = ["center", "js", "name", "popup", "search", "css", "shapefile", "shapename"];
    configsExcept.forEach(x => delete configs[x]);
    Object.keys(configs).map((key, index) => {
        headers.push(configs[key]);
    });
    lines.push(headers);

    const filterExcept = ["status", "PTS"];
    filter.forEach(x => {
        filterExcept.forEach(y => delete x[y]);
        if (x['status_tmp'] !== undefined) {
            delete x['status_tmp'];
        }
        let tmp = [];
        Object.keys(x).map((key, index) => {
            tmp.push(x[key]);
        });
        lines.push(tmp);
    });

    lines.forEach((RowItem, RowIndex) => {
        RowItem.forEach((ColItem, ColIndex) => {
            CsvString += ColItem + ';'; // separated by ; because the question contain ,
        });
        CsvString += "\r\n";
    });

    CsvString = "data:application/csv;charset=utf-8," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString);
    var d = new Date();
    x.setAttribute("download", "akvomap-" + d.toISOString() + ".csv");
    document.body.appendChild(x);
    x.click();
    $(x).remove();
};

const showSecurityForm = () => {
    $('#security_modal').modal('show');
};

const sendRequest = () => {
    var input_security = $('#secure-pwd').val();
    $.ajax({
        type: "POST",
        url: "/api/verify",
        data: {
            "security_code": input_security,
        },
        dataType: "json",
        success: () => {
            downloadData();
        },
        error: () => {
            $('#error-download').slideDown("fast");
            $('#secure-pwd').addClass("is-invalid");
            setTimeout(() => {
                $('#error-download').slideUp("fast");
                $('#secure-pwd').removeClass("is-invalid");
            }, 3000);
        }
    });
};