import { CountUp } from "countup.js";
import { staticText, gradients, titleCase } from "./util.js";
import { db, storeDB } from "./dexie";

const echarts = window.echarts;
const axios = window.axios;
const table = db.databases;
const tableTitle = "Reported Values for Universal Impact Indicators";
var footerColspan = 1;
var mainColumn = [];

const fetchData = endpoint => {
    return new Promise((resolve, reject) => {
        axios
            .get("/charts/rsr-datatables/" + endpoint)
            .then(res => {
                // console.log('fetch network', res);
                // storeDB({
                //     table : table, data : {name: endpoint, data: res.data}, key : {name: endpoint}
                // });
                resolve(res.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

// load from dixie if exist
export const loadData = async endpoint => {
    // console.log(endpoint);
    const res = await table.get({ name: endpoint });
    if (res === undefined) {
        return fetchData(endpoint);
    }
    console.log("not fetch network", res);
    return res.data;
};

const refactorDimensionValue = columns => {
    return columns.map(item => {
        let tmp = [];
        if (item.rsr_dimensions.length > 0) {
            item.rsr_dimensions.forEach(dimensions => {
                dimensions.rsr_dimension_values.forEach(dimension => {
                    tmp.push({
                        name: dimension.name,
                        total_actual_value: dimension.total_actual_value,
                        value: dimension.value
                    });
                });
            });
        }
        if (item.rsr_indicators_count > 1) {
            item.rsr_indicators.forEach(ind => {
                tmp.push({
                    name: ind.title,
                    total_actual_value: ind.total_actual_value,
                    value: ind.target_value
                });
            });
        }
        // UII 8
        // let resultIds = datas.config.result_ids;
        // if (resultIds.includes(item.id) || resultIds.includes(item.parent_result)) {
        //     let rsr_custom_gender = {
        //         male: 'Male',
        //         male_actual: 0,
        //         male_value: 0,
        //         female: 'Female',
        //         female_actual: 0,
        //         female_value: 0,
        //     };
        //     tmp.forEach(value => {
        //         let name = value.name.toLowerCase();
        //         let isGender = name.includes('male');
        //         let isFemale = name.includes('female');

        //         let isMen = name.includes('men');
        //         let isWomen = name.includes('women');

        //         if (isGender && !isFemale || isMen && !isWomen) {
        //             rsr_custom_gender = {
        //                 ...rsr_custom_gender,
        //                 male_actual: rsr_custom_gender.male_actual + value.total_actual_value,
        //                 male_value: rsr_custom_gender.male_value + value.value,
        //             }
        //         }
        //         if (isFemale || isWomen) {
        //             rsr_custom_gender = {
        //                 ...rsr_custom_gender,
        //                 female_actual: rsr_custom_gender.female_actual + value.total_actual_value,
        //                 female_value: rsr_custom_gender.female_value + value.value,
        //             }
        //         }
        //     });
        //     tmp = [
        //         {
        //             'name': rsr_custom_gender.male,
        //             'total_actual_value': rsr_custom_gender.male_actual,
        //             'value': rsr_custom_gender.male_value
        //         },
        //         {
        //             'name': rsr_custom_gender.female,
        //             'total_actual_value': rsr_custom_gender.female_actual,
        //             'value': rsr_custom_gender.female_value
        //         },
        //     ];
        // }
        item["dimensions"] = tmp;
        return item;
    });
};

const refactorChildrens = childrens => {
    if (typeof childrens !== "undefined" && childrens.length > 0) {
        return childrens.map(child => {
            child.columns = refactorDimensionValue(child.columns);
            child.childrens = refactorChildrens(child.childrens);
            child["extras"] = [];
            if (child.childrens.length > 0) {
                child.childrens = child.childrens.sort((a, b) =>
                    a.project > b.project ? 1 : -1
                );
                child["extras"] = agregateExtras(child.columns);
            }
            return child;
        });
    }
    return [];
};

const titleFormat = (title, css) => {
    let td = "";
    let isHypen = title.includes("-");
    let isUnderscore = title.includes("_");
    if (isHypen && !isUnderscore) {
        return title.split("-")[1];
    }
    if (isUnderscore) {
        let titles = title.split("_");
        return titles[1] + " (" + titles[0] + ") - " + titles[2];
    }
    return title;
};

const agregateExtras = data => {
    let sum_values = [],
        target_values = [],
        gap_values = [],
        percent_values = [];
    data.forEach(item => {
        let sum = [],
            target = [],
            gap = [],
            percent = [];
        let dim_sum = 0,
            dim_target = 0,
            dim_gap = 0,
            dim_percent = 0,
            has_dimension = false;
        if (item.dimensions.length > 0) {
            has_dimension = true;
            item.dimensions.forEach(val => {
                dim_sum = dim_sum + val.total_actual_value;
                dim_target = dim_target + val.value;
                dim_gap = dim_gap + (val.total_actual_value - val.value);
                dim_percent =
                    dim_percent + (val.total_actual_value / val.value) * 100;

                sum.push(val.total_actual_value);
                target.push(val.value);
                gap.push(val.total_actual_value - val.value);
                let percentage = "-";
                if (val.value !== 0) {
                    percentage = (
                        (val.total_actual_value / val.value) *
                        100
                    ).toFixed(2);
                    percentage = percentage > 100 ? 100 : percentage;
                    percentage = percentage + "%";
                }
                percent.push(percentage);
            });
        } else {
            sum.push(item.total_actual_value);
            target.push(item.total_target_value);
            gap.push(item.total_actual_value - item.total_target_value);
            let percentage = "-";
            if (val.value !== 0) {
                percentage = (
                    (val.total_actual_value / val.value) *
                    100
                ).toFixed(2);
                percentage = percentage > 100 ? 100 : percentage;
                percentage = percentage + "%";
            }
            percent.push(percentage);
        }
        dim_percent = isNaN(dim_percent)
            ? " - "
            : dim_percent.toFixed(2) > 100
            ? 100
            : dim_percent.toFixed(2) + "%";
        sum_values.push({
            total: sum,
            dimension_total: dim_sum,
            has_dimension: has_dimension
        });
        target_values.push({
            total: target,
            dimension_total: dim_target,
            has_dimension: has_dimension
        });
        gap_values.push({
            total: gap,
            dimension_total: dim_gap,
            has_dimension: has_dimension
        });
        percent_values.push({
            total: percent,
            dimension_total: dim_percent,
            has_dimension: has_dimension
        });
    });
    return [
        // {
        //     "name": "SUM",
        //     "values": sum_values,
        // },
        {
            name: "TARGET",
            values: target_values
        },
        {
            name: "GAP",
            values: gap_values
        },
        {
            name: "%",
            values: percent_values
        }
    ];
};

const renderRow = (
    data,
    level = 1,
    parentId = "",
    childId = "",
    url = false
) => {
    let icon_plus =
        '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
        <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>\
    </svg>';
    let row = "";
    let style = "";
    let indent = "";
    let id = parentId;

    if (level === 1) {
        icon_plus = "";
        mainColumn = data.columns;
    }

    if (level === 2) {
        id = childId;
        style = "child " + parentId;
        indent = 'style="padding-left:12px;"';
    }

    let data_id = "data-id=" + id;
    if (level === 3) {
        style = "child child-" + parentId + " " + childId;
        data_id = "";
        indent = 'style="padding-left:25px;"';
    }

    // manage the child columns not match with children columns
    if (mainColumn.length !== data.columns.length && level !== 1) {
        let tmp = mainColumn.map(val => {
            let find = data.columns.find(x => x.title === val.title);
            if (typeof find === "undefined") {
                let dimensions = val.dimensions.map(d => {
                    d.total_actual_value = 0;
                    d.value = 0;
                    return d;
                });
                return {
                    ...val,
                    dimensions: dimensions,
                    total_actual_value: 0,
                    total_target_value: 0
                };
            }
            return find;
        });
        data.columns = tmp;
    }

    // there was a dimensions value not match with their parent
    if (mainColumn.length === data.columns.length && level !== 1) {
        let tmp = mainColumn.map(val => {
            let find = data.columns.find(x => x.title === val.title);
            if (val.dimensions.length !== find.dimensions.length) {
                find.dimensions = val.dimensions.map(d => {
                    d.total_actual_value = 0;
                    d.value = 0;
                    return d;
                });
            }
            return find;
        });
        data.columns = tmp;
    }

    url = parentId === 8759 && "https://rsr.akvo.org/en/project/8759";
    url = false;

    let last_child = data.childrens.length > 0 ? "" : "last_child";
    row +=
        "<tr " +
        data_id +
        ' data-level="' +
        level +
        '" class="' +
        style +
        " level_" +
        level +
        " " +
        last_child +
        '">';
    url
        ? (row +=
              '<td class="partner" ' +
              indent +
              "><span>" +
              icon_plus +
              '</span> <a target="_blank" href="' +
              url +
              '">' +
              titleFormat(data.project) +
              "</a></td>")
        : (row +=
              '<td class="partner" ' +
              indent +
              ">" +
              icon_plus +
              " " +
              titleFormat(data.project) +
              "</td>");
    data.columns.forEach(val => {
        if (val.dimensions.length > 0) {
            val.dimensions.forEach(val => {
                if (level === 1) {
                    footerColspan = footerColspan + 1;
                }
                row += "<td class='text-right'>";
                row += val.total_actual_value.toLocaleString();
                row += "</td>";
            });
        } else {
            if (level === 1) {
                footerColspan = footerColspan + 1;
            }
            row += "<td class='text-right'>";
            row += val.total_actual_value.toLocaleString();
            row += "</td>";
        }
    });
    row += "</tr>";
    return row;
};

const renderLastRow = (data, last) => {
    let row = "";
    if (data.childrens.length > 0 && last) {
        row += '<tr class="last_row" style="display:none;">';
        row += '<td class="partner">&nbsp</td>';
        data.columns.forEach(val => {
            if (val.dimensions.length > 0) {
                val.dimensions.forEach(val => {
                    row += "<td>&nbsp</td>";
                });
            } else {
                row += "<td>&nbsp</td>";
            }
        });
        row += "</tr>";
    }
    return row;
};

const renderExtra = (
    data,
    parent,
    child,
    grandTotal = false,
    addLastRow = false
) => {
    let extras = "";
    let total = grandTotal ? "grand_total" : "";
    // extras
    if (data.length > 0) {
        data.forEach((val, index) => {
            extras +=
                '<tr class="extras child ' +
                parent +
                " " +
                child +
                " " +
                total +
                '">';
            extras +=
                '<td rowspan="2" class="partner align-middle name">' +
                val.name +
                "</td>";
            val.values.forEach(val => {
                let span = val.has_dimension ? "" : 'rowspan="2"';
                let align = val.has_dimension ? "" : "align-middle";
                val.total.forEach(val => {
                    extras +=
                        '<td class="' +
                        align +
                        ' text-right" ' +
                        span +
                        ">" +
                        val.toLocaleString() +
                        "</td>";
                });
            });
            extras += "</tr>";

            extras +=
                '<tr class="extras child ' +
                parent +
                " " +
                child +
                " " +
                total +
                '">';
            extras += '<td style="display:none;">&nbsp</td>';
            val.values.forEach(val => {
                if (val.has_dimension) {
                    extras +=
                        '<td class="text-right" colspan="' +
                        val.total.length +
                        '">' +
                        val.dimension_total.toLocaleString() +
                        "</td>";
                }
                val.total.forEach(val => {
                    extras += '<td style="display:none;">&nbsp</td>';
                });
            });
            extras += "</tr>";

            // if (index === (data.length-1) && !grandTotal && addLastRow) {
            // if (index === (data.length-1) && !grandTotal) {
            if (index === data.length - 1 && grandTotal) {
                extras += '<tr class="last_row" style="display:none;">';
                extras += '<td class="partner">&nbsp</td>';
                val.values.forEach(val => {
                    val.total.forEach(val => {
                        extras += "<td>&nbsp</td>";
                    });
                });
                extras += "</tr>";
            }
        });
        return extras;
    }
    // eol extras
    return extras;
};

let dotIcon =
    '<svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-dot" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path fill-rule="evenodd" d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>\
</svg>';
let legend =
    '<ul id="table-legend" class="list-inline">\
    <li class="list-inline-item">' +
    dotIcon +
    'SM : Male (>35)</li>\
    <li class="list-inline-item">' +
    dotIcon +
    'SF : Female (>35)</li>\
    <li class="list-inline-item">' +
    dotIcon +
    'JM : Male (<=35)</li>\
    <li class="list-inline-item">' +
    dotIcon +
    'JF : Female (<=35)</li>\
    <li class="list-inline-item">' +
    dotIcon +
    'M : Male</li>\
    <li class="list-inline-item">' +
    dotIcon +
    "F : Female</li>\
</ul>";

export const datatableOptions = (id, res, baseurl) => {
    let dtoptions = {
        ordering: false,
        dom: "Birftp",
        buttons: [
            "copy",
            {
                extend: "print",
                title: res.data.project,
                customize: function(win) {
                    $(".child").show();
                    $(".extras").show();
                    // $('.grand_total').hide();
                    $(win.document.head).append(
                        $(
                            '<link href="' +
                                baseurl +
                                '/css/print-bootstrap.css" rel="stylesheet">'
                        )
                    );
                    $(win.document.head).append(
                        $(
                            '<link href="' +
                                baseurl +
                                '/css/print.css" rel="stylesheet">'
                        )
                    );
                    $(win.document.body)
                        .find("table thead")
                        .remove();
                    $(win.document.body)
                        .find("table tbody")
                        .remove();
                    $(win.document.body).prepend(
                        "<h5>" + tableTitle + "</h5></hr>"
                    );
                    $(win.document.body)
                        .find("table")
                        .append($(".dataTable").html());
                    $(win.document.body)
                        .find("table")
                        .append($("#datatables").html());
                    // $(win.document.body).append($('#table-legend').html());
                }
            }
            // {
            //     text: 'Collapse',
            //     action: function(e, dt, node, config) {
            //         $('.level_3').hide('fast');
            //         $('.extras').hide('fast');
            //         $('.grand_total').show('fast');
            //     }
            // },
        ],
        scrollX: true,
        scrollY: "75vh",
        height: 400,
        paging: false,
        fixedHeader: true,
        // fixedColumns: true,
        scrollCollapse: true,
        autoWidth: true,
        columnDefs: [{ targets: 0, width: "12%" }]
    };
    let hideColumns = {
        columnDefs: [
            { targets: 0, width: "12%" },
            {
                targets: [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18,
                    19
                ],
                visible: true
            },
            { targets: "_all", visible: false }
        ]
    };
    dtoptions =
        res.columns.length > 8 ? { ...dtoptions, ...hideColumns } : dtoptions;

    let table = $(id).DataTable(dtoptions);
    $("#datatables_wrapper")
        .find("label")
        .each(function() {
            $(this)
                .parent()
                .append($(this).children());
        });
    $("#datatables_wrapper .dataTables_filter")
        .find("input")
        .each(function() {
            const $this = $(this);
            $this.attr("placeholder", "Search");
            $this.removeClass("form-control-sm");
        });
    $("#datatables_wrapper .dataTables_length").addClass("d-flex flex-row");
    // $('#datatables_wrapper .dataTables_filter').addClass('md-form');
    // $('#datatables_wrapper select').removeClass( 'custom-select custom-select-sm form-control form-control-sm');
    // $('#datatables_wrapper select').addClass('mdb-select');
    $("#datatables_wrapper .dataTables_filter")
        .find("label")
        .remove();

    $(".buttons-print")
        .detach()
        .prependTo(".dataTables_filter");
    $(".buttons-copy")
        .detach()
        .prependTo(".dataTables_filter");
    $(".dt-buttons").remove();

    return table;
};

const formatDetails = d => {
    let dtcache = JSON.parse(localStorage.getItem("dtcache"));
    let data = dtcache.find(x => x.id === d);
    let details = '<div style="margin:15px;">';
    details +=
        '<table class="table table-bordered" style="width:100%;" cellspacing="0">';
    details += "<tbody>";
    data.columns.forEach(val => {
        if (val.rsr_dimensions.length > 0) {
            details +=
                '<tr style="background: #E2E3E5;"><td class="parent" colspan="3">' +
                val.title +
                "</td></tr>";
            val.rsr_dimensions.forEach(val => {
                details += '<tr style="background: #F2F2F2;">';
                details += '<td class="parent">' + val.name + "</td>";
                details += '<td class="parent text-center">Target</td>';
                details += '<td class="parent text-center">Actual</td>';
                details += "</tr>";
                val.rsr_dimension_values.forEach(val => {
                    details += "<tr>";
                    details += "<td>" + val.name + "</td>";
                    details += '<td class="text-right">' + val.value + "</td>";
                    details +=
                        '<td class="text-right">' +
                        val.total_actual_value +
                        "</td>";
                    details += "</tr>";
                });
            });
        }
    });
    details += "</tbody>";
    details += "</table>";
    details += "</div>";
    return details;
};

let html = "";
let datas = {};
let status = {};
export const renderRsrTable = (endpoint, baseurl, datatableId) => {
    return loadData(endpoint)
        .then(res => {
            datas = res;
            // data refactoring
            datas.columns = datas.columns.map(column => {
                // if (column.subtitle.length > 0) {
                //     column.subtitle = column.subtitle.map(subtitle => {
                //         let name = subtitle.toLowerCase();
                //         let isGender = name.includes('male');
                //         let isFemale = name.includes('female');
                //         let isSenior = name.includes('>');
                //         let isJunior = name.includes('<');
                //         if (isGender && !isFemale && isSenior) {
                //             return 'SM';
                //         }
                //         if (isFemale && isSenior) {
                //             return 'SF';
                //         }
                //         if (isGender && !isFemale && isJunior) {
                //             return 'JM';
                //         }
                //         if(isFemale && isJunior) {
                //             return 'JF';
                //         }
                //         if (isGender && !isFemale && !isSenior && !isJunior) {
                //             return 'M';
                //         }
                //         if (isFemale && !isSenior && !isJunior) {
                //             return 'F';
                //         }
                //         return subtitle;
                //     });
                //     return column;
                // }
                // return column;

                if (column.subtitle.length === 0) {
                    return column;
                }
                column.subtitle = column.subtitle.map(subtitle => {
                    if (subtitle.values.length === 0) {
                        return subtitle;
                    }
                    subtitle.values = subtitle.values.map(value => {
                        let name = value.toLowerCase();
                        let isGender = name.includes("male");
                        let isFemale = name.includes("female");
                        let isSenior = name.includes(">");
                        let isJunior = name.includes("<");
                        if (isGender && !isFemale && isSenior) {
                            return "SM";
                        }
                        if (isFemale && isSenior) {
                            return "SF";
                        }
                        if (isGender && !isFemale && isJunior) {
                            return "JM";
                        }
                        if (isFemale && isJunior) {
                            return "JF";
                        }
                        if (isGender && !isFemale && !isSenior && !isJunior) {
                            return "M";
                        }
                        if (isFemale && !isSenior && !isJunior) {
                            return "F";
                        }
                        return value;
                    });
                    return subtitle;
                });
                return column;
            });

            datas.data.columns = refactorDimensionValue(datas.data.columns);
            datas.data.childrens = refactorChildrens(datas.data.childrens);
            datas.data["extras"] = agregateExtras(datas.data.columns);
            datas.data.childrens = datas.data.childrens.sort((a, b) =>
                a.project > b.project ? 1 : -1
            );
            // EOL data refactoring
            return datas;
        })
        .then(res => {
            // console.log(res);
            // Header 1
            html += '<thead class="thead-dark">';
            // html += '<tr>';
            // html += '<th rowspan="2">Country / Partnership / Partner</th>';
            // res.columns.forEach(column => {
            //     let colspan = column.subtitle.length;
            //     let span = (colspan > 0) ? 'colspan="'+colspan+'"' : 'rowspan="2"';
            //     html += '<th scope="col" '+span+'>'+column.title+'</th>';
            // });
            // html += '</tr>';

            html += "<tr>";
            html +=
                '<th rowspan="3" class="partner">Country / Partnership / Partner</th>';
            res.columns.forEach(column => {
                let colspan =
                    column.subtitle.length > 0
                        ? column.subtitle.map(x =>
                              x.values.length === 0 ? 1 : x.values.length
                          )
                        : [];
                colspan =
                    colspan.length > 0
                        ? colspan.reduce((sum, x) => sum + x)
                        : 0;
                let span =
                    colspan > 0
                        ? column.subtitle.length === 1
                            ? 'rowspan="2" colspan="' + colspan + '"'
                            : 'colspan="' + colspan + '"'
                        : 'rowspan="3"';
                html +=
                    '<th scope="col" ' + span + ">" + column.title + "</th>";
            });
            html += "</tr>";
            return res;
        })
        .then(res => {
            // Header 2
            html += "<tr>";
            res.columns.forEach(column => {
                if (column.subtitle.length > 1) {
                    column.subtitle.forEach(subtitle => {
                        let colspan = subtitle.values.length;
                        let span =
                            colspan > 0
                                ? 'colspan="' + colspan + '"'
                                : 'rowspan="2"';
                        html +=
                            '<th scope="col" ' +
                            span +
                            ">" +
                            subtitle.name +
                            "</th>";
                    });
                }
            });
            html += "</tr>";
            return res;
        })
        .then(res => {
            // Header 3
            // html += '<tr>';
            // res.columns.forEach(column => {
            //     if (column.subtitle.length > 0) {
            //         column.subtitle.forEach(subtitle => {
            //             html += '<th scope="col" class="text-center">'+subtitle+'</th>';
            //         });
            //     }
            // });
            // html += '</tr>';
            // html += '</thead>';

            html += "<tr>";
            res.columns.forEach(column => {
                if (column.subtitle.length > 0) {
                    column.subtitle.forEach(subtitle => {
                        if (subtitle.values.length > 0) {
                            subtitle.values.forEach(value => {
                                html +=
                                    '<th scope="col" class="text-center">' +
                                    value +
                                    "</th>";
                            });
                        }
                    });
                }
            });
            html += "</tr>";
            html += "</thead>";
            return res;
        })
        .then(res => {
            let url = res.config.url;
            let parentId = res.data.rsr_project_id;
            html += "<tbody>";
            html += renderRow(res.data, 1, parentId, url + parentId);
            html += renderExtra(res.data.extras, parentId, "", true, true);

            if (res.data.childrens.length > 0) {
                res.data.childrens.forEach((val, index) => {
                    let childId = val.rsr_project_id;
                    let last = res.data.childrens.length - 1 !== index;
                    html += renderRow(val, 2, parentId, childId, url + childId);
                    html += renderExtra(
                        val.extras,
                        "child-" + parentId,
                        childId,
                        false,
                        last
                    );

                    if (val.childrens.length > 0) {
                        val.childrens.forEach(val => {
                            html += renderRow(
                                val,
                                3,
                                parentId,
                                childId,
                                url + childId
                            );
                        });
                    }
                    html += renderLastRow(val, last);

                    // let last = (res.data.childrens.length-1) !== index;
                    // html += renderExtra(val.extras, 'child-'+parentId, childId, false, last);
                });
            }

            // html += renderRow(res.data, 1, parentId)
            // html += renderExtra(res.data.extras, parentId, '', true, false);

            html += "</tbody>";
            html += "<tfoot><tr>";
            // html += '<td>&nbsp;</td>';
            html += '<td colspan="' + footerColspan + '">' + legend + "</td>";
            html += "</tr></tfoot>";
            $("#" + datatableId).append(html);
            return res;
        })
        .then(res => {
            if (res) {
                // $('.child').hide('fast');
                $(".level_3").hide("fast");
                $(".extras").hide("fast");
                $(".grand_total").show("fast");
                $("#loader-spinner-table").remove();
                return datatableOptions("#" + datatableId, res, baseurl);
            }
            return false;
        })
        .then(table => {
            if (table) {
                const adjust = setInterval(() => {
                    table.columns.adjust();
                    clearInterval(adjust);
                }, 500);
            }
            // value click to show pop up dimension
            $("#datatables tbody").on("click", "tr", function() {
                // disable parent/level 1 collapse
                let className = $(this).attr("class");
                if (className.includes("level_1")) {
                    return;
                }

                // collapse and expand setup
                let classId = $(this).attr("data-id");
                let level = $(this).attr("data-level");
                if (typeof status[classId] === "undefined") {
                    $("." + classId).show();
                    status[classId] = true;
                } else if (status[classId]) {
                    $("." + classId).hide();
                    $(".child-" + classId).hide();
                    level == 1 ? (status = {}) : (status[classId] = false);
                } else if (!status[classId]) {
                    $("." + classId).show();
                    status[classId] = true;
                }
            });

            // search event expand all hidden row and hide extra row
            $("#datatables_filter")
                .children("input[type=search]")
                .click(() => {
                    $(".child").show();
                    $(".extras").hide();
                });

            // on focus out search event
            $("#datatables_filter")
                .children("input[type=search]")
                .focusout(() => {
                    $(".level_3").hide("fast");
                    $(".extras").hide("fast");
                    $(".grand_total").show("fast");
                });

            // remove datatables info
            $("#datatables_info").remove();
        });
};

export const renderRsrTableTemplate = (datatableId, position, title = null) => {
    title = title ? title : tableTitle;
    return $("main").append(
        '<hr>\
        <div class="row">\
            <div class="col-md-12">\
                <div class="card">\
                    <div class="card-header" style="color:black;">' +
            title +
            '</div>\
                </div>\
            </div>\
        </div>\
        <div class="table-wrapper-scroll-y my-custom-scrollbar" style="margin-top:25px; margin-bottom:50px;">\
            <div class="d-flex justify-content-center" id="loader-spinner-table">\
                <div class="spinner-border text-primary loader-spinner" style="top:' +
            position +
            '; margin-bottom:50px;" role="status">\
                    <span class="sr-only">Loading...</span>\
                </div>\
            </div>\
            <div class="table-responsive" id="table-container">\
                <table id="' +
            datatableId +
            '" class="table table-sm table-bordered" cellspacing="0" style="width:100%;"></table>\
            </div>\
            <div id="datatableWrapper" class="tab-content"></div>\
        </div>\
    '
    );
};
