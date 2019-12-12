export function getOptions (chart, id) {
    if (chart === 'bar') {
        return {
            tooltip: {},
            legend: { data: ['Sales'] },
            xAxis: { data: ["shirt","cardign","chiffon shirt","pants","heels","socks"] },
            yAxis: {},
            series: [{
                name: 'Sales',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
    }
    
    if (chart === 'pie') {
        return {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['Hokya','Hehe','Haha']
            },
            series: [
                {
                    name: 'Metal',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:50, name:'Hokya'},
                        {value:30, name:'Hehe'},
                        {value:20, name:'Haha'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }
    
    if (chart === 'map') {
        return {
            maxZoom: 18,
            lat: -7.837432,
            lng: 110.371239
        };
    }

    return false;
}

