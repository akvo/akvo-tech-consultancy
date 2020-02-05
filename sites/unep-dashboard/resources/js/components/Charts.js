import React, { Component } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import ReactEcharts from 'echarts-for-react';

class Charts extends Component {

    constructor(props) {
        super(props);
        this.getOption = this.getOption.bind(this);
    }

    getOption() {
        let option = {
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

    render() {
        return (
            <ReactEcharts
              option={this.getOption()}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"}
              />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
