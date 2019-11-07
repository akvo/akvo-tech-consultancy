$("#select-survey").on("change.bs.select", (e) => {
    let url = e.target.attributes["data-url"].value + "/" + e.target.value;
    $("#akvo-flow-web").attr("src", url);
});
