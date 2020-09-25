import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import {
    Row,
    Col,
    Jumbotron,
    Dropdown
} from 'react-bootstrap';
import Charts from '../components/Charts.js';
import { queueApi, getApi } from '../data/api.js';
import { getHighest } from '../data/utils.js';
import { generateData } from "../charts/chart-generator.js";
import countBy from 'lodash/countBy';
import groupBy from 'lodash/groupBy';
import flatten from 'lodash/flatten';

const visualconfigs = {
    "pi_location_cascade_county": {
        desc: {
            rows: [{
                func: (records) => {
                    return {name:'', value: records.length};
                },
                text: "Of the farmers are included in the analysis"
            },{
                func: (records) => {
                    return getHighest(records,'f_first_crop');
                },
                text: "Of the farmers main crop was rice ###"
            }]
        }
    }
}

class Country extends Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
        this.state = {
            charts: []
        };
    }

    getData() {
        let base = this.props.value.page;
        let source = base.filters.find(x => x.name === base.subpage.country);
        let ids = source.childrens.map(x => {
            let url = 'data/' + x.id;
            getApi(url).then(res => {
                let data = res[url];
                data = data.map(d => {
                    let attr = d.attributes;
                    let records = d.records;
                    attr = attr.map(x => {
                        let extras = [];
                        let kind = "SCATTER";
                        let config = generateData(6, true, "60vh");
                        let extra_config = generateData(4, true, "30vh");
                        let grouped = records.map(r => {
                            return isNaN(r[x.variable])
                                ? r[x.variable].split('|')
                                : [r['f_size'], r[x.variable]];
                        });
                        if (x.type === "option") {
                            grouped = countBy(flatten(grouped));
                            let stacked = [];
                            for (let group in grouped) {
                                stacked = [...stacked, {name:group.toTitle(), value:grouped[group]}];
                            }
                            grouped = stacked;
                            kind = grouped.length > 3 ? "BAR" : "PIE";
                        }
                        if (x.variable === "pi_location_cascade_county") {
                            kind = "MAPS";
                            config = generateData(4, false, "60vh");
                            grouped = {maps:this.props.value.page.subpage.country.toLowerCase(), records:grouped};
                            let desc = visualconfigs[x.variable].desc;
                            desc.rows.map(d => {
                                extras.push({data:d.func(records), text: d.text,config: extra_config});
                            });
                        }
                        if (x.variable === "farmer_sample"){
                            config = generateData(4, false, "60vh");
                        }
                        grouped = kind === "SCATTER"
                            ? {xAxis: "Farm Size", yAxis: x.name, data: grouped}
                            : grouped;
                        let sets = {
                            title:x.name,
                            data: grouped,
                            kind: kind,
                            config: config,
                            extras: extras
                        };
                        this.setState({charts: [...this.state.charts, sets]});
                    });
                    return {
                        attr: attr,
                        total: records.length,
                        records: records
                    };
                });
                return data;
            });
        });
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        let country = this.props.value.page.subpage.country;
        let data = this.props.value.page.filters.find(x => x.name === country);
        return (
            <Fragment>
                <Jumbotron>
                    <Row className="page-header">
                        <Col md={12} className="page-title text-center">
                            <h2>Project in {country}</h2>
                        </Col>
                    </Row>
                </Jumbotron>
                <div className="page-content">
                    <Row>
                        {this.state.charts.map((x, i) =>
                            <Charts
                                title={x.title}
                                key={'chart-'+ i}
                                dataset={x.data}
                                kind={x.kind}
                                config={x.config}
                                extras={x.extras}
                            />
                        )}
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Country);
