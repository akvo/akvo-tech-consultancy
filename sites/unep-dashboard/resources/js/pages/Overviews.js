import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Col, Row, Container } from "react-bootstrap";
import Charts from "../components/Charts";
import Tables from "../components/Tables";
import { generateData } from "../data/chart-utils.js";
import {
    flatten,
    getChildsData,
    pushToParent,
    translateValue,
} from "../data/utils.js";
import { Color, TextStyle } from '../data/features/animation.js';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import take from 'lodash/take';

require("../data/features/unep-map.js");

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
            position: [pos,50],
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
            top: 40,
            right: 10,
            splitList: [
                {start: 50, label: props.value.locale.lang.above + ' 50'},
                {start: 25, end: 50},
                {start: 10, end: 25},
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
        this.getTop = this.getTop.bind(this);
        this.renderRowTable = this.renderRowTable.bind(this);
        this.state = {
            charts: [{
                    kind: "TOP",
                    title: "topCountries",
                    subtitle: "",
                    config: generateData(3, true, "80vh"),
                    data: 15,
                    extra: true,
                }, {
                    kind: "MAPS",
                    title: "numberReportedActions",
                    subtitle: "",
                    config: generateData(9, false, "80vh"),
                    data: false, // if data is false then load global
                    extra: true,
                }, {
                    kind: "SEPARATOR",
                }, {
                    kind: "TREEMAP",
                    title: "typeActions",
                    config: generateData(12, false, "60vh"),
                    data: {id:5, childs:false},
                    extra: {
                        ...Color
                    }
                }, {
                    kind: "TREEMAP",
                    title: "geography",
                    config: generateData(6, true, "80vh"),
                    data: {id:116, childs:false},
                    extra: {
                        ...Color
                    }
                }, {
                    kind: "TREEMAP",
                    title: "sourceSea",
                    config: generateData(6, true, "80vh"),
                    data: {id:124, childs:false},
                    extra: {
                        ...Color
                    }
                }, {
                    kind: "PIE",
                    title: "pollutantTargeted",
                    config: generateData(5, false, "80vh"),
                    data: {id:167, childs:false},
                    extra: {
                        ...Color
                    }
                }, {
                    kind: "BAR",
                    title: "sector",
                    config: generateData(7, false, "80vh"),
                    data: {id:193, childs:false},
                    extra: {
                        ...Color
                    }
                }]
        }
    }

    toolTip(params) {
        let locale = this.props.value.locale.active;
        let lang = this.props.value.locale.lang;
        let countries = this.props.value.page.countries;
        if (params.value) {
            let filters = this.props.value.data.filters;
            let data = params.data.data;
            let values = [
                {value: lang.multiCountry, count: data.total},
                {value: lang.country, count: (data.global)},
                {value: lang.total, count: (data.total + data.global)}
            ]
            // lang
            let countryName = countries.find(x => x.name.toLowerCase() === params.name.toLowerCase());
            let text = translateValue(countryName, locale);
            // eol lang
            let html = '<h3 class="table-title">'+ text +'</h3><br/>';
            html += '<table class="table table-bordered table-small">';
            html += '<thead class="thead-dark"><tr class="sm bg-dark text-white">';
            html += '<td width="100">'+ lang.actions +'</td><td width="50" align="center">' + lang.numberReportedActions + '</td>'
            html += '</tr></thead">';
            html += '<tbody>';
            values.forEach(x => {
                html += '<tr class="sm">';
                html += '<td width="50">'+ x.value +'</td>';
                html += '<td width="50" align="center">' + x.count +'</td>';
                html += '</tr>';
            });
            html += '</tbody">';
            html += '</table>';
            return html;
        };
        return '<h3 class="table-title">' + params.name + '</h3><br/><p>' + lang.noData + '</p>';
    }

    renderOptions(filterId, childs=true) {
        let active = this.props.value.data.filteredpoints;
        let locale = this.props.value.locale.active;
        let thefilter = flatten(this.props.value.page.filters);
            thefilter = thefilter.filter(x => x.id === filterId);
        let datapoints = this.props.value.data.master.map(x => x.values);
            thefilter = getChildsData(thefilter, datapoints, active, locale);
        if (thefilter.length > 0) {
            thefilter = thefilter[0].children;
        }
        if (thefilter.length > 0 && childs === false) {
            thefilter = pushToParent(thefilter, locale)
        }
        return thefilter;
    }

    renderRowTable(data) {
        return data.map((x,i) => (
            <tr className="sm" key={i}>
                <td>{x.name}</td>
                <td align="center">{x.value}</td>
            </tr>
        ));
    }

    getTop(list, index, lang, locale) {
        let sorting = this.props.value.data.global ? 'global' : 'total';
        let source = this.props.value.data.filtered.length === 0 ? this.props.value.data.master : this.props.value.data.filtered;
        source = source.filter(x => {
            if (x.country_id === 195 || x.country_id === 194){
                return false;
            }
            return true;
        }); // Skip all and other
        let data = reverse(sortBy(source, sorting));
            data = take(data, list.data);
        data = data.map(x => {
            let country = this.props.value.page.countries.find(c=> c.id === x.country_id);
            if (country){
                let text = translateValue(country, locale);
                return {
                    name: text,
                    value: x[sorting]
                }
            }
            return {
                name: lang.loading,
                value: 0
            }
        })
        return (
            <Col md={list.config.column} key={index}>
                <h3 className="top-ten">{this.props.value.locale.lang[list.title]}</h3>
            <table className="table table-bordered table-small">
                <thead className="thead-dark">
                    <tr className="sm bg-dark text-white">
                        <td>{lang.country}</td>
                        <td align="center">{lang.actionsReported}</td>
                    </tr>
                </thead>
                <tbody>
                {this.renderRowTable(data)}
                </tbody>
            </table>
                <p className="top-ten">{lang.pleaseClickTheTable}</p>
            </Col>
        );
    }

    getCharts(list, index, lang) {
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
        let locale = this.props.value.locale.active;
        let lang = this.props.value.locale.lang;
        let charts = this.state.charts.map((list, index) => {
            if (list.kind === "SEPARATOR") {
                return (
                    <Col md={12} key={index}>
                        <hr/>
                    </Col>
                );
            }
            return list.kind === "TOP"
                ? this.getTop(list, index, lang, locale)
                : this.getCharts(list, index, lang);
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
