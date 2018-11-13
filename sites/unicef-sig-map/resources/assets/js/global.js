/*
 *
 * Global Map Functions
 *
 */
let maps;

var nainclude = [
    'identifier',
    'latitude',
    'longitude',
    'elevation',
    'display name',
    'device identifier',
    'instance',
    'submission date',
    'submitter',
    'duration'
];

var qgroup = [{
        'n': 'Interview Details',
        'q': 10
    },
    {
        'n': 'School Information',
        'q': 13
    },
    {
        'n': 'Water Supply',
        'q': 20
    },
    {
        'n': 'Sanitation',
        'q': 31
    },
    {
        'n': 'Hygiene',
        'q': 9
    },
    {
        'n': 'School Management',
        'q': 42
    },
    {
        'n': 'Teacher',
        'q': 3
    },
    {
        'n': 'Head Teacher',
        'q': 4
    },
    {
        'n': 'Geolocation',
        'q': 1
    }
];

var paramGroups = {
    'school-info': [
        'new question - please change name',
        'name of school?',
        'new question - please change name',
        'type of school?',
        'what is the registration number of the school?',
        'what are the schools hours of operation?',
        'how many classrooms does the school have?',
        'how may girls attend this school?',
        'how many boys attend this school?',
        'how may males teachers teach in this school?',
        'how many female teachers teach in this school?',
        'what is the name of the head teacher of this school?',
        'what is the head teachers contact? (mobile or landline)',
    ],
    'water-supply': [
        'does the school have a water source?',
        'if yes, what is the schools primary drinking water source?',
        'please take a photo of the piped water source?',
        'please take a photo of the protected well?',
        'please take a photo of the unprotected well?',
        'please take a photo of the rainwater/roof water?',
        'please take a photo of the river/stream/sea?',
        'please take a photo of the water brought by kids from home?',
        'where is the primary water source located?',
        'is the primary water source used by the communities surrounding the school as well?',
        'is the water treated when taken from the primary source to ensure it is safe to drink?',
        'if treated, what sort of treatment is conducted?',
        'how often is treatment done?',
        'is the water available from the primary water source at the time of the survey?',
        'if water is available, please take a picture of the source?',
        'is the drinking water from the primary source available typically throughout the school year regardless of seasonal changes?',
        'is the primary water source accessible to all students, including small children and those with limited mobility?',
        'if yes, please take a picture of the access to the water source for small children?',
        'if yes, please take a picture of the access to the water source for those with limited mobility?',
        'does the school have a another water source that is available for cleaning and other uses?',
    ],
    'sanitation': [
        'does the school have toilets?',
        'if no, where do children go to defecate?',
        'what type of toilets are being used by the school? (please choose all appropriate) ',
        'of these, which is the main toilet that is used by the school?',
        'if pour flush or flush toilet, where does the water come from?',
        'which if the toilet type do students use the most?',
        'if yes, are the seperately marked for boys and girls?',
        'if no, how many toilets are available at the school?',
        'please take a picture of the toilet facilities?',
        'if yes, how many toilets are available for girls?',
        'please take a picture of the girls toilets?',
        'if yes, many toilets are available for boys?',
        'please take a picture of the boys toilets?',
        'please take a photo of the flush toilet?',
        'please take a photo of the pour flush toilet?',
        'please take a photo of the pit toilet with slab?',
        'please take a photo of the pit toilet without slab?',
        'please take a photo of the hanging toilet?',
        'please take a photo of the bucket toilet?',
        'please take a photo of the compost toilet?',
        'where are the toilets located?',
        'are the toilets accessible by all students including small children and children with limited mobility?',
        'please take a photo of the toilets that are accessible to children with limited mobility?',
        'please take a photo of the toilets that are accessible to small children?',
        'are the toilets clean on the day of the visit?',
        'are the toilets clean on the day of the visit?',
        'how many of the boys toilets are clean on the day of the visit?',
        'how many of the girls toilets are clean on the day of the visit?',
        'how many of the toilets are functional on the day of the visit?',
        'how many boys toilets are functional on the day of the visit?',
        'how many girls toilets are functional on the day of the visit?',
    ],
    'hygiene': [
        'are there hand washing facilities at the school?',
        'if yes, please take a photo of the hand washing facility?',
        'if yes, what type of facility is there?',
        'if yes, where is the hand washing facility located?',
        'are both soap and water available at the hand washing facility?',
        'where does the water for the hand washing facility come from?',
        'are the hand washing facilities accessible to all students including small children and those with limited mobility?',
        'do students wash their hands in group daily hand washing activities?',
        'does the school have a changing area where girls can change and wash safely (private and secure, door and lock and hangers)',
    ],
    'school-management': [
        'does the school have parent/teachers meeting?',
        'does the school keep evidence of the parent/teacher meetings? (log books/minutes of meeting)',
        'does the school have student wash clubs?',
        'does the school curriculum include hygiene topics? (check all that applies)',
        'if yes, please take photo of page that contains the hand washing topic?',
        'if yes, please take photo of page that contains the adolescent health - talking about girls periods?',
        'is there a school action plan or any plan?',
        'if yes, please take a photo of the document?',
        'does the plan include wash (repair, maintenance of toilets, water, soap)?',
        'if yes, please take a photo of the page that contains the wash aspects?',
        'is there a cleaning schedule for the toilet facilities?',
        'if yes, please take a photo of the cleaning schedule?',
        'if yes, who cleans the toilets?',
        'if yes, when does the cleaning happen?',
        'is there lighting, fan and computers at school? (check all that applies)',
        'please take a photo of the lighting?',
        'how many classrooms have proper lighting?',
        'please take a photo of the fan?',
        'how many classrooms have fans?',
        'please take a photo of the computer?',
        'how many classrooms have computers?',
        'is there lighting, fan and computers at staff houses? (check all that applies)',
        'please take a photo of the lighting?',
        'please take a photo of the fan?',
        'please take a photo of the computer?',
        'does the school receive government grants annually?',
        'if yes, how much money does the schools receive from the government annually?',
        'how much money has been spent so far this year (2017) on cleaning, repairing, and making water and soap available at school?',
        'how much did you spend last year (2016) on operating, repairing and maintaining toilets, water supply supply and hand washing facilities?',
        'did the school get any support from the community?',
        'if yes, what kind of support was received from the community?',
        'does the school have a point of contact at the provincial education authority level?',
        'if yes, please provide the name of the contact person?',
        'if yes, does the school reach out to the contact person?',
        'if yes, when was the last time the school reached out?',
        'does the school keep a log book of problems with the school such as no toilets, no water, no lights?',
        'if yes, please take a photo of the log book?',
        'do teachers receive training/workshops?',
        'if yes, who provides the training/workshops?',
        'if yes, does the training include the following? (tick all that applies)',
        'if yes, how often is the training?',
        'when was the last training conducted?'
    ]
};


function getDetails(a, atype) {
    let id;
    var meanData,
        meanProvinces;
    if (localStorage.getItem('mean') === null) {
        console.log('recording');
        getAverage();
    }
    meanData = JSON.parse(localStorage.getItem('mean'));
    meanProvinces = JSON.parse(localStorage.getItem('mean-province'));
    if (atype === 'id') {
        id = a;
    } else {
        id = $(a).attr('data');
    }
    $.get('/api/details/' + id).done(function(data) {

        let provinceStats = _.reject(meanProvinces, function(o) {
            return o.province !== data['unnamed: 153'];
        });
        let schoolInProvince = provinceStats[0]['total_school'];
        let toiletProvinceMean = provinceStats[0]['toilet_total'] / schoolInProvince;
        let teacherProvinceMean = provinceStats[0]['teacher_total'] / schoolInProvince;
        let studentsProvinceMean = provinceStats[0]['students_total'] / schoolInProvince;
        let fundsProvinceMean = provinceStats[0]['government_funds'] / schoolInProvince;

        $('#school_name').text(data['name of school?']);
        // $('#school_desc').children().remove();
        $('#profile-tab').children().remove();
        $('#school_feature').children().remove();
        $('#hygiene-tab').children().remove();
        $('#management-tab').children().remove();
        $('#sanitation-tab').children().remove();
        $('#water_supply-tab').children().remove();
        $('.carousel-item').remove();
        Object.keys(data).forEach(function(key) {
            var features = nainclude.includes(key);
            if (!features) {
                if (data[key]) {
                    let body;
                    var str = data[key];
                    if (!isNaN(str)) {
                        if (str > 1) {
                            body = "<div class='alert alert-success'>" + str + "</div>";
                        }
                    } else if (str.startsWith("Yes")) {
                        body = "<div class='alert alert-success'>" + key + "</div>";
                        if (paramGroups['hygiene'].includes(key)) {
                            $('#hygiene-tab').append(body);
                        }
                        if (paramGroups['school-management'].includes(key)) {
                            $('#management-tab').append(body);
                        }
                        if (paramGroups['sanitation'].includes(key)) {
                            $('#sanitation-tab').append(body);
                        }
                        if (paramGroups['water-supply'].includes(key)) {
                            $('#water_supply-tab').append(body);
                        }
                    } else if (str.startsWith("No")) {
                        body = "<div class='alert alert-danger'>" + key + "</div>";
                        if (paramGroups['hygiene'].includes(key)) {
                            $('#hygiene-tab').append(body);
                        }
                        if (paramGroups['school-management'].includes(key)) {
                            $('#management-tab').append(body);
                        }
                        if (paramGroups['sanitation'].includes(key)) {
                            $('#sanitation-tab').append(body);
                        }
                        if (paramGroups['water-supply'].includes(key)) {
                            $('#water_supply-tab').append(body);
                        }
                    } else if (str.startsWith("https://")) {
                        let question = key.replace("if yes, ", "");
                        body =
                            "<div class='carousel-item'><img src='" + data[key] + "' class='d-block w-100'>" +
                            "<div class='carousel-caption d-none d-md-block'><p>" + question + "</p></div></div>";
                        $('.carousel-inner').append(body)
                    } else {
                        var qs = key.replace('if yes, ','');
                        if (str.includes("|")) {
                            let ans = str.split("|");
                            let opts = "</hr>";
                            ans.forEach(function(x){
                                opts = opts + '</br>--&nbsp;&nbsp;' + x;
                            });
                            body = "<div class='string-answer'>" + qs + opts + "</div>";
                        }else{
                            body = "<div class='string-answer'>" + qs +'</hr>--&nbsp;&nbsp;'+ str + "</div>";
                        }
                        if (paramGroups['hygiene'].includes(key)) {
                            $('#hygiene-tab').prepend(body);
                        }
                        if (paramGroups['school-management'].includes(key)) {
                            $('#management-tab').prepend(body);
                        }
                        if (paramGroups['sanitation'].includes(key)) {
                            $('#sanitation-tab').prepend(body);
                        }
                        if (paramGroups['water-supply'].includes(key)) {
                            $('#water_supply-tab').prepend(body);
                        }
                    }
                    $('.carousel-item').first().addClass('active');
                };
            }
        });
        $('#hygiene-tab').prepend('<hr><h5>Indicators</h5>');
        $('#management-tab').prepend('<hr><h5>Indicators</h5>');
        $('#sanitation-tab').prepend('<hr><h5>Indicators</h5>');
        $('#water_supply-tab').prepend('<hr><h5>Indicators</h5>');

        $('#profile-tab').append("<div> <b>Province</b> : " + data['unnamed: 153'] + "</div><hr>");
        if (data['type of school?'] === null) {
            $('#profile-tab').append("<div> <b>Type of School</b> : " + data['type of school? other'] + "</div>");
        } else {
            $('#profile-tab').append("<div> <b>Type of School</b> : " + data['type of school?'] + "</div>");
        }
        $('#profile-tab').append("<div> <b>Head Teacher</b> : " + data['what is the name of the head teacher of this school?'] + "</div><hr>");

        var ldata = JSON.parse(localStorage.getItem('data'));
        var lfeature = _.find(ldata.features, function(item) {
            return item['properties']['school_id'] === data.identifier;
        });
        ldata = lfeature.properties;
        var nameOfSchool = data['name of school?'].split(' ')[0];

        var students_value = [ldata.students_boy, ldata.students_girl, ldata.students_total];
        var app = {};
        $('#profile-tab').append("<div class='charts-container'><div id='students-chart' class='chart-detail'></div></div>");
        var studentChart = echarts.init(document.getElementById('students-chart'));
        studentChart.setOption(setOptionChart('Students Attendance', ['Boys', 'Girls', 'All'], students_value), true);

        var students_mean = [ldata.students_total, studentsProvinceMean, meanData.students_total];
        $('#profile-tab').append("<div class='charts-container'><div id='students-mean-chart' class='chart-detail'></div></div>");
        var studentsMeanChart = echarts.init(document.getElementById('students-mean-chart'));
        studentsMeanChart.setOption(setOptionChart('Students Mean Comparisons', [nameOfSchool, 'Province', 'National'], students_mean), true);

        var teacher_value = [ldata.teacher_male, ldata.teacher_female, ldata.teacher_total];
        $('#profile-tab').append("<div class='charts-container'><div id='teachers-chart' class='chart-detail'></div></div>");
        var teacherChart = echarts.init(document.getElementById('teachers-chart'));
        teacherChart.setOption(setOptionChart('Teachers', ['Male', 'Female', 'All'], teacher_value), true);

        var teacher_mean = [ldata.teacher_total, teacherProvinceMean, meanData.teacher_total];
        $('#profile-tab').append("<div class='charts-container'><div id='teachers-mean-chart' class='chart-detail'></div></div>");
        var teacherMeanChart = echarts.init(document.getElementById('teachers-mean-chart'));
        teacherMeanChart.setOption(setOptionChart('Teachers Mean Comparisons', [nameOfSchool, 'Province', 'National'], teacher_mean), true);

        $('#profile-tab').append('<hr><h5>School Strength</h5>');
        $('#profile-tab').append("<div> <b>Teacher Ratio</b> : " + ldata.teacher_ratio + "</div>");

        if (ldata.government_funds !== 0) {
            var funds_avg = [ldata.government_funds, fundsProvinceMean, meanData.government_funds];
            $('#management-tab').prepend("<div class='charts-container'><div id='government-mean-chart' class='chart-detail-long'></div></div>");
            var fundsMean = echarts.init(document.getElementById('government-mean-chart'));
            fundsMean.setOption(setOptionChart('Government Funds', [nameOfSchool, 'Province', 'National'], funds_avg), true);
        }

        if (ldata.toilet_total !== 0) {
            var toilet_value_avg = [ldata.toilet_total, toiletProvinceMean, meanData.toilet_total];
            $('#sanitation-tab').prepend("<div class='charts-container'><div id='toilet-mean-chart' class='chart-detail'></div></div>");
            var toiletMean = echarts.init(document.getElementById('toilet-mean-chart'));
            toiletMean.setOption(setOptionChart('Toilets Comparison', [nameOfSchool, 'Province', 'National'], toilet_value_avg), true);

            var toilet_value = [ldata.toilet_boy, ldata.toilet_girl, ldata.toilet_total];
            $('#sanitation-tab').prepend("<div class='charts-container'><div id='toilet-chart' class='chart-detail'></div></div>");
            var toiletChart = echarts.init(document.getElementById('toilet-chart'));
            toiletChart.setOption(setOptionChart('Toilets', ['Boys', 'Girls', 'Total'], toilet_value), true);
        }
        $('#profile-menu').click();
        $('#detail_modal').modal('show');
    });
}

function setOptionChart(title, categories, data) {
    return {
        title: {
            text: title
        },
        tooltip: {
            axisPointer : {
                type: 'shadow'
            },
        },
        xAxis: {
            type: 'category',
            data: categories
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: data,
            type: 'bar',
            smooth: true,
            itemStyle: {
                color: '#dc3545'
            }
        }]
    };
}

function focusTo() {
    event.preventDefault()
    let latlng = $('#zoom_find').val();
    let id = $('#find').attr('data-search');
    latlng = latlng.split(',');
    latlng = [parseFloat(latlng[0]), parseFloat(latlng[1])];
    maps.setView(new L.LatLng(latlng[0], latlng[1]), 18);
    getDetails(id, 'id');
}

function focusNormal() {
    maps.setView(new L.LatLng(-8.3626894, 160.3288342), 7);
}

function jqUI() {
    $("#find").autocomplete({
            minLength: 4,
            source: function(request, response) {
                $.getJSON('/api/search/' + request.term, {}, response);
            },
            focus: function(event, ui) {
                $("#find").val(ui.item.school);
                $("#find").attr('data-search', ui.item.identifier);
                $("#zoom_find").val([ui.item.latitude, ui.item.longitude]);
                return false;
            },
            select: function(event, ui) {
                $("#find").val(ui.item.school);
                return false;
            }
        })
        .autocomplete("instance")._renderItem = function(ul, item) {
            return $("<li>")
                .append("<div>" + item.school + "<span class='badge badge-small badge-primary'>" + item.identifier + "</span></div>")
                .appendTo(ul);
        };
}

function toggleLegend(it, state) {
    let rem_class = $(it).attr('class');
    $('.marker.' + rem_class).hide();
}

function restartCluster(el, key) {
    var filter = $(el).attr('class').split(' ')[0];
    $('.marker .' + filter).remove();
}

function getAverage() {
    var mdata = JSON.parse(localStorage.getItem('data'));
    let items = {
        'students_boy': 0,
        'students_girl': 0,
        'students_total': 0,
        'teacher_female': 0,
        'teacher_male': 0,
        'teacher_ratio': 0,
        'teacher_total': 0,
        'toilet_boy': 0,
        'toilet_girl': 0,
        'toilet_total': 0,
        'toilet_boy_ratio': 0,
        'toilet_girl_ratio': 0,
        'toilet_ratio': 0,
        'government_funds': 0,
    };
    let mean = items;
    let rawData = [];
    mdata.features.forEach(function(item) {
        rawData.push(item.properties);
        Object.keys(item.properties).forEach(function(key) {
            if (Number.isInteger(item.properties[key])) {
                items[key] += item.properties[key];
            }
        });
    });
    let lenData = mdata.features.length;
    Object.keys(items).forEach(function(key) {
        mean[key] = items[key] / lenData;
    });
    localStorage.setItem('mean', JSON.stringify(mean));
    var meanProvinces = _(rawData).groupBy('province')
        .map(function(items, province) {
            return {
                province: province,
                students_boy: _.sum(_.map(items, 'students_boy')),
                students_girl: _.sum(_.map(items, 'students_girl')),
                students_total: _.sum(_.map(items, 'students_total')),
                teacher_female: _.sum(_.map(items, 'teacher_female')),
                teacher_male: _.sum(_.map(items, 'teacher_male')),
                teacher_total: _.sum(_.map(items, 'teacher_total')),
                teacher_ratio: _.sum(_.map(items, 'teacher_ratio')),
                toilet_boy: _.sum(_.map(items, 'toilet_boy')),
                toilet_girl: _.sum(_.map(items, 'toilet_girl')),
                toilet_total: _.sum(_.map(items, 'toilet_total')),
                toilet_ratio: _.sum(_.map(items, 'toilet_ratio')),
                government_funds: _.sum(_.map(items, 'government_funds')),
                total_school: items.length
            };
        }).value();
    localStorage.setItem('mean-province', JSON.stringify(meanProvinces));
    return meanProvinces;
}
