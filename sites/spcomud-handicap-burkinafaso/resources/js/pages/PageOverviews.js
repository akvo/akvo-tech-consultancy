import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Card, ListGroup, Container, Jumbotron } from "react-bootstrap";
require("../data/uganda.js");
import Charts from "../components/Charts";
import {
    generateData,
} from "../data/chart-utils.js";
import { checkCache, titleCase, getCovidTable } from "../data/utils.js";
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import flattenDeep from 'lodash/flattenDeep';
import Bar from '../data/options/Bar';
import Maps from '../data/options/Maps';
import Pie from '../data/options/Pie';
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
            position: [10,150],
            ...TextStyle,
        },
        dataRange: {
            left: 15,
            top: 10,
            splitList: [
                {start: 10, label:'Above 10'},
                {start: 8, end: 10},
                {start: 6, end: 8},
                {start: 3, end: 6},
                {start: 1, end: 3},
                {end: 0, label:'No Organisations', icon:'circle'}
            ],
            color: ['#085fa6', '#567ba9', '#40a4dc','#bde2f2','#b6c4da'],
        }
    }
}

class PageOverviews extends Component {
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
                    kind: "MAPS",
                    data: generateData(12, true, "700px")
                }
            ]
        }
        this.getMaps = this.getMaps.bind(this);
    }


    TableView(params) {
        if (params.value && params.seriesType === "map") {
            let details = params.data.details;
            let orgs_count = uniqBy(details,'org_name').length;
            let orgs = groupBy(details, 'org_name');
            let html = '<hr/>District: <strong>' + params.name + '</strong></br>';
            html += 'Number of Organisations: <strong>' + params.value + '</strong><br/><br/>';
            html += 'Total Beneficeries Assisted (<strong>TBA</strong>): ';
            html += '<strong>' + sumBy(details, 'new') + '</strong><br/><br/>';
            html += '<table class="table table-bordered">';
            html += '<thead class="thead-dark">';
            html += '<tr>';
            html += '<th width="200">Organisations</th>';
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
            return '<div class="tooltip-maps">' + html + '</div>';
        }
        if (params.value && params.seriesType === "scatter") {
            return getCovidTable(params);
        }
        return "";
    }

    getMaps() {
        let collections = [];
        let data = this.getRowTable();
        let districts = groupBy(data,'district');
        for (const district in districts) {
            let collection = {
                name: district,
                value: districts[district].length,
                details: districts[district]
            }
            collections = [...collections, collection];
        }
        let mapConfig = {
            data:collections,
            override: MapsOverride(this.TableView)
        };
        return mapConfig;
    }

    getRowTable() {
        let base = this.props.value.base;
        let config = base.config;
        let page = this.props.value.page.name;
        let data = this.props.value.filters[page].data;
        data = data.map((x, i) => {
            let results = {no: (i+1), ...x};
            for (const v in x) {
                let column = config.find(n => n.name === v);
                if (column !== undefined && column.on) {
                    let value = base[column.on].find(a => a.id === x[v]);
                    if (typeof(value) !== 'undefined') {
                        results = {
                            ...results,
                            [v]: value.text
                        }
                    }
                }
            }
            return results;
        });
        return data;
    }

    getOptions(list) {
        let title = "WASH Partners Presence for COVID-19 Response";
        return Maps(title, "Total Organisations", this.getMaps());
    }

    getCharts(list, index) {
        return (
            <Charts
                key={index}
                kind={list.kind}
                data={list.data}
                page={this.props.value.page.name}
                options={this.getOptions(list)}
                table={this.getOverview()}
            />
        )
    }

    getOverview() {
        const data = this.getRowTable();
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
        console.log(this.props);
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
                {/* <Tables/> */}
            </Container>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageOverviews);
