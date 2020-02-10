export const pieExample = () => {
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
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 10,
        top: 70,
        data: ['West Bank and Gaza', 'Vietnam', 'Yamen', 'Zambia', 'Zimbabwe']
    },
    series: [
        {
            name: 'Data',
            type: 'pie',
            top: 120,
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '22',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [
                {'code':'PS' , 'name':'West Bank and Gaza', 'value':4152369, 'color':'#eea638'},
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
