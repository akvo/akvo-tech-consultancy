import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Card, ListGroup, Container, Jumbotron } from "react-bootstrap";
require("../data/uganda.js");
import Charts from "../components/Charts";
import {
    generateData,
} from "../data/chart-utils.js";
import { titleCase } from "../data/utils.js";
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import flattenDeep from 'lodash/flattenDeep';
import Bar from '../data/options/Bar';
import Maps from '../data/options/Maps';
import Pie from '../data/options/Pie';
import TreeMap from '../data/options/TreeMap';
import DataFilters from '../components/DataFilters';
import DataTypes from '../components/DataTypes';
import DataLocations from '../components/DataLocations';
import Tables from '../components/Tables'
import { TextStyle } from '../data/features/animation.js';


const MapsOverride = (TableView, noValue) => {
    let config = {
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 10,
            left: 10,
            data: []
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            padding:10,
            transitionDuration: 0.2,
            formatter: TableView,
            backgroundColor: "#fff",
            position: [10,150],
            ...TextStyle,
        }
    }
    return config;
}

class PageActivities extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.getOverview = this.getOverview.bind(this);
        this.TableView = this.TableView.bind(this);
        this.state = {
            charts: [
                {
                    kind: "MAPS",
                    page: "HOME",
                    data: generateData(12, true, "700px")
                },
            ]
        }
        this.getMaps = this.getMaps.bind(this);
    }


    TableView(params) {
        let valType = this.props.value.filters.selected.type;
        if (params.value) {
            let data = params.data;
            let orgs;
            let orgs_count = data.details.organisations.count;
            let total_value = sumBy(data.details.organisations.data, 'value_new');
            orgs = groupBy(data.details.organisations.data, 'name');
            let html = '<hr/>District: <strong>' + data.name + '</strong></br>';
            html += 'Number of Organisations: <strong>' + orgs_count + '</strong><br/><br/>';
            html += 'Total Beneficeries Assisted (<strong>TBA</strong>): <strong>' + total_value + '</strong><br/><br/>';
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
            for (let org in orgs) {
                html += '<tr><td width="200">' + i + '. ' + org + '</td>';
                html += '<td width="50" class="text-right">' + sumBy(orgs[org], 'value_new') + '</td></tr>';
                i++;
            }
            html += '</tbody>';
            html += '</table>';
            return '<div class="tooltip-maps">' + html + '</div>';
        }
        return "";
    }

    getMaps(data, valtype) {
        data = data.map((x) => {
            return {
                name: x.name,
                code: x.code,
                value: x.details.organisations.count,
                values: x.values,
                details: x.details
            }
        });
        data = groupBy(data, 'code')
        let collections = [];
        for (let g in data) {
            let d = data[g];
            let valname = this.props.value.filters.selected.domain ? d[0].values.name : "All Domains";
            collections = [
                ...collections, {
                    name: d[0].name,
                    code: g,
                    value: sumBy(d.map(s => {return{'val': s.values.value_new}}), 'val'),
                    values: {
                        name: valname,
                        value_new: sumBy(d.map(s => {return{'val': s.values.value_new}}), 'val'),
                        value_quantity: sumBy(d.map(s => {return{'val': s.values.value_quantity}}), 'val'),
                        value_total: sumBy(d.map(s => {return{'val': s.values.total}}), 'val')
                    },
                    details: {
                        organisations: {
                            count: sumBy(d.map(s => {return{'val': s.details.organisations.count}}), 'val'),
                            data: flattenDeep(d.map(s => s.details.organisations.data)),
                            list: flattenDeep(d.map(s => s.details.organisations.list))
                        }
                    }
                }
            ];
        }
        let max = 1;
        let min = 0;
        let values = collections.map(x => x.value);
        if (collections.length > 1){
            min = values.sort((x, y) => x - y)[0];
            max = values.sort((x, y) => y - x)[0];
        }
        let mapConfig = {
            min:min,
            max:max,
            data:collections,
            override: MapsOverride(this.TableView, valtype)
        };
        return mapConfig;
    }

    getOptions(list) {
        let data;
        let valtype = this.props.value.filters.selected.type;
        let title = "WASH Partners Presence for COVID-19 Response";
        let selected = this.props.value.filters.selected.filter;
        let location = this.props.value.filters.locations;
        data = this.props.value.filters.location_values;
        let selected_location = this.props.value.filters.selected.location;
        location = location.find(x => x.id === selected_location);
        location = location.code === "UGANDA"
            ? location
            : data.find(x => x.id === location.id);
        return Maps(title, "Total Organisations", this.getMaps(data, valtype));
    }

    getCharts(list, index) {
        return (
            <Charts
                key={index}
                kind={list.kind}
                data={list.data}
                page={list.page}
                options={this.getOptions(list)}
                table={this.getOverview()}
            />
        )
    }

    getOverview() {
        let data = this.props.value.filters.location_values;
        let organisations = [];
        let activities = {};
        data.forEach(x => {
            x.details.organisations.list.forEach((o => {
                organisations = [...organisations, o];
            }));
            x.details.organisations.data.forEach((d => {
                d.activities.forEach(a => {
                    let count = activities[a] !== undefined ? (activities[a] + 1) : 1;
                    activities[a] = count;
                });
            }));
        });
        let all_beneficeries = sumBy(data.map(x => {return {'val':x.values.value_new}}), 'val');
        let overviews = []
        for (let a in activities) {
            overviews.push({name: titleCase(a) + " Assisted", value: activities[a]});
        }
        return (
            <div className="table-floating tooltip-maps">
            <Card>
                <Card.Header style={{textAlign:'center'}}>Organisations</Card.Header>
                <ListGroup variant="flush" style={{textAlign:'center'}}>
                    <ListGroup.Item><h2>{organisations.length}</h2></ListGroup.Item>
                </ListGroup>
            </Card>
            <Card style={{marginTop:'10px'}}>
                <Card.Header style={{textAlign:'center'}}>Beneficeries Assisted</Card.Header>
                <ListGroup variant="flush" style={{textAlign:'center'}}>
                    <ListGroup.Item><h2>{all_beneficeries}</h2></ListGroup.Item>
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

    render() {
        let chart = this.state.charts.map((list, index) => {
            return this.getCharts(list, index)
        });
        let details = this.props.value.filters.overviews;
        return (
            <Fragment>
            <Container className="top-container">
                <DataFilters className='dropdown-left' depth={1}/>
                <DataFilters className='dropdown-left' depth={2}/>
                <DataLocations className='dropdown-right'/>
            </Container>
            <Container className="container-content">
                <Row>
                {chart}
                </Row>
                <hr/>
                <Tables/>
            </Container>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageActivities);
