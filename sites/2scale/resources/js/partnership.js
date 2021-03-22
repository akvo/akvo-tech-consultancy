import { db, storeDB } from "./dexie";
const axios = window.axios;
import { getCharts, getCards, getSingleCards } from "./charts.js";
import { renderRsrTableTemplate, renderRsrTable } from "./rsrDatatables.js";
import { rsrRenderUiiTable } from "./test.js";

/* Static */
const baseurl = $("meta[name=path]").attr("content");
const country_id = $("meta[name='country']").attr("content");
const partnership_id = $("meta[name='partnership']").attr("content");
const start_date = $("meta[name='start-date']").attr("content");
const end_date = $("meta[name='end-date']").attr("content");
const endpoints = [country_id, partnership_id, start_date, end_date].join("/");

/* Static */
const info = {
    head: "Header Lorem Ipsum",
    content: "Lorem Ipsum Dolor Sit Amet for Footer"
};

// getCards("partnership/top-three/" + endpoints);

/* First Row */
$("main").append("<div class='row' id='first-row'></div>");
getCharts("partnership/commodities/" + endpoints, "first-row", info, "12");

/* Second Row */
$("main").append("<hr><div class='row' id='second-row'></div>");
getCharts("partnership/countries-total/" + endpoints, "second-row", info, "6");
getCharts("partnership/project-total/" + endpoints, "second-row", info, "6");

// Table container
renderRsrTableTemplate("datatables", "142%");

// put a div (hidden) to store the charts for pdf report
$("main").append(
    "<div id='chart-report-container' class='invisible' style='margin-top:-999rem'></div>"
);

$("#chart-report-container").append(
    "<hr><div class='row' id='third-row'></div>"
);
getSingleCards("report/reachreact/card/" + endpoints, "third-row");

$("#chart-report-container").append(
    "<hr><div class='row' id='fourth-row'></div>"
);
getCharts("report/workstream/" + endpoints, "fourth-row", info, "12");

$("#chart-report-container").append(
    "<hr><div class='row' id='fifth-row'></div>"
);
getCharts("report/program-theme/" + endpoints, "fifth-row", info, "12");

$("#chart-report-container").append(
    "<hr><div class='row' id='sixth-row'></div>"
);
getCharts("report/target-audience/" + endpoints, "sixth-row", info, "12");

$("#chart-report-container").append(
    "<hr><div class='row' id='seventh-row'></div>"
);
getCharts(
    "reachreact/gender/" + endpoints,
    "seventh-row",
    info,
    "12",
    "",
    "age-category"
);

renderRsrTable([country_id, partnership_id].join("/"), baseurl, "datatables");

// table by UII
// rsrRenderUiiTable("", baseurl, "datatables");
