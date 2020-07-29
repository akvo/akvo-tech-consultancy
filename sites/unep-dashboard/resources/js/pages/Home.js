import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Col, Row, Container, Jumbotron } from "react-bootstrap";
import Charts from "../components/Charts";
import { generateData } from "../data/chart-utils.js";
import { TextStyle } from '../data/features/animation.js';
require("../data/world.js");

const MapsOverride = (toolTip) => {
    let config = {
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            padding:10,
            transitionDuration: 0.2,
            formatter: toolTip,
            backgroundColor: "#fff",
            position: [10,300],
            ...TextStyle,
        },
        markArea: {
            label: {
                show:true,
                distance:5
            }
        },
        dataRange: {
            left: 'left',
            top: 10,
            left: 10,
            splitList: [
                {start: 10, label:'Above 10'},
                {start: 8, end: 9},
                {start: 6, end: 7},
                {start: 3, end: 5},
                {start: 1, end: 2},
                {end: 0, label:'No Actions'}
            ],
            color: ['#085fa6', '#567ba9', '#40a4dc','#bde2f2','#b6c4da']
        }

    }
    return config;
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.toolTip = this.toolTip.bind(this);
        this.state = {
            charts: [
                {
                    kind: "MAPS",
                    title: "Count of Actions",
                    config: generateData(12, true, "80vh")
                },
            ]
        }
    }

    toolTip(params) {
        if (params.value) {
            let filters = this.props.value.data.filters;
            if (filters.length > 0) {
                console.log();
            }
            console.log(filters);
            let data = params.data.data;
            let values = [
                {value: "Country", count: data.total},
                {value: "Shared", count: (data.global + data.total)},
                {value: "Total", count: (data.global)}
            ]
            let html = '<strong> '+ params.name +' </strong>';
            html += '<br/><br/>';
            html += '<table class="table table-bordered table-small">';
            html += '<thead class="thead-dark"><tr class="bg-dark text-white sm">';
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

    getCharts(list, index) {
        const extra = MapsOverride(this.toolTip);
        return (
            <Charts
                key={index}
                title={list.title}
                kind={list.kind}
                config={list.config}
                extra={extra}
            />
        )
    }

    render() {
        let charts = this.state.charts.map((list, index) => {
            return this.getCharts(list, index)
        });
        return (
            <Container>
                <Row>
                    {charts}
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
