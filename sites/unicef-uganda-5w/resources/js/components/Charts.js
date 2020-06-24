import React, { Component, Fragment } from "react";
import { redux } from "react-redux";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import { Col } from "react-bootstrap";
import { loadingChart, generateOptions } from "../data/chart-utils.js";
import ReactEcharts from "echarts-for-react";
import ReactLoading from 'react-loading';

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
    }

    clickEvent(param) {
        console.log(param);
    }

    componentDidMount() {
        this.setState({
            origin: this.props.value.charts.active
        });
    }

    render() {
        let onEvents = {
            'click': this.clickEvent,
        }
        let loading = this.props.value.charts.loading;
        return (
            <Col md={this.props.data.column}>
                {loading ? <LoadingChart/> : "" }
                <ReactEcharts
                    option={this.props.options}
                    notMerge={true}
                    lazyUpdate={true}
                    style={this.state.style}
                    onEvents={onEvents}
                />
                {this.props.data.line ? <hr /> : ""}
            </Col>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
