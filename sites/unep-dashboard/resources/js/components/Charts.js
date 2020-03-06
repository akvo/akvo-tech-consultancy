import React, { Component } from "react";
import { redux } from "react-redux";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import { Col } from "react-bootstrap";
import { loadingChart, generateOptions } from "../data/chart-utils.js";
import ReactEcharts from "echarts-for-react";
import ReactLoading from "react-loading";

class Charts extends Component {
    constructor(props) {
        super(props);
        let selected = this.props.value.filters.selected;
            selected = selected[selected.length - 1];
        this.state = {
            option: loadingChart(),
            origin: loadingChart(),
            style: this.props.data.style,
            selected: selected
        };
        this.clickEvent = this.clickEvent.bind(this);
        this.doubleClickEvent = this.doubleClickEvent.bind(this);
    }

    doubleClickEvent() {
        this.setState({ selected: this.state.selected });
        this.props.chart.value.select(this.state.selected.id);
    }

    clickEvent(param) {
        if (this.props.value.charts.filtered) {
            this.props.chart.value.reverse();
        }
        if (!isNaN(param.value) && !this.props.value.charts.filtered) {
            let data = [];
            if (param.componentSubType === 'pie' || 'map') {
                data = [param.data];
            }
            if (param.componentSubType === 'bar') {
                data = [{
                    id: param.dataIndex,
                    code: "",
                    name: param.name,
                    value: param.value
                }]
            }
            this.props.chart.value.filter(data);
        };
        return this.props.chart.state.filtered();
    }

    componentDidMount() {
        this.setState({
            origin: this.props.value.charts.active
        });
    }

    render() {
        let level = this.props.calc === "CATEGORY" ? 1 : 2;
        let selected = this.props.value.filters.selected;
            selected = selected[level];
        if (selected === undefined) {
            selected = this.props.value.filters.selected;
        }
        let data = level === 1
            ? this.props.value.charts.data.filter((x) => x.parent_id === selected.id)
            : this.props.value.charts.active.values
        let onEvents = {
            'click': this.clickEvent,
            'dblclick': this.doubleClickEvent
        }
        let options = generateOptions(this.props.kind, selected.name, data, this.props.calc)
        return (
            <Col md={this.props.data.column}>
                { this.props.value.charts.loading ? (
                    <ReactLoading type={'spin'} color={'#009fe2'} height={'20px'} width={'20px'} className={"loading"}/>
                ) : "" }
                <ReactEcharts
                    option={options}
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
