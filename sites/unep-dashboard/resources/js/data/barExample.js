export const barExample = () => {
    let option = {
        title : {
            text: 'Production and Management',
            left: 'center',
            top: 'top',
            textStyle: {
                color: '#222'
            }
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 420],
            type: 'bar'
        }]
    };
    return option;
}
