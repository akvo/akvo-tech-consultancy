let previewable = ['xls', 'xlsx','csv'];
var ckanid = jQuery('#ckan-data').text();
var ckanframes = jQuery('.ckan-table');

jQuery(document).ready(function( jQuery ) {
if (ckanid !== '') {
    initakvockan();
}

if (ckanframes.length > 0) {
    generateframes( ckanframes );
}

jQuery("#dataset-query").on('change', function(){
	let thisval = jQuery(this).val();
	if (thisval.length > 4) {
        jQuery('.dataset-lists').remove();
		searchdatasets(thisval);
        jQuery(".lds-ellipsis").show();
	}
});

jQuery(".btn-ckan-search").on('click', function(){
	let thisval = jQuery(this).val();
	if (thisval.length > 4) {
        jQuery('.dataset-lists').remove();
		searchdatasets(thisval);
        jQuery(".lds-ellipsis").show();
	}
});

function awaitframes(id_collections, id_tables, queue, iterate) {
    if (queue <= iterate) {
        jQuery.get("/wp-json/akvockan/v1?id=" + id_collections[queue], function(data){
            let html = '';
            if (data.resources.length > 0) {
                html += generateresources(data, true);
            }
            jQuery(id_tables[queue]).append(html);
        }).done(function(){
            jQuery('#load-' + id_collections[queue]).remove();
            queue += 1;
            awaitframes(id_collections, id_tables, queue, iterate);
        });
    }
    return true;
}

function generateframes(ckanframes) {
    let id_collections = [];
    let id_tables = [];
    let iterate = 0;
    jQuery(ckanframes).each(function(index, table) {
        let id = jQuery(table).attr('data-id');
        let loading = '<div id="load-'+ id +'" class="lds-loading"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>';
        jQuery(table).append(loading);
        id_tables.push(table);
        iterate += 1;
        id_collections.push(id);
    });
    awaitframes(id_collections, id_tables, 0, iterate);
}

function generateresources(data, isDataset) {
    let html = "";
    if (isDataset) {
        html += "<div class='ckan-div-dataset'>";
    }
    html += "<ul class='ckan-resources'>";
    data.resources.forEach(function(a, x){
            let at = a.format.toLowerCase();
            let icon = at;
            if (at === "akvo lumen") {
                icon = 'lumen';
            }
            let sd = shortDesc(a.description, JSON.stringify(a), data.name);
            html += "<li class='ckan-files data-listing'>";
                html += "<a onclick='showframe(" + JSON.stringify(a) + ",\"" + data.name + "\")'"+ at +"'>"
                html += a.name +"</a>";
                html += "<span class='"+ sd.class +"'>" + sd.desc + "</span>";
                html += "<a target='blank' href='"+ a.url +"' id='download-"+ a.id +"' class='btn-prev-down'><i class='fa fa-download'></i>  Download</a>";
                html += "<a onclick='showframe(" + JSON.stringify(a) + ",\"" + data.name + "\")' class='btn-prev-down'><i class='fa fa-eye'></i> Preview</a>";
                html += "<a onclick='showframe(" + JSON.stringify(a) + ",\"" + data.name + "\")' class='button-file "+ at +"'>"
                html += "<i class='fa fa-eye'></i>  " + a.format;
                html += "</a>";
            html += "</br>";
            html += "</li>";
    })
    html += "</ul>";
    if (isDataset) {
        html += "</div>";
    }
    return html;
}

function searchdatasets( q ) {
    jQuery.get("/wp-json/akvockan/v1?q=" + q, function(data){
		if (data.length > 0) {
			feedPost();
		}
        jQuery(".lds-ellipsis").hide();
		let html = '<article id="post-196" class="dataset-lists card card-blog card-plain post-196 post type-post status-publish format-standard has-post-thumbnail hentry category-all-post"></article>';
		jQuery("#ckan-container").append(html);
		data.forEach(function(res,index) {
            res.resources.forEach(function(a, x) {
                let html = '';
                html += "<div class='ckan-files'>";
                let at = a.format.toLowerCase();
                let icon = at;
                if (at === "akvo lumen") {
                    icon = 'lumen';
                }
                let sd = shortDesc(a.description, JSON.stringify(a), data.name);
                html += "<a onclick='showframe(" + JSON.stringify(a) + ",\"" + res.name + "\")'"+ at +"'>"
                html += a.name +"</a>";
                html += "<span class='"+ sd.class +"'>" + sd.desc + "</span>";
                html += "<a target='blank' href='"+ a.url +"' id='download-"+ a.id +"' class='btn-prev-down'><i class='fa fa-download'></i>  Download</a>";
                html += "<a onclick='showframe(" + JSON.stringify(a) + ",\"" + res.name + "\")' class='btn-prev-down'><i class='fa fa-eye'></i> Preview</a>";
                html += "<a onclick='showframe(" + JSON.stringify(a) + ",\"" + res.name + "\")' class='button-file "+ at +"'>"
                html += "<i class='fa fa-eye'></i>  " + a.format;
                html += "</a>";
                html += "</div>";
                jQuery('.dataset-lists').append(html);
            });
		});
	});
}

function feedPost(data) {

}

function shortDesc(a, b, c) {
    let trim = a.substr(0, 250);
    let word = 'No Description';
    let cl = 'short-desc no-desc'
    if (trim.length > 0) {
        word = trim.substr(0, Math.min(trim.length,trim.lastIndexOf(" "))) + '... ';
        cl = 'short-desc'
    }
    return { 'desc':word, 'class':cl }
}


function initakvockan() {
    var loading = '<div class="lds-loading"><h3>Loading Datasets</h3><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>';
    jQuery("#ckan-container").append(loading);
    jQuery.get('/wp-json/akvockan/v1?id=' + ckanid, function(data){
        if (data.id) {
            var html = "<table class='ckan-list' id='"+ data.id +"'>"
                html += "<tr>";
                html += "<td colspan=2 class='widget-area'><h2 class='widget-title'>"+ data.title +"</h2></td></tr>"
                html += "<tr><td class='name'>Author</td><td>"+ data.author +"</td></tr>"
                html += "<tr><td class='name'>Author Email</td><td>"+ data.author_email +"</td></tr>"
                html += "<tr><td class='name'>Organisation</td><td>"+ data.organization.title +"</td></tr>"
                html += "<tr><td class='name'>Resources</td><td class='ckan-datasets'>"
                if (data.resources.length > 0) {
                    html += generateresources(data, false);
                    html += "<tr><td class='name'>License</td><td>"+ data.license_title +"</td></tr>"
                    html += "<tr><td class='name'>Published at</td><td>"+ data.metadata_created +"</td></tr>"
                    html += "<tr><td class='name'>Last modified</td><td>"+ data.metadata_created +"</td></tr>"
                } else {
                    html += "No Data Available";
                }
            html += "</table>"
            jQuery("#ckan-container").append(html);
        }
        jQuery(".lds-loading").remove();
    });
}

})

function showframe(a, b){
    jQuery('nav').hide();
    jQuery('body').addClass('hide-overflow');
    let dh = jQuery(document).height();
    let icon = 'data';
    let at = a.format.toLowerCase();
    let preview = (previewable.indexOf(at) > -1);
    if (at === "akvo lumen") {
        icon = 'lumen';
    } else {
        icon = at;
    }
    let html = "<div class='data-viewer' id='view-"+a.id+"'>";
        html += "<h1 class='data-title'>"+a.name+"<small class='" + at + "'>"+a.format+"</small></h1>";
        html += "<p>"+a.description+"</p>";
        html += "<div class='data-close'>";
        html += "<a onclick='jQuery(\"#view-"+a.id+"\").remove(); jQuery(\"nav\").show(); jQuery(\"body\").removeClass(\"hide-overflow\")'><i class='fa fa-close'></i> </a>";
        html += "</div>";
        html += "<div class='data-iframe-container'>";
        if (!preview) {
            let url = a.url;
            if (a.format === "DOCX") {
                url = "https://docs.google.com/gview?url="+a.url+"&embedded=true";
           }
            html += "<iframe src='"+url+"'>";
            html +="</iframe>";
        }
        html +="</div>";
        html += "</div>";
    jQuery("body").append(html);
    if (preview) {
        jQuery.get("/wp-json/akvockan/v1?visual=" + a.id + "&name=" + b, function(data){
            data.forEach(function(s, i){
                html = "<small class='tab'>" + s.title + "</small>"
                if (i === 0) {
                    let html = "<small class='tab tab-active'>" + s.title + "</small>";
                    let embedd = s.embedd;
                    let iframe = "<iframe src='"+embedd+"'>";
                        iframe +="</iframe>";
                    jQuery('.data-iframe-container').append(iframe);
                }
                jQuery('h1.data-title').append(html);
            });
        });
    }
}

