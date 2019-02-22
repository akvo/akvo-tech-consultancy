(function($) {
    'use strict';
$(document).ready(function() {

    function addSeparatorToNumber(number) {
        if (number < 1000) {
            return number;
        } else {
            var str = '' + number;
            var arr = str.split('');
            var out = ''

            for (var i = arr.length - 1, y = 1; i >= 0; i--,
                y++) {
                out = arr[i] + out;
                if (i > 0 && y % 3 === 0) {
                    out = ',' + out;
                }
            }

            return out;
        }
    }

	function addList(codeNum, text) {
		return '<div class="act-list"><span class="act-number">'+ codeNum + '</span>' + text + '</div>';
	};


    // Load the cell data
    $.each(logFrameData, function(key, colData) {
        var column = document.createElement('div');

        $(column).addClass('column');
        $(column).addClass(colData.className);
        for (var i = 1; i <= colData.cellNum; i++) {
            var thisNum = null;
            var parentNum = null;
            var cellData = colData.cellData[i];
            if(colData.className === 'outputs'){
                var codeNum = cellData.cellNumber.split('.');
                thisNum = codeNum[2];
                parentNum = codeNum[0] + '.' + codeNum[1];
            }
            if(colData.className === 'st-outcomes'){
                var codeNum = cellData.cellNumber.split('.');
                thisNum = codeNum[1];
                parentNum = codeNum[0];
            }
            if(colData.className === 'lt-outcomes') {
                thisNum = cellData.cellNumber;
            }
            var cell = document.createElement('div');
            var cellTable = document.createElement('div');
            var cellContents = document.createElement('div');
            var cellHoverOver = document.createElement('div');

            $(cell).addClass('cell');
            $(cell).attr('data-parent', parentNum);
            $(cell).attr('data-number', thisNum);
            $(cellTable).addClass('cell-table');
            $(cellContents).addClass('cell-contents');

            if (cellData.cellGlyph) {
                var glyphSpan = document.createElement('span');
                $(glyphSpan).addClass('cell-glyph');
                $(glyphSpan).addClass(cellData.cellGlyph);
                $(cellContents).append(glyphSpan);
            } else {
                $(cellContents).addClass('no-glyph');
            }

            if (cellData.cellNumber) {
                var numSpan = document.createElement(
                    'span');
                $(numSpan).addClass('cell-number');
                $(numSpan).addClass('numSpan' + cellData.cellNumber);
                $(numSpan).text(cellData.cellNumber);
                $(cellContents).append(numSpan);
            }

            if (cellData.icon) {
                var iconSpan = document.createElement(
                    'span');
                $(iconSpan).addClass('cell-icon');
                $(iconSpan).addClass(cellData.icon);

                if (cellData.iconLeft) {
                    $(iconSpan).addClass('icon-left');
                }

                $(cellContents).append(iconSpan);
            }

            if (cellData.name) {
                if (cellData.name != 'BLANK' &&
                    cellData.name != 'ARROW') {
                    $(cellContents).html($(cellContents).html() + cellData.name);
                }
            }
            if (cellData.fullName) {
                $(cell).css('cursor', 'pointer');
            }
            if (cellData.next) {
                $(cell).attr('data-next', cellData.next);
            }
            if (cellData.height) {
                var heightClass = 's' + cellData.height;
                $(cell).addClass(heightClass);
            }
            $(cellHoverOver).addClass('cellHoverOver');
            $(cellHoverOver).css('display', 'none');

            var fullNameDiv = document.createElement('div');
            $(fullNameDiv).addClass('fullName');
			$(cellData.fullName).each(function(i, x){
				let seriesNum = parentNum + '.' + thisNum + '.' + (i + 1);
            	$(fullNameDiv).append(addList(seriesNum, x));
			});

            var targetDiv = document.createElement('div');
            $(cellHoverOver).append(fullNameDiv);
            $(cellTable).append(cellContents);
            $(cell).append(cellTable);
            $(cell).append(cellHoverOver);
            $(column).append(cell);
        }

        $('.logframe-content').append(column);
    });

    function highLights(el, action){
        let number = el.attr('data-number');
        let parentNumber = el.attr('data-parent');
		if (number === '0') {
			return;
		}
        let childNums = parentNumber + '.' + number;
        let thisClass = el.parent().attr('class').split(' ')[1];
        if (thisClass === 'st-outcomes') {
            let childrens = $('.outputs').children();
            let parents = $('.lt-outcomes').children();
            $(childrens).each(function(){
                let $this = $(this);
                let childGroups = $this.attr('data-parent');
                if (childGroups === childNums){
                    if(action === 'on'){
                        $this.addClass('highlight');
                    }else{
                        $this.removeClass('highlight');
                    }
                };
            });
            $(parents).each(function(){
                let $this = $(this);
                let parentGroups = $this.attr('data-number');
                if (parentGroups === parentNumber){
                    if(action === 'on'){
                        $this.addClass('highlight');
                    }else{
                        $this.removeClass('highlight');
                    }
                };
            });
        } else if(thisClass === 'lt-outcomes') {
            let childrens = $('.st-outcomes').children();
            let outputs = $('.outputs').children();
            $(childrens).each(function(){
                let $this = $(this);
                let childGroups = $this.attr('data-parent');
                if (childGroups === number){
                    if(action === 'on'){
                        $this.addClass('highlight');
                    }else{
                        $this.removeClass('highlight');
                    }
                };
            });
            $(outputs).each(function(){
                let $this = $(this);
                let childGroups = $this.attr('data-parent').split('.');
                if (childGroups[0] === number){
                    if(action === 'on'){
                        $this.addClass('highlight');
                    }else{
                        $this.removeClass('highlight');
                    }
                }
            });
        }
    };

    $('.cell').on('mouseenter', function() {
        var fullName = $(this).find('.cellHoverOver .fullName').html();
        let codeNum = $(this).attr('data-number');
        highLights($(this), 'on');
        if (fullName === '') {
            if (codeNum !== '0'){
                $(this).addClass('highlight');
            }
            return;
        }
		var elParent = $(this).parent();
		if(elParent.hasClass('outputs')){
			$('.st-outcomes').hide();
			$('.lt-outcomes').hide();
			$('.main-objective').hide();
			$('.sloped').css('opacity', '0');
		}
        var el = $('.hoverContainer');
        var thisWidth = $(this).width();
        var thisHeight = $(this).outerHeight();
        el.css('display', 'none');
		var elHTML = '<div class="column-titles">Activities</div>';
        el.find('.fullName').html(elHTML + fullName);
        var verticalOffsetFromBottom = $(this).offset().top > ($('html').height() / 2) ?  true : false;
        el.removeClass('inactive').addClass('active').css('position', 'absolute').css('left', $(this).offset().left + $(this).outerWidth())
            .css('width', 400)

        // If the element is in the bottom half of the page, display the popup
        // above it instead of below

        if (verticalOffsetFromBottom) {
            el.css('top', $(this).offset().top - $(el).outerHeight())
            .css('margin-top', 20)
            .css('border-radius', '2em 2em 2em 0');
        } else {
            el.css('top', $(this).offset().top + $(this).outerHeight())
            .css('margin-top', -20)
            .css('border-radius', '0 2em 2em 2em');
        }

        el.fadeIn('fast');
        $(this).addClass('highlight');
    });
    $('.cell').on('mouseleave', function() {
        $('.hoverContainer').css('border-radius', '2em').stop().hide();
        highLights($(this), 'off');
        $(this).removeClass('highlight');
		$('.st-outcomes').show();
		$('.lt-outcomes').show();
		$('.main-objective').show();
		$('.sloped').css('opacity', '1');
    });
});

})(jQuery);
