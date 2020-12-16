import { Easing, Color, TextStyle, backgroundColor, Icons } from '../features/animation.js';

const StackBar = (title, subtitle, list) => {
    let option = {
        ...Color,
        title : {
            text: title,
            subtext: subtitle,
            left: '20px',
            top: '20px',
            ...TextStyle
        },
        grid: {
            top: "100px",
            left: "30%",
            show: true
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}: {c}",
            backgroundColor: "#ffffff",
            ...TextStyle
        },
        legend: {
            // data: [...Beneficiaries_legends],
            data: list.legends,
        },
        yAxis: {
            type: 'category',
            // data: [...locations],
            data: list.categories,
            axisLabel: {
                interval: 0,
            },
        },
        xAxis: {
            type: 'value'
        },
        // series: [
        //     {
        //         name: 'Femmes',
        //         type: 'bar',
        //         stack: 'Beneficiaries',
        //         label: {
        //             show: true,
        //             position: 'insideRight'
        //         },
        //         data: [...Femmes_values]
        //     },
        //     {
        //         name: 'Garçons',
        //         type: 'bar',
        //         stack: 'Beneficiaries',
        //         label: {
        //             show: true,
        //             position: 'insideRight'
        //         },
        //         data: [...Garçons_values]
        //     },
        // ],
        series: list.series,
        backgroundColor: "#ffffff",
        ...Easing,
    };
    return option;
}

export default StackBar;
