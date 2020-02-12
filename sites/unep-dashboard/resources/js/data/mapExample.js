export const mapExample = () => {
    let option = {
        title : {
            text: 'Production and Management',
            left: 'center',
            top: 'top',
            textStyle: {
                color: '#222'
            }
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params) {
                var value = (params.value + '').split('.');
                value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                return params.seriesName + '<br/>' + params.name + ': ' + value;
            }
        },
        visualMap: {
            left: 'right',
            min: 500000,
            max: 38000000,
            inRange: {
                color: ['#c23531', '#007bff']
            },
            text: ['High', 'Low'],
            calculable: true
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'left',
            top: 'top',
            feature: {
                dataView: {
                    title: 'View Data'
                },
                restore: {
                    title: 'Restore'
                },
                brush: {
                    title: 'Brush'
                },
                saveAsImage: {
                    title: 'Save Image'
                },
            }
        },
        series: [
            {
                name: 'Production and Management',
                type: 'map',
                roam: true,
                map: 'world',
                aspectScale: 1,
                emphasis: {
                    label: {
                        show: true
                    }
                },
                itemStyle: {
                    areaColor: '#ddd',
                    emphasis: {
                        areaColor: '#eee',
                        color: '#222',
                    }
                },
                data:[
                    {'code':'ID' , 'name':'Indonesia', 'value':4152369, 'color':'#eea638'},
                    {'code':'VN' , 'name':'Vietnam', 'value':88791996, 'color':'#eea638'},
                    {'code':'YE' , 'name':'Yemen, Rep.', 'value':24799880, 'color':'#eea638'},
                    {'code':'ZM' , 'name':'Zambia', 'value':13474959, 'color':'#de4c4f'},
                    {'code':'ZW' , 'name':'Zimbabwe', 'value':12754378, 'color':'#de4c4f'}
                ]
            }
        ]
    };
    return option;
}
