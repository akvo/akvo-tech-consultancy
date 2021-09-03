import "./../css/print.css";
import "./../css/custom.css";
const axios = require("axios");
const _ = require("lodash");
const baseurl = $("meta[name=path]").attr("content");

let post_data = {};
let project_option = () => {
  let selected = $("input[name='project-option']:checked")
    .map(function (_, el) {
      return $(el).val();
    })
    .get();
  if (selected.length > 0) {
    return selected;
  }
  return false;
};

let project_selection = () => {
  let selected = $("input[name='project-selection']:checked")
    .map(function (_, el) {
      return $(el).val();
    })
    .get();
  if (selected[0]) {
    return selected[0];
  }
  return false;
};

let project_type = () => {
  let yearly = $("#period-yearly").prop("checked");
  let semester = $("#period-semester").prop("checked");
  if (yearly) {
    return "yearly";
  }
  if (semester) {
    return "semester";
  }
  return false;
};

let date_selected = (x) => {
  let selected = $("#period-" + x + "-select option:selected").text();
  if (selected === "") {
    return false;
  }
  return selected;
};

let showModal = (html) => {
  $("#modal").modal("toggle");
  $("#modal").on("hidden.bs.modal", function () {
    $("#comment-alert").slideUp("fast");
    $("#save-comment").remove();
    $("#discard-comment").hide();
    $("#close-modal").show();
    $(".modal-data").children().remove();
    $(".comment-list").children().hide();
    $(".comment-group").children().hide();
    $(".comment-list").children().remove();
    $(".text-comment").remove();
  });
};

let generateModal = (data) => {
  data = JSON.parse(data);
  console.log(data.length);
  if (data.length > 0) {
    let indicator = data[0]["indicator_name"];
    let indicator_id = data[0]["indicator_id"];
    let dimension_name = data[0]["dimension_name"];
    let target_value = " > Target: " + data[0]["target_value"];
    let country = " > Country: " + data[0]["country"];
    $("#modal-title").text(indicator);
    $("#modal-subtitle").text(dimension_name + country + target_value);
    $(".comment-list").hide();
    $(".text-comment").remove();
    let html = tablecomment();
    showModal(html);
    appendcomment(indicator_id, data[0]["country"]);
    return true;
  }
  return true;
};

let tablecomment = () => {
  let html = "<table id='report-list' class='table table-striped table-fixed'>";
  html += "<thead>";
  html += "<tr>";
  html += "<td>Country</td>";
  html += "<td>Date</td>";
  html += "<td>Actual</td>";
  html += "<td>Reported</td>";
  html += "<td>Approved</td>";
  html += "<td width='30%'>Descriptions</td>";
  html += "</tr>";
  html += "</thead>";
  html += "<tbody class='data-list'>";
  html += "</tbody>";
  html += "<table>";
  $(".modal-data").children().remove();
  $(".modal-data").append("<div class='table-responsive'>" + html + "</div>");
};

let appendcomment = (id, country) => {
  $(".loading-comments").show();
  axios
    .get(baseurl + "/api/live/indicator_period_framework/indicator/" + id)
    .then((response) => {
      $(".loading-comments").hide();
      return response.data.map((x) => {
        let html = "";
        if (x["data"].length > 0) {
          x["data"].map((a) => {
            let html = "";
            html += "<tr>";
            html += "<td>" + country + "</td>";
            html += "<td>" + a.created_at.split("T")[0] + "</td>";
            html += "<td>" + a.value + "</td>";
            html +=
              "<td>" +
              a.user_details.last_name +
              " " +
              a.user_details.first_name +
              "</td>";
            html +=
              "<td>" +
              a.approver_details.last_name +
              " " +
              a.approver_details.first_name +
              "</td>";
            html += "<td>" + a.text + "</td>";
            html += "</tr>";
            $(".data-list").append(html);
          });
        }
      });
    })
    .catch((error) => {
      console.log(error);
      $(".loading-comments").hide();
    });
  return true;
};

let mergecomment = (data) => {
  $(".comment-list").prepend(
    "<div class='text-comment'>" +
      data["event_date"] +
      ": " +
      data["text"] +
      "</div>"
  );
  return true;
};
let mergecomments = (data) => {
  data.map((x) => {
    return $(".comment-list").prepend(
      "<div class='text-comment'>" +
        x["event_date"] +
        ": " +
        x["text"] +
        "</div>"
    );
  });
  return true;
};

let postcomment = (json) => {
  return axios
    .post(baseurl + "/api/postcomment", json)
    .then((response) => {
      switchAlertClass("Comment Updated", "success");
      $("#comment-id").val(response.data.id);
      $(".loading-comments").hide();
    })
    .catch((error) => {
      switchAlertClass("Network Error", "danger");
      $(".loading-comments").hide();
      console.log(error);
    });
};
let getcomments = (id) => {
  $(".comment-list").show();
  return axios
    .post(baseurl + "/api/getcomments", {
      uuid: id,
    })
    .then((response) => {
      let data = response.data[0];
      $("#save-comment i").hide();
      $("#comment-title").val(data.title);
      $("#comment-validator").val(data.notes);
      simplemde.value(data.text);
      // $("#comment-input").val(data.text);
      $("#comment-id").val(data.id);
    })
    .catch((error) => {
      $("#save-comment i").hide();
      console.log(error);
    });
};

let switchAlertClass = (text, classname) => {
  $("#comment-alert").children().remove();
  $("#save-comment i").hide();
  $("#comment-alert").prepend("<strong>" + text + "</strong>");
  if (classname === "danger") {
    $("#comment-alert").addClass("alert-danger");
    $("#comment-alert").removeClass("alert-success");
  }
  if (classname === "success") {
    $("#comment-alert").addClass("alert-success");
    $("#comment-alert").removeClass("alert-danger");
  }
  $("#comment-alert").slideDown("fast");
  return hideCommentAlert();
};

let hideCommentAlert = () => {
  return setTimeout(() => {
    $("#comment-alert").children().remove();
    $("#comment-alert").slideUp("fast");
  }, 2000);
};

let generateModalComment = (data) => {
  data = _.uniqBy(JSON.parse(data), "indicator_id");
  data = _.without(data, null);
  let indicator = data[0]["indicator_name"];
  let indicator_id = data[0]["indicator_id"];
  let period = data[0]["date"];
  let result_id = data[0]["result_id"];
  let validator_id = [];
  let title =
    "ID" +
    project_selection() +
    "I" +
    indicator_id +
    "PD" +
    date_selected(project_type());
  $("#modal-title").text("Add New Comment");
  $("#modal-subtitle").text(indicator);
  $(".comment-group").children().show();
  $(".text-comment").remove();
  tablecomment();
  data.map((x) => {
    const valid_id = x["indicator_id"] + "" + x["period"];
    validator_id.push(valid_id);
  });
  validator_id = _.join(validator_id, "-");
  getcomments(validator_id);
  simplemde.value();
  // $("#comment-input").val("");
  $("#comment-id").val("");
  $("#comment-title").val(title);
  $("#comment-validator").val(validator_id);
  data.map((x) => {
    const indicator_id = x["indicator_id"];
    const country = x["country"];
    return appendcomment(indicator_id, country);
  });
  $("#save-comment").remove();
  $(".comment-group").show();
  $("#discard-comment").show();
  $("#close-modal").hide();
  $("#modal-footer").append(
    '<button type="button" class="btn btn-primary" id="save-comment"><i class="fa fa-circle-notch fa-spin" style="display:none"></i> Save Comment</button>'
  );
  $("#save-comment").on("click", () => {
    $("#save-comment i").show();
    let title = () => {
      return $("#comment-title").val();
    };
    let content = () => {
      return simplemde.value();
      // return $("#comment-input").val();
    };
    let validator = () => {
      return $("#comment-validator").val();
    };
    let cid = () => {
      return $("#comment-id").val();
    };
    let json = {
      validator: validator(),
      message: content(),
      title: title(),
      id: cid(),
    };
    let emptypost = false;
    let error_alert = "";
    if (content() === "") {
      error_alert += "Title";
      emptypost = true;
    }
    if (emptypost) {
      error_alert += error_alert + " cannot be empty";
      switchAlertClass(error_alert, "danger");
    }
    if (!emptypost) {
      hideCommentAlert();
      $("#comment-alert").slideUp("fast");
      $(".loading-comments").show();
      postcomment(json);
    }
  });
  return showModal("");
};

$("#comment-alert").on("closed.bs.alert", function () {
  $("#comment-alert").children().remove();
});

let generateReport = (pd) => {
  $("#generate-report i").show();
  axios
    .post(baseurl + "/api/datatables/" + pd.project_id, pd)
    .then((response) => {
      return generateTable(response.data);
    })
    .catch((error) => {
      console.log(error);
      $("#generate-report i").hide();
      $("#list-of-alerts").append(
        "<h4 class='text-center'>Data is Not Available</h4>"
      );
      $("#alert").modal().show();
    });
};

$("#period-yearly").on("click", () => {
  $("#period-semester").prop("checked", false);
});
$("#period-semester").on("click", () => {
  $("#period-yearly").prop("checked", false);
});

$("input[name='project-selection'").map((x) => {
  let selection = $("input[name='project-selection'");
  let selected = $("input[name='project-selection'")[x];
  let selected_id = $("input[name='project-selection'")[x];
  $(selected).on("click", () => {
    $(selection).map((a) => {
      let ids = $("input[name='project-selection'")[a];
      if (ids !== selected_id) {
        $(ids).prop("checked", false);
      }
    });
  });
});

let update_data = () => {
  let report_type = project_type();
  let data = {
    report_type: report_type,
    filter_date: date_selected(report_type),
    project_id: project_selection(),
    project_option: project_option(),
  };
  return data;
};

$("#generate-report").on("click", () => {
  let post_data = update_data();
  $("#list-of-alerts").children().remove();
  let show_alert = false;
  let html = "<h4><i class='fa fa-times-circle' style='color:red;'></i> ";
  if (post_data["project_id"] === false) {
    show_alert = true;
    $("#list-of-alerts").append(
      html + "<a href='#projects'>Project ID is not Set</a></h4>"
    );
  }
  if (post_data["project_option"] === false) {
    show_alert = true;
    $("#list-of-alerts").append(
      html + "<a href='#settings'>Country is not Set</a></h4>"
    );
  }
  if (post_data["filter_date"] === false) {
    show_alert = true;
    $("#list-of-alerts").append(
      html + "<a href='#settings'>Period is not Set</a></h4>"
    );
  }
  if (show_alert) {
    $("#alert").modal("toggle");
    return false;
  }
  return generateReport(post_data);
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
    // tdclass = "has-data";
    tdclass = "";
  }
  let html =
    "<td class='text-right " +
    tdclass +
    "' data-details='" +
    JSON.stringify(data[details]) +
    "'>";
  html += data[col_type] || "-";
  html += "</td>";
  return html;
};

let generateGroup = (val, json, val_type) => {
  let val_data = " - ";
  let has_value = false;
  let total = false;
  let aggregats = "";
  if (val_type === "total_actual_value" || val_type === "total_target_value") {
    total = true;
  }
  if (json[0]) {
    has_value = true;
  }
  if (has_value) {
    val_data = parseInt(json[0][val_type]);
  }
  if (has_value && total) {
    val_data = val;
    aggregats = "data-aggregats=true";
  }
  if (has_value && isNaN(val_data)) {
    val_data = " - ";
  }
  let html = "<td class='text-right has-data'";
  html +=
    aggregats + " data-details='" + JSON.stringify(json) + "'>" + val_data;
  html += "</td>";
  return html;
};

let generateTable = (response) => {
  if ($.fn.DataTable.isDataTable("#rsr_table")) {
    $("#rsr_table").DataTable().destroy();
  }
  $("#rsr_table tbody").empty();
  let data = response.values;
  let resultTitle = response.result_titles;
  let groupTitle = response.titles;
  data.map((x, i) => {
    const commodity = ["Maize", "Rice", "Legumes", "Cassava"];
    let dimension_class = "dimension";
    let html = "<tr>";
    html += "<td>" + x["project_title"] + "</td>";
    if (commodity.indexOf(x["commodity"]) > -1) {
      dimension_class = "commodity";
    }
    html +=
      "<td data-type='+ x['indicator_type']  +'>" + x["indicator"] + "</td>";
    html += "<td>" + x["dimension_name"] + "</td>";
    html += "<td class='" + dimension_class + "'>" + x["commodity"] + "</td>";
    ["TTL", "MW", "MZ", "ZA"].map((tvalue) => {
      html += createRow(x, "TG", tvalue);
    });
    ["MW", "MZ", "ZA", "TTL"].map((tvalue) => {
      html += createRow(x, "CA", tvalue);
    });
    html += "</tr>";
    $("#rsr_table tbody").append(html);
    return html;
  });
  /* dom: 'Brftip', */
  /* autoPrint: true, */
  $("#rsr_table").show();
  const printsubtitle =
    "Project ID: " +
    project_selection() +
    " | Periods: " +
    date_selected(project_type());
  const table = $("#rsr_table").DataTable({
    dom: "Brftip",
    ordering: false,
    buttons: [
      "copy",
      {
        extend: "print",
        title: "APPSA",
        customize: function (win) {
          $(win.document.head).append(
            $(
              '<link href="' +
                baseurl +
                '/static/css/custom.css" rel="stylesheet">'
            )
          );
          $(win.document.head).append(
            $(
              '<link href="' +
                baseurl +
                '/static/css/print.css" rel="stylesheet">'
            )
          );
          $(win.document.body).find("table thead").remove();
          $(win.document.body).find("table tbody").remove();
          $(win.document.body).prepend("<h5>" + printsubtitle + "</h5></hr>");
          $(win.document.body).find("table").append($(".dataTable").html());
          $(win.document.body).find("table.dataTable tr.dtrg-group td");
        },
      },
      "excel",
      "pdf",
    ],
    rowGroup: {
      startRender: (rows, group) => {
        let getattr = (x) => {
          let rowidx = rows[0];
          let camw = rows.cells().column(x).nodes();
          let cells = [];
          rowidx.map((a, i) => {
            let json = camw[a].dataset.details;
            try {
              cells.push(JSON.parse(json)[0]);
            } catch (error) {}
            return true;
          });
          return cells;
        };
        let getattrttl = (x) => {
          let rowidx = rows[0];
          let camw = rows.cells().column(x).nodes();
          let cells = [];
          rowidx.map((a, i) => {
            let json = camw[a].dataset.details;
            try {
              cells.push(JSON.parse(json));
            } catch (error) {}
            return true;
          });
          return cells;
        };
        let getvalue = (x) => {
          let camw = rows
            .data()
            .pluck(x)
            .reduce((a, b) => {
              return a + b * 1;
            }, 0);
          return camw;
        };
        let html = "";
        if (resultTitle.indexOf(group) > 0) {
          return $("<tr/>").append("<td colspan=9>" + group + "</td>");
        }
        let indicator_level = [];
        [4, 5, 6, 7, 8, 9, 10, 11].map((x) => {
          let td = getattr(x);
          td.map((x) => {
            indicator_level.push(x);
          });
        });
        if (groupTitle.indexOf(group) > 0) {
          let attr = getattrttl(4);
          let row_data = [];
          let measure = 1;
          let targets = false;
          let actuals = false;
          if (attr.length > 0) {
            row_data = _.uniqBy(attr[0], "country");
          }
          if (row_data.length > 0) {
            measure = parseInt(row_data[0]["indicator_type"]);
          }
          if (measure === 2) {
            actuals = row_data.map((a, b) => {
              if (isNaN(parseInt(a["actual_value"]))) {
                return 0;
              }
              return parseInt(a["actual_value"]);
            });
            targets = row_data.map((a, b) => {
              if (isNaN(parseInt(a["target_value"]))) {
                return 0;
              }
              return parseInt(a["target_value"]);
            });
          }
          if (targets && actuals) {
            targets = targets.reduce((a, b) => {
              return a + b * 1;
            });
            actuals = actuals.reduce((a, b) => {
              return a + b * 1;
            });
          }
          [4, 5, 6, 7, 8, 9, 10, 11].map((x, i) => {
            let td = getvalue(x);
            let act = getattr(x);
            if (i === 7) {
              if (measure === 2) {
                html += generateGroup(
                  Math.round(actuals / 3),
                  indicator_level,
                  "total_actual_value"
                );
              } else {
                html += generateGroup(
                  td,
                  indicator_level,
                  "total_actual_value"
                );
              }
            }
            if (i === 0) {
              if (measure === 2) {
                html += generateGroup(
                  Math.round(targets / 3),
                  indicator_level,
                  "total_target_value"
                );
              } else {
                html += generateGroup(
                  td,
                  indicator_level,
                  "total_actual_value"
                );
              }
            }
            if ([4, 5, 6].indexOf(i) > -1) {
              html += generateGroup(td, act, "actual_value");
            }
            if ([1, 2, 3].indexOf(i) > -1) {
              html += generateGroup(td, act, "target_value");
            }
          });
          let indicator_badge;
          if (measure === 1) {
            indicator_badge = " <span class='numeric'> #N </span>";
          }
          if (measure === 2) {
            indicator_badge = " <span class='percentage'> %P </span>";
          }
          return $("<tr/>")
            .append(
              "<td><span class='group-text'>" +
                group +
                "</span>" +
                indicator_badge +
                "</td>"
            )
            .append(html);
        }
        if (resultTitle.indexOf(group) === -1) {
          let comment_data = JSON.stringify(indicator_level);
          html = "<td colspan=6>" + group + "</td>";
          html +=
            "<td class='has-data comment-form-show' data-comments=true data-details='" +
            comment_data +
            "' colspan=3>";
          html += "<i class='fa fa-plus'></i> Comments</td>";
          return $("<tr/>").append(html);
        }
        return $("<tr/>").append("<td colspan=9>" + group + "</td>");
      },
      endRender: null,
      dataSrc: [0, 1, 2],
    },
    columnDefs: [
      {
        targets: [0, 1, 2],
        visible: false,
      },
    ],
    fixedColumns: {
      leftColumns: 2,
    },
    scrollCollapse: false,
    responsive: false,
    fixedHeader: true,
    paging: false,
  });
  table.columns.adjust();
  $("div.dataTables_filter input").addClass("search");
  $("#rsr_table tbody").on("click", "td.has-data", function () {
    let iscomment = $(this).attr("data-comments");
    let isaggregate = $(this).attr("data-aggregats");
    let cell = table.cell(this);
    let abs = $(this).attr("data-details");
    if (!iscomment && !isaggregate) {
      generateModal(abs);
    }
    if (isaggregate) {
      generateModalComment(abs);
    }
    if (iscomment) {
      generateModalComment(abs);
    }
  });
  $("#generate-report i").hide();
  $("#scroll-report").click();
};
