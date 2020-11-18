import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Card, ListGroup, Container, Jumbotron } from "react-bootstrap";
require("../data/uganda.js");
import Charts from "../components/Charts";
import {
    generateData,
} from "../data/chart-utils.js";
import { checkCache, titleCase, getTableUtils } from "../data/utils.js";
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import maxBy from 'lodash/maxBy';
import flattenDeep from 'lodash/flattenDeep';
import Bar from '../data/options/Bar';
import Maps from '../data/options/Maps';
import TreeMap from '../data/options/TreeMap';
import DataFilters from '../components/DataFilters';
import DataLocations from '../components/DataLocations';
import Tables from '../components/Tables'
import { TextStyle } from '../data/features/animation.js';

const MapsOverride = (TableView) => {
    return {
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            padding:10,
            transitionDuration: 0.2,
            formatter: TableView,
            backgroundColor: "#fff",
            position: [100,30],
            ...TextStyle,
        }
    }
}

class PageActivities extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.getRowTable = this.getRowTable.bind(this);
        this.getOverview = this.getOverview.bind(this);
        this.TableView = this.TableView.bind(this);
        this.state = {
            charts: [
                {
                    title: "",
                    kind: "MAPS",
                    data: generateData(12, true, "700px"),
                    overviews: true,
                },
                {
                    title: "Water",
                    kind: "BAR",
                    data: generateData(12, true, "500px"),
                    group: "domain",
                    sub_group: "sub_domain",
                    value: "new",
                    get: "Water",
                    overviews: false,
                },
                {
                    title: "Sanitation",
                    kind: "BAR",
                    data: generateData(12, true, "500px"),
                    group: "sub_domain",
                    group: "domain",
                    sub_group: "sub_domain",
                    value: "new",
                    get: "Sanitation",
                    overviews: false,
                },
                {
                    title: "IPC / Hygiene",
                    kind: "BAR",
                    data: generateData(12, true, "500px"),
                    group: "domain",
                    sub_group: "sub_domain",
                    value: "new",
                    get:"Hygiene / Ipc",
                    overviews: false,
                },
            ]
        }
        this.getMaps = this.getMaps.bind(this);
        this.getBars = this.getBars.bind(this);
    }

    createTable(orgs, name) {
        let html = '<table class="table table-bordered">';
        html += '<thead class="thead-dark">';
        html += '<tr>';
        html += '<th width="200">' + name + '</th>';
        html += '<th width="50" class="text-right">TBA</th>';
        html +='</tr>';
        html += '</thead>';
        html += '<tbody>';
        let lists = [];
        let i = 1;
        for (const org in orgs) {
            html += '<tr><td width="200">' + i + '. ' + org + '</td>';
            html += '<td width="50" class="text-right">' + sumBy(orgs[org], 'new') + '</td></tr>';
            i++;
        }

        html += '</tbody>';
        html += '</table>';
        return html;
    }

    TableView(params) {
        if (params.value && params.seriesType === "map") {
            let details = params.data.details;
            let orgs_count = uniqBy(details,'sub_domain').length;
            let html = 'District: <strong>' + params.name + '</strong></br>';
            html += 'Total Beneficeries Assisted (<strong>TBA</strong>): ';
            html += '<strong>' + sumBy(details, 'new') + '</strong><br/><br/>';
            let orgs = groupBy(details, 'activity');
            html += this.createTable(orgs, 'Activity Locations');
            html += '<hr>';
            orgs = groupBy(details, 'domain');
            html += this.createTable(orgs, 'Activity Category');
            return '<div class="tooltip-maps">' + html + '</div>';
        }
        if (params.value && params.seriesType === "scatter") {
            return getCovidTable(params);
        }
        return "";
    }

    getMaps() {
        let collections = [];
        let data = this.getRowTable(false);
        let max = maxBy(data,'new')
        let districts = groupBy(data,'district');
        for (const district in districts) {
            let collection = {
                name: district,
                value: sumBy(districts[district],'new'),
                details: districts[district]
            }
            collections = [...collections, collection];
        }
        let mapConfig = {
            min:0,
            max:max.new,
            data:collections,
            override:MapsOverride(this.TableView)
        };
        return mapConfig;
    }

    getRowTable(all) {
        let data;
        let base = this.props.value.base;
        let config = base.config;
        if (all) {
            data = this.props.value.base.data;
        } else {
            let page = this.props.value.page.name;
            data = this.props.value.filters[page].data;
        }
        data = data.map((x, i) => {
            let results = {no: (i+1), ...x};
            for (const v in x) {
                let column = config.find(n => n.name === v);
                if (column !== undefined && column.on) {
                    let value = base[column.on].find(a => a.id === x[v]);
                    results = {
                        ...results,
                        [v]: value.text
                    }
                }
            }
            return results;
        });
        return data;
    }

    getBars(list) {
        let data = this.getRowTable();
        let labels = [];
        let values = [];
        data = data.filter(x => x[list.group] === list.get);
        data = groupBy(data, list.sub_group);
        for (const d in data) {
            let total = sumBy(data[d], list.value);
            if (total !== 0) {
                labels = [...labels, d];
                values = [...values, sumBy(data[d], list.value)]
            }
        }
        return {labels:labels, values:values};
    }

    getOptions(list) {
        let page = this.props.value.page.name;
        switch (list.kind){
            case "MAPS":
                let title = "WASH Partners Presence for COVID-19 Response";
                return Maps(title, "Total Beneficiaries", this.getMaps());
            default:
                return Bar(list.title, list.get, this.getBars(list));
        }
    }

    getCharts(list, index) {
        return (
            <Charts
                key={index}
                kind={list.kind}
                data={list.data}
                page={this.props.value.page.name}
                options={this.getOptions(list)}
                table={list.overviews ? this.getOverview() : ""}
            />
        )
    }

    getOverview() {
        const data = this.getRowTable(false);
        const activities = groupBy(data, 'activity')
        let overviews = [];
        for (const act in activities){
            overviews = [
                ...overviews,
                {name: act, value: activities[act].length}
            ]
        }
        return (
            <div className="table-floating tooltip-maps">
            <Card>
                <Card.Header style={{textAlign:'center'}}>Organisations</Card.Header>
                <ListGroup variant="flush" style={{textAlign:'center'}}>
                    <ListGroup.Item><h2>{uniqBy(data, 'org_name').length}</h2></ListGroup.Item>
                </ListGroup>
            </Card>
            <Card style={{marginTop:'10px'}}>
                <Card.Header style={{textAlign:'center'}}>Beneficeries Assisted</Card.Header>
                <ListGroup variant="flush" style={{textAlign:'center'}}>
                    <ListGroup.Item><h2>{sumBy(data,'new')}</h2></ListGroup.Item>
                </ListGroup>
            </Card>
            <hr/>
            <table className="table table-bordered">
                <thead className="thead-dark">
                    <tr>
                    <th colSpan="2">Number of</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        overviews.map((x, i) => (
                            <tr key={i}>
                                <th>{x.name}</th>
                                <th width="50" className="text-right">{x.value}</th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            </div>
        );
    }

    componentDidMount() {
        this.props.chart.state.loading(false);
    }

    render() {
        let chart = this.state.charts.map((list, index) => {
            return this.getCharts(list, index)
        });
        return (
            <Fragment>
            <Container className="top-container">
                <DataFilters className='dropdown-left'/>
                <div className="right-listgroup">
                </div>
            </Container>
            <Container className="container-content container-sticky">
                <Row>
                {chart}
                </Row>
                <Tables/>
            </Container>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageActivities);
