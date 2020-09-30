import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import {
    Row,
    Col,
    Jumbotron,
    Dropdown,
    Button,
} from 'react-bootstrap';
import Charts from '../components/Charts.js';
import Cards from '../components/Cards.js';
import { queueApi, getApi } from '../data/api.js';
import { getHighest } from '../data/utils.js';
import { generateData } from "../charts/chart-generator.js";
import countBy from 'lodash/countBy';
import groupBy from 'lodash/groupBy';
import flatten from 'lodash/flatten';

class Country extends Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
        this.generateView = this.generateView.bind(this);
        this.state = {
            charts: [],
            active: 0,
        };
    }

    getData(id) {
        this.setState({active:id});
        let url = 'country-data/' + id;
        getApi(url).then(res => {
            let data = res[url];
            data = data.map(d => {
                let maxheight = 60;
                let chart =  {
                    title: d.title,
                    data: d.data,
                    kind: d.kind,
                    config: generateData(d.width, false, maxheight + "vh"),
                }
                if (chart.kind === "CARDS") {
                    maxheight = maxheight / chart.data.length;
                    let rows = chart.data.map(c => {
                        return {
                            title: c.title,
                            data: c.data,
                            kind: c.kind,
                            config: generateData(c.width, false,  maxheight + "vh"),
                            description: c.description
                        }
                    });
                    chart = {
                        ...chart,
                        data: rows,
                    }
                }
                return chart;
            });
            this.setState({charts: data});
            return data;
        });
    }

    generateView(x, i) {
        if (x.kind === "CARDS") {
            return (
                <Cards
                    title={x.title}
                    key={'card-' + i}
                    dataset={x.data}
                    config={x.config}
                />
            );
        }
        return (
            <Charts
                title={x.title}
                key={'chart-'+ i}
                dataset={x.data}
                kind={x.kind}
                config={x.config}
            />
        );
    }

    componentDidMount() {
        let country = this.props.value.page.subpage.country;
        let data = this.props.value.page.filters.find(x => x.name === country);
        let base = this.props.value.page;
        let tabs = base.filters.find(x => x.name === base.subpage.country);
        this.getData(tabs.childrens[0].id);
    }

    render() {
        let country = this.props.value.page.subpage.country;
        let data = this.props.value.page.filters.find(x => x.name === country);
        let base = this.props.value.page;
        let tabs = base.filters.find(x => x.name === base.subpage.country);
        return (
            <Fragment>
                <Jumbotron>
                    <Row className="page-header">
                        <Col md={12} className="page-title text-center">
                            <h2>Project in {country}</h2>
                            <div className="sub-content">
                            {tabs.childrens.map((x, i) => (
                                    <a key={i}
                                        className={x.id === this.state.active ? "active" : ""}
                                        onClick={e => this.getData(x.id)}>
                                        {x.kind}
                                    </a>
                            ))}
                            </div>
                        </Col>
                    </Row>
                </Jumbotron>
                <div className="page-content">
                    <Row>
                        {this.state.charts.map((x, i) => this.generateView(x, i))}
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Country);
