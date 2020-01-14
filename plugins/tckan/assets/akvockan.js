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

function generateframes(ckanframes) {
    jQuery(ckanframes).each(function(index, table) {
        let id = jQuery(table).attr('data-id');
        jQuery.get("/wp-json/akvockan/v1?id=" + id, function(data){
            let html = '';
            if (data.resources.length > 0) {
                html += generateresources(data, true);
            }
            jQuery(table).append(html);
        });
    });
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
            html += "<li class='data-listing'>";
            html += "<a target='blank' href='"+ a.url +"' id='resource-"+ a.id +"'>";
            html += "<i class='fa fa-download'></i>  " + a.name +"</a>";
            html += "<a onclick='showframe(" + JSON.stringify(a) + ",\"" + data.name + "\")' href='#' class='button-file "+ at +"'>"
            html += "<i class='fa fa-eye'></i>  " + a.format;
            html += "</a>";
            html += "</br>";
            html += "<span class='"+ sd.class +"'>" + sd.desc + "<span>";
            html += "</li>";
    })
    html += "</ul>";
    if (isDataset) {
        html += "</div>";
    }
    return html;
}

function searchdatasets( q ) {
    jQuery.get("/wp-json/wp/v2/dataset?search=" + q, function(data){
		if (data.length > 0) {
			feedPost();
		}
        jQuery(".lds-ellipsis").hide();
		let html = '<article id="post-196" class="dataset-lists card card-blog card-plain post-196 post type-post status-publish format-standard has-post-thumbnail hentry category-all-post"></article>';
		jQuery("#ckan-container").append(html);
		data.forEach(function(a,x) {
			let link = '/?dataset=' + a.slug;
			let html = '<div class="row">';
				html += '<div class="col-ms-4 col-sm-4">';
				html += '<div class="card-image">';
				html += '<a href="'+link+'" id="media-'+a.featured_media+'">';
				html += '</a>';
				html += '</div>';
				html += '</div>';

				html += '<div class="col-ms-8 col-sm-8">';
				html += '<h6 class="category text-info"></h6>';
				html += '<h3 class="card-title entry-title">';
				html += '<a href="'+link+'">'+a.title.rendered+'</a>';
				html += '</h3>';
				html += '<div class="card-description entry-summary ">';
				html += '<p>'+ a.excerpt.rendered;
				html += '<a class="moretag" href="'+link+'"> Read more…</a>';
				html += '</p>';
				html += '</div>';
				html += '</div></div>';
			jQuery(".dataset-lists").append(html);
			jQuery.get("/wp-json/wp/v2/media/" + a.featured_media, function(x){
				let media = '<img width="360" height="240" src="'+ x.media_details.sizes["hestia-blog"]["source_url"] +'" class="attachment-hestia-blog size-hestia-blog wp-post-image" alt="">';
				jQuery("#media-"+x.id).append(media);
			});
		});
	});
}

function feedPost(data) {

}

function shortDesc(a, b, c) {
    let trim = a.substr(0, 150);
    let word = 'No Description';
    let cl = 'short-desc no-desc'
    if (trim.length > 0) {
        word = trim.substr(0, Math.min(trim.length,trim.lastIndexOf(" "))) + '... ' + '<a class="read-more" href="#"> Read More' + '</a>';
        cl = 'short-desc'
    }
    return { 'desc':word, 'class':cl }
}


function initakvockan() {
    console.log('bing');
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
        html += "<a href='#' onclick='jQuery(\"#view-"+a.id+"\").remove(); jQuery(\"nav\").show(); jQuery(\"body\").removeClass(\"hide-overflow\")'><i class='fa fa-close'></i> </a>";
        html += "</div>";
        html += "<div class='data-iframe-container'>";
        if (!preview) {
            html += "<iframe src='"+a.url+"'>";
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
                    let iframe = "<iframe src='"+s.embedd+"'>";
                        iframe +="</iframe>";
                    jQuery('.data-iframe-container').append(iframe);
                }
                jQuery('h1.data-title').append(html);
            });
        });
    }
}

