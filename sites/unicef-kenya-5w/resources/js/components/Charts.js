import React, { Component } from "react";
import { redux } from "react-redux";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import { Col } from "react-bootstrap";
import { loadingChart, generateOptions } from "../data/chart-utils.js";
import ReactEcharts from "echarts-for-react";

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
        return (
            <Col md={this.props.data.column}>
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
