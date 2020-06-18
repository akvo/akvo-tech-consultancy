var brandnode = document.createElement("div");
brandnode.style.cssText = 'position: absolute; bottom: 10px; right: 10px; z-index: 999; background: #dddddd80; border-radius: 5px; padding: 5px 10px; font-family: inherit; font-size: 14px;';
var brandnodetext = document.createTextNode("Built with ");
brandnode.appendChild(brandnodetext);

var akvolink = document.createElement("a");
var akvolinktext = document.createTextNode("Akvo");
akvolink.style.cssText = 'color:#03ad8c;font-weight:400;cursor:pointer;text-decoration:none;';
akvolink.href = 'https://www.akvo.org';
akvolink.target = '_blank';
akvolink.appendChild(akvolinktext);
brandnode.appendChild(akvolink);

document.body.appendChild(brandnode);

(function(window, document, dataLayerName, id) {
window[dataLayerName]=window[dataLayerName]||[],window[dataLayerName].push({start:(new Date).getTime(),event:"stg.start"});var scripts=document.getElementsByTagName('script')[0],tags=document.createElement('script');
function stgCreateCookie(a,b,c){var d="";if(c){var e=new Date;e.setTime(e.getTime()+24*c*60*60*1e3),d="; expires="+e.toUTCString()}document.cookie=a+"="+b+d+"; path=/"}
var isStgDebug=(window.location.href.match("stg_debug")||document.cookie.match("stg_debug"))&&!window.location.href.match("stg_disable_debug");stgCreateCookie("stg_debug",isStgDebug?1:"",isStgDebug?14:-1);
var qP=[];dataLayerName!=="dataLayer"&&qP.push("data_layer_name="+dataLayerName),isStgDebug&&qP.push("stg_debug");var qPString=qP.length>0?("?"+qP.join("&")):"";
tags.async=!0,tags.src="//analytics.akvo.org/containers/"+id+".js"+qPString,scripts.parentNode.insertBefore(tags,scripts);
!function(a,n,i){a[n]=a[n]||{};for(var c=0;c<i.length;c++)!function(i){a[n][i]=a[n][i]||{},a[n][i].api=a[n][i].api||function(){var a=[].slice.call(arguments,0);"string"==typeof a[0]&&window[dataLayerName].push({event:n+"."+i+":"+a[0],parameters:[].slice.call(arguments,1)})}}(i[c])}(window,"ppms",["tm","cm"]);
})(window, document, 'dataLayer', 'f6fdd448-a2bc-4734-8aa0-dba4d0d0f2a3');
