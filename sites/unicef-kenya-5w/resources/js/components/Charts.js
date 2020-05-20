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
        // console.log(param);
    }

    componentDidMount() {
        this.setState({
            origin: this.props.value.charts.active
        });
    }

    render() {
        let valtype = this.props.value.page;
        let selected = this.props.value.filters.selected.filter;
        selected = this.props.value.filters.list.find(x => x.id === selected);
        let onEvents = {
            'click': this.clickEvent,
            'dblclick': this.doubleClickEvent
        }
        let location = this.props.value.filters.locations;
        let location_values = this.props.value.filters.location_values;
        let selected_location = this.props.value.filters.selected.location;
        location = location.find(x => x.id === selected_location);
        location = location.code === "KENYA"
            ? location
            : location_values.find(x => x.id === location.id);
        let options = generateOptions(this.props.kind, selected, location.name, valtype.name, location_values);
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
