import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Col, Row, Container, Jumbotron } from "react-bootstrap";
import Charts from "../components/Charts";
import Tables from "../components/Tables";
import { generateData } from "../data/chart-utils.js";
import {
    flatten,
    getChildsData,
    pushToParent,
} from "../data/utils.js";
import { Color, TextStyle } from '../data/features/animation.js';

require("../data/unep-map.js");

const MapsOverride = (toolTip, props) => {
    let pos = props.value.page.sidebar.active ? "320px" : 10;
    let config = {
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            padding:10,
            transitionDuration: 0.2,
            formatter: toolTip,
            backgroundColor: "transparent",
            position: [pos,10],
            ...TextStyle
        },
        markArea: {
            label: {
                show:true,
                distance:5
            }
        },
        dataRange: {
            right: 'right',
            top: 20,
            right: 10,
            splitList: [
                {start: 25, label:'Above 25'},
                {start: 20, end: 25},
                {start: 15, end: 20},
                {start: 10, end: 15},
                {start: 1, end: 10},
                {end: 0, label:'0'}
            ],
            textStyle: {
                fontFamily: "Assistant",
                fontWeight: 600,
                fontSize: 12
            },
            color: [
                "#0f5298",
                "#2565ae",
                "#3c99dc",
                "#66d3fa",
                "#d5f3fe",
                "#ddd",
            ]
        },
    }
    return config;
}

class Overviews extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.toolTip = this.toolTip.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.state = {
            charts: [{
                    kind: "MAPS",
                    title: "Count of Actions",
                    subtitle: "",
                    config: generateData(12, true, "80vh"),
                    data: false, // if data is false then load global
                    extra: true,
                },
                {
                    kind: "TREEMAP",
                    title: "Type of Actions",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "80vh"),
                    data: false,
                    extra: {
                        title: {show: false},
                        tooltip: {show: false},
                        ...Color,
                    }
                }],
            }
    }

    toolTip(params) {
        if (params.value) {
            let filters = this.props.value.data.filters;
            let data = params.data.data;
            let values = [
                {value: "Country", count: data.total},
                {value: "Shared", count: (data.global)},
                {value: "Total", count: (data.global + data.total)}
            ]
            let html = '<h3 class="table-title">'+ params.name +'</h3>';
            html += '<table class="table table-bordered table-small">';
            html += '<thead class="thead-dark"><tr class="sm bg-dark text-white">';
            html += '<td width="100">Value</td><td width="50" align="center">Count</td>'
            html += '</tr></thead">';
            html += '<tbody>';
            values.forEach(x => {
                html += '<tr class="sm">';
                html += '<td width="50">'+ x.value +' Projects</td>';
                html += '<td width="50" align="center">' + x.count +'</td>';
                html += '</tr>';
            });
            html += '</tbody">';
            html += '</table>';
            return html;
        };
        return ""
    }

    renderOptions(filterId, childs=true) {
        let active = this.props.value.data.filteredpoints;
        let thefilter = flatten(this.props.value.page.filters);
            thefilter = thefilter.filter(x => x.id === filterId);
        let datapoints = this.props.value.data.master.map(x => x.values);
            thefilter = getChildsData(thefilter, datapoints, active);
        if (thefilter.length > 0) {
            thefilter = thefilter[0].children;
        }
        if (thefilter.length > 0 && childs === false) {
            thefilter = pushToParent(thefilter)
        }
        return thefilter;
    }

    getCharts(list, index) {
        let data = list.data;
        let extra = list.extra;
        if (data) {
            data = this.renderOptions(data.id, data.childs);
        }
        if (extra && list.kind === "MAPS") {
            extra = MapsOverride(this.toolTip, this.props);
        }
        if (list.kind !== "TABLE") {
            return (
                <Charts
                    key={index}
                    title={list.title}
                    subtitle={list.subtitle}
                    kind={list.kind}
                    config={list.config}
                    dataset={data}
                    extra={extra}
                    reports={false}
                />
            )
        }
        return (
            <Tables
                key={index}
                title={list.title}
                subtitle={list.subtitle}
                config={list.config}
                dataset={data}
            />
        )
    }

    render() {
        let charts = this.state.charts.map((list, index) => {
            return this.getCharts(list, index)
        });
        return (
            <Container id="print-container">
                <Row>
                    {charts}
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overviews);
