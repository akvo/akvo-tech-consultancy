function JsonTreeBuilder() {

    this.build = function (jsonDoc, type) {
        var tree = generateXml(jsonDoc,type);
        activateTree(tree, type);
        $('.json-array-hide').remove();
        return $('<div id="' + type + 'Tree"/>').append(tree);
    };

    var generateXml = function (data, type) {
        if (typeof (data) === 'object' && data !== null) {
            var ul = $('<ul>');
            if (type === "json") {
                let brk = (data.length === undefined) ? "{" : "[";
                let sp = $('<li class="json-array">');
                ul.append(sp.append(brk));
            }
            for (var i in data) {
                let bracket = isNaN(i) ? "<"+i+">" : i;
                let bracketend = isNaN(i) ? "</"+i+">" : "";
                if (type === "json") {
                    bracket = isNaN(i) ? '"' + i + '": ' : i + ":" ;
                    bracketend = isNaN(i) ? ',' : "}";
                }
                var li = $('<li>');
                var arrayClass = isNaN(i) ? "" : "num-key";
                var divin = $('<div class="xml xml-tag ' + arrayClass + '">');
                var divout = $('<div class="xml xml-tag">');
                if (isNaN(i)) {
                    ul.append(
                        li.html(divin.text(bracket))
                        .append(generateXml(data[i], type))
                        .append(
                            divout.text(bracketend)
                        )
                    );
                }
                else {
                    ul.append(
                        li.html(
                            divin.text(bracket)
                        )
                        .append(generateXml(data[i], type))
                    );
                }
            }
            if (type === "json") {
                brk = (data.length === undefined) ? "}" : ']';
                sp = $('<li class="json-array">');
                ul.append(sp.append(brk));
                brk = (data.length === undefined) ? "{" + Object.keys(data).length + "}" : "[" + data.length + "]";
                sp = $('<div class="json-array-hide">');
                ul.prepend(sp.append(brk));
            }
            return ul;
        } else {
            let v = (data === undefined) ? '' : data;
            var dbool = v === "false" || v === "true" ? "" : "data-bool";
            if (type === "json") {
                v = (data === undefined) ? '[empty]' : '"' + data + '"';
                v = dbool === "data-bool" ? replaceAll(v, '"','') : v;
            }
            var divcontent = $('<div class="xml xml-value '+ dbool +'">');
            divcontent.text(v);
            return divcontent;
        }
    };

    var replaceAll = function (string, search, replace) {
        return string.split(search).join(replace);
    }

    var activateTree = function (tree, type) {
        $('li > ul', tree).each(function () {
            var innerUlContent = $(this);
            var parent = innerUlContent.parent('li');
            if (type === "json") {
                var count = parent[0].firstChild;
                var fc = parent[0].children[1].firstChild;
                var contentName = $('<div class="json-object-name">').text(count.innerHTML);
                var hiddenCount = $('<div class="json-object-value">').text(fc.innerHTML);
                $(hiddenCount).hide();
                $(count).html(hiddenCount).prepend(contentName);
                fc.remove();
            }
            parent.addClass('expandable');
            parent.click(function () {
                $(this).toggleClass('expanded');
                if (type === "json") {
                    hiddenCount.toggle();
                }
                innerUlContent.toggle();
            });
            innerUlContent.click(function (event) {
                event.stopPropagation();
            });
        });
        $('ul', tree).show();
    };
}
