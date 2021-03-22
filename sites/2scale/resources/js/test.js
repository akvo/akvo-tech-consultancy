import { loadData, datatableOptions } from "./rsrDatatables.js";

let rowStatus = {};
export const rsrRenderUiiTable = (endpoint, baseurl, datatableId) => {
    let html = "";
    loadData("uii/0/0")
        // .then(res => {
        //     // data refactoring
        //     let data = res.data.map(item => {
        //         let temp = [];
        //         temp.push(item.uii);
        //         res.partnership.forEach(p => {
        //             let val = item[p][0];
        //             let percent = (val.baseline_value / val.target_value) * 100;
        //             temp.push(percent.toFixed(2));
        //         });
        //         return temp;
        //     });
        //     return { ...res, data };
        // })
        .then(res => {
            html += "<thead class='thead-dark'>";
            html += "<tr>";
            html += "<th rowspan='2'>UII</th>";
            res.partnership.forEach(item => {
                html += "<th colspan='2'>" + item + "</th>";
            });
            html += "</tr>";
            html += "<tr>";
            res.partnership.forEach(item => {
                html += "<th>Target</th>";
                html += "<th>Baseline</th>";
            });
            html += "</tr>";
            html += "</thead>";
            return res;
        })
        .then(res => {
            html += "<tbody>";
            res.data.forEach((item, index) => {
                let dimensions = [];
                html +=
                    "<tr class='uiiRow-" +
                    index +
                    "' data-id='child-" +
                    index +
                    "' data-level='2'>";
                html += "<td>" + item.uii + "</td>";
                res.partnership.forEach(p => {
                    let pval = item[p][0];
                    html += "<td>" + pval["target_value"] + "</td>";
                    html += "<td>" + pval["baseline_value"] + "</td>";
                    if (
                        pval.dimensions !== null &&
                        item.uii !==
                            "UII-3 EEP: Rural communities are resilient to the implications of climate change"
                        //     &&
                        // p !== "ET26_Dairy_Evergreen"
                    ) {
                        let tmp = pval.dimensions[0].values;
                        tmp["project"] = pval.project;
                        dimensions.push(tmp);
                    }
                });
                html += "</tr>";
                // render dimensions value
                if (dimensions.length > 0) {
                    let dims = dimensions[0];
                    dims.forEach(dim => {
                        html += "<tr class='dimensions child-" + index + "'>";
                        html += "<td>" + dim.name + "</td>";
                        dimensions.forEach(d => {
                            let dval = d.filter(x => x.name === dim.name)[0];
                            html += "<td>" + dval["value"] + "</td>";
                            html += "<td>" + dval["actual"] + "</td>";
                        });
                        html += "</tr>";
                    });
                }
            });
            html += "</tbody>";
            return res;
        })
        .then(res => {
            $("#" + datatableId).append(html);
            return res;
        })
        .then(res => {
            $(".dimensions").hide("fast");
            $("#loader-spinner-table").remove();
            // let table = $("#" + datatableId).DataTable({
            //     ordering: false
            // });
            res = {
                ...res,
                data: { project: "title test" },
                // columns: res.partnership
                columns: [1]
            };
            return datatableOptions("#" + datatableId, res, baseurl);
        })
        .then(table => {
            const adjust = setInterval(() => {
                table.columns.adjust();
                clearInterval(adjust);
            }, 500);

            // value click to show pop up dimension
            $("#datatables tbody").on("click", "tr", function() {
                let className = $(this).attr("class");
                // disable parent/level 1 collapse
                // if (className.includes("level_1")) {
                //     return;
                // }

                // collapse and expand setup
                let classId = $(this).attr("data-id");
                let level = $(this).attr("data-level");
                if (typeof rowStatus[classId] === "undefined") {
                    $("." + classId).show();
                    rowStatus[classId] = true;
                } else if (rowStatus[classId]) {
                    $("." + classId).hide();
                    $(".child-" + classId).hide();
                    level == 1
                        ? (rowStatus = {})
                        : (rowStatus[classId] = false);
                } else if (!rowStatus[classId]) {
                    $("." + classId).show();
                    rowStatus[classId] = true;
                }
            });
        });
};
