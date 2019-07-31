var ckanid = jQuery('#ckan-data').text();
var loading = '<div class="lds-loading"><h3>Loading Datasets</h3><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>';
jQuery("article").prepend(loading);
jQuery.get('/wp-json/tckan/v1?id=' + ckanid, function(data){
    if (data.id) {
        var html = "<table class='ckan-list' id='"+ data.id +"'>"
            html += "<tr>";
            html += "<td colspan=2 class='widget-area'><h2 class='widget-title'>"+ data.title +"</h2></td></tr>"
            html += "<tr><td class='name'>Author</td><td>"+ data.author +"</td></tr>"
            html += "<tr><td class='name'>Organisation</td><td>"+ data.organization.title +"</td></tr>"
            html += "<tr><td class='name'>Resources</td><td class='ckan-datasets'>"
            if (data.resources.length > 0) {
                html += "<ul class='ckan-resources'>";
                data.resources.forEach(function(a, x){
                    if (x < 5){
                        html += "<li class='data-listing'><a href='"+ a.url +"' target='_blank'>" + a.name +"</a> <kbd>" + a.format + "</kbd></li>";
                    } else if (x === 5) {
                        html += "</br></br>... and " + data.resources.length + " more datasets</br>";
                    } else {
                        console.log(a);
                    }
                })
                html += "</ul></td></tr>"
            } else {
                html += "No Data Available";
            }
        html += "</table>"
        jQuery("article").prepend(html);
    }
    jQuery(".lds-loading").remove();
});
