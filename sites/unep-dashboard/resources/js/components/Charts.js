import React, { Component } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import ReactEcharts from 'echarts-for-react';

class Charts extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let option = this.props.option;
        let style = this.props.data.style;
        return (
            <ReactEcharts
              option={option}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"}
              style={style}
              />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
