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
            option: loadingChart,
            style: this.props.data.style,
            selected: this.props.selected,
        };
        this.clickEvent = this.clickEvent.bind(this);
        this.doubleClickEvent = this.doubleClickEvent.bind(this);
    }

    doubleClickEvent() {
        this.setState({ selected: this.props.selected });
        this.props.chart.value.select(this.state.selected.id);
    }

    clickEvent(param) {
        let data = [param.data];
        this.props.chart.value.filter(data);
    }

    render() {
        setTimeout(() => {
            this.setState({ option: this.props.option });
        }, 500);
        let onEvents = {
            'click': this.clickEvent,
            'dblclick': this.doubleClickEvent
        }
        return (
            <Col md={this.props.data.column}>
                <ReactEcharts
                    option={this.state.option}
                    notMerge={true}
                    lazyUpdate={true}
                    style={this.state.style}
                    opts={{ renderer: "svg" }}
                    onEvents={onEvents}
                />
                {this.props.data.line ? <hr /> : ""}
            </Col>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
