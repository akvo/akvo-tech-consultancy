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
        console.log('double-click');
    }

    clickEvent(param) {
        if (this.props.calc === "CATEGORY") {
            if (param.componentSubType === 'pie') {
                this.props.chart.value.select(param.data.id);
                this.props.filter.program.update(param.data.id, param.data.parent_id, param.name, 2);
                console.log(this.props.value.filters);
                if (this.props.value.filters.selected.length < 3){
                    this.props.filter.program.append(param.data.values, 2);
                };
                console.log(this.props.value.filters);
            }
            if (param.componentSubType === 'bar') {
                console.log(param);
            }
            return;
        }
        if (!this.props.value.charts.filtered) {
            this.props.filter.country.change(param.data.name);
        }
        if (this.props.value.charts.filtered) {
            this.props.chart.value.reverse();
            this.props.filter.country.change("World Wide");
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
        if (level === 1) {
            data = data.map((x) => {
                let values = x.values;
                if (this.props.value.filters.country !== "World Wide") {
                    values = values.filter(c => {
                        if (c.name === this.props.value.filters.country){
                            return true;
                        }
                        return false;
                    });
                }
                if (values.length > 0){
                    values = values.map(v => v.value).reduce((a, b) => a + b);
                } else {
                    values = 0
                }
                x.value = values;
                return x;
            });
        }
        let options = generateOptions(this.props.kind, selected.name, this.props.value.filters.country, data, this.props.calc);
        return (
            <Col md={this.props.data.column}>
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
