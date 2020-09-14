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
    formatCurrency
} from "../data/utils.js";
import { Color, TextStyle } from '../data/features/animation.js';
import sumBy from 'lodash/sumBy';
require("../data/features/unep-map.js");

const MapsOverride = (toolTip, props) => {
    let pos = props.value.page.sidebar.active ? "320px" : 10;
    let lang = props.value.locale.lang;
    let config = {
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            padding:10,
            transitionDuration: 0.2,
            formatter: toolTip,
            backgroundColor: "transparent",
            position: [pos,400],
            ...TextStyle
        },
        markArea: {
            label: {
                show:true,
                distance:5,
                color: "#222",
                fontFamily: "Assistant"
            }
        },
        dataRange: {
            right: 10,
            top: 40,
            splitList: [
                {start: 100000000, label:lang.moreThan + ' 100 ' + lang.million},
                {start: 1000000, end: 100000000, label: '1 - 100 ' + lang.million},
                {start: 100000, end: 10000000, label: '100 ' + lang.thousand + ' - 1 ' + lang.million},
                {start: 1, end: 100000, label: lang.lessThan + ' 100 ' + lang.thousand},
                {end: 0, label:lang.noFunding}
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

class Funding extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.toolTip = this.toolTip.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.state = {
            charts: [{
                    kind: "MAPS",
                    title: "funding",
                    subtitle: "in USD",
                    config: generateData(12, true, "80vh"),
                    data: false, // if data is false then load global
                    extra: true,
                }, {
                    kind: "RADAR",
                    title: "impact",
                    subtitle: "",
                    config: generateData(6, true, "60vh"),
                    data: {id: 157, childs:false},
                    extra: {}
                }, {
                    kind: "ROSEPIE",
                    title: "duration",
                    subtitle: "",
                    config: generateData(6, true, "60vh"),
                    data: {id: 222, childs:false},
                    extra: {}
                }, {
                    kind: "BAR",
                    title: "sourceFunding",
                    subtitle: "",
                    config: generateData(12, true, "60vh"),
                    data: {id: 213, childs:false},
                    extra: {
                        tooltip: {show: false},
                        ...Color,
                    }
                }],
            }
    }

    toolTip(params) {
        let lang = this.props.value.locale.lang;
        if (params.value) {
            let filters = this.props.value.data.filters;
            let data = params.data.data.funds;
            data = data.map(x => {
                return {
                    ...x,
                    t: x.f + x.c
                }
            });
            let values = [
                {name: lang.funds, value: sumBy(data, 'f')},
                {name: lang.contribution, value: sumBy(data, 'c')},
                {name: lang.total, value: sumBy(data, 't')}
            ]
            let html = '<h3 class="table-title">'+ params.name +'</h3><br/>';
            html += '<table class="table table-bordered table-small">';
            html += '<thead class="thead-dark"><tr class="sm bg-dark text-white">';
            html += '<td width="100">' + lang.country + '</td><td width="50" align="center">' + lang.value + ' ' + lang.inUSD + '</td>'
            html += '</tr></thead">';
            html += '<tbody>';
            values.forEach(x => {
                html += '<tr class="sm">';
                html += '<td width="50">'+ x.name +'</td>';
                html += '<td width="50" align="right">' + formatCurrency(x.value) +'</td>';
                html += '</tr>';
            });
            html += '</tbody">';
            html += '</table>';
            return html;
        };
        return '<h3 class="table-title">'+ params.name +'</h3><br/><p>No Data</p>';
    }

    renderOptions(filterId, childs=true) {
        let active = this.props.value.data.filteredpoints;
        let locale = this.props.value.locale.active;
        let thefilter = flatten(this.props.value.page.filters);
            thefilter = thefilter.filter(x => x.id === filterId);
        let datapoints = this.props.value.data.master.map(x => x.values);
            thefilter = getChildsData(thefilter, datapoints, active, locale);
        let dpvalue = this.props.value.data.datapoints;
        if (thefilter.length > 0) {
            thefilter = thefilter[0].children;
        }
        if (thefilter.length > 0 && childs === false) {
            thefilter = thefilter.map(x => {
                let dpv = 0;
                let dps = dpvalue.filter(d => x.datapoints.includes(d.datapoint_id));
                if (dps.length > 0){
                    dps = dps.map(d => {
                        return {...d, t: d.f + d.c }
                    });
                    dpv = this.props.value.page.fundcontrib
                        ? sumBy(dps, 't')
                        : sumBy(dps, 'f');
                }
                return {
                    name: x.name,
                    value: dpv
                }
            });
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
            <Container>
                <Row>
                    {charts}
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Funding);
