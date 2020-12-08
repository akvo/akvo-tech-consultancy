import React, { Component, Fragment } from "react";
import { redux } from "react-redux";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import { Col } from "react-bootstrap";
import { loadingChart, generateOptions } from "../data/chart-utils.js";
// import ReactEcharts from "echarts-for-react";
import ReactLoading from 'react-loading';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/map';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/component/geo';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/title';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/visualMap';


class LoadingChart extends Component {
    render () {
        return (
            <Fragment>
            <ReactLoading className={'loading-charts'} type={'bubbles'} color={'#007bff'} height={50} width={50} />
            <div className="loading-charts-cover"></div>
            </Fragment>
        );
    }
}

class Charts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: loadingChart(),
            origin: loadingChart(),
            style: this.props.data.style,
        };
        this.clickEvent = this.clickEvent.bind(this);
        this.appendCovidData = this.appendCovidData.bind(this);
    }

    clickEvent(param) {
        console.log('Chart.js', param);
    }

    componentDidMount() {
        this.setState({
            origin: this.props.value.charts.active
        });
    }

    appendCovidData(options, data) {
        let scatter = {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: data,
            symbol: 'image://https://upload.wikimedia.org/wikipedia/commons/7/75/Disc_Plain_yellow_dark.svg',
            symbolSize: function(val){
                return Math.sqrt(val[2]) * 2;
            },
            label: {
                formatter: '{b}',
                position: 'right',
                show: false
            },
            itemStyle: {
                color: '#F06C00'
            },
            emphasis: {
                label: {
                    show: false
                }
            },
            zLevel:0,
        };
        options = {
            ...options,
            series: [...options.series, scatter]
        };
        return options;
    }

    render() {
        let onEvents = {
            'click': this.clickEvent,
        }
        let loading = this.props.value.charts.loading;
        let style = this.state.style;
        let options = this.props.options;
        let data = true;
        if(this.props.options.series[0].type === "bar"){
            let yheight = this.props.options.series[0].data.length;
            yheight = yheight !== 0 ? (25 * yheight) : 0;
            data = yheight === 0 ? false : true;
            options = {
                ...options,
                grid: {
                    ...options.grid,
                    height: yheight + "px",
                }
            }
            yheight = (200 + yheight) + "px";
            style = {height:yheight}
        };
        if (!data) {
            return "";
        }
        if(this.props.options.series[0].type === "map") {
            options = this.appendCovidData(options, this.props.value.charts.covid)
        };
        return (
            <Col md={this.props.data.column}>
                {loading ? <LoadingChart/> : "" }
                <ReactEchartsCore
                    echarts={echarts}
                    option={options}
                    notMerge={true}
                    lazyUpdate={true}
                    style={style}
                    onEvents={onEvents}
                />
                {/* {this.props.table ? this.props.table : ""} */}
                { this.props.data.line ? <hr/> : "" }
            </Col>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
