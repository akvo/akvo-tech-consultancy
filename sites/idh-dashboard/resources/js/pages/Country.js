import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import {
    Row,
    Col,
    Jumbotron,
    Nav,
} from 'react-bootstrap';
import Charts from '../components/Charts.js';
import Cards from '../components/Cards.js';
import { queueApi, getApi } from '../data/api.js';
import { getHighest } from '../data/utils.js';
import { generateData } from "../charts/chart-generator.js";

class Country extends Component {

    constructor(props) {
        super(props);
        this.changeTab = this.changeTab.bind(this);
        this.getData = this.getData.bind(this);
        this.generateView = this.generateView.bind(this);
        this.state = {
            charts: {
                overview:[],
                hh_profile:[],
                farmer_profile:[],
                farm_practices:[],
            },
            active: 0,
        };
    }

    changeTab(key) {
        let tab = key.split("/");
        tab = tab[2].replace('-','_');
        this.props.page.changeTab(tab);
        return true;
    }

    getData(id) {
        this.setState({active:id});
        let url = 'country-data/' + id;
        this.props.page.loading(true);
        getApi(url).then(res => {
            let response = res[url];
            response = response.map((tab) => {
                let data = tab.charts.map((d, ix) => {
                    let maxheight = 60;
                    let chart =  {
                        identifier: d.kind + '-' + id + '-' + ix,
                        title: d.title,
                        data: d.data,
                        kind: d.kind,
                        desc: d.description,
                        config: generateData(d.width, false, maxheight + "vh"),
                        width: d.width,
                    }
                    if (chart.kind === "CARDS") {
                        maxheight = maxheight / chart.data.length;
                        let rows = chart.data.map((c,i) => {
                            return {
                                identifier: 'cards-' + ix + '-' + i,
                                title: c.title,
                                data: c.data,
                                kind: c.kind,
                                config: generateData(c.width, false,  maxheight + "vh"),
                                description: c.description,
                                width: c.width,
                            }
                        });
                        chart = {
                            ...chart,
                            data: rows,
                        }
                    };
                    return chart;
                });
                this.setState({
                    charts: {
                        ...this.state.charts,
                        [tab.name]: data,
                    }
                });
                return data;
            });
            return response;
        }).then(res => {
            this.props.page.loading(false);
        });
    }

    generateView(x, i) {
        let nonChart = ["CARDS", "NUM", "PERCENT"];
        if (nonChart.includes(x.kind)) {
            return (
                <Cards
                    identifier={x.identifier}
                    title={x.title}
                    kind={x.kind}
                    key={'card-' + i}
                    description={x.desc}
                    dataset={x.data}
                    config={x.config}
                />
            );
        }
        return (
            <Charts
                identifier={x.identifier}
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
        let subpage = base.filters.find(x => x.name === base.subpage.country);
        this.getData(subpage.childrens[0].id);
    }

    render() {
        let country = this.props.value.page.subpage.country;
        let data = this.props.value.page.filters.find(x => x.name === country);
        let base = this.props.value.page;
        let list = base.filters.find(x => x.name === base.subpage.country);
        let tab = base.subpage.tab;
        let charts = this.state.charts[tab];
        return (
            <Fragment>
                <Jumbotron className="has-navigation">
                    <Row className="page-header">
                        <Col md={12} className="page-title text-center">
                            <h2>Project in {country}</h2>
                            <div className="sub-content">
                            {list.childrens.map((x, i) => (
                                <a key={i}
                                    className={x.id === this.state.active ? "active" : ""}
                                    onClick={e => this.getData(x.id)}>
                                    {x.company}
                                </a>
                            ))}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                    <Nav
                        activeKey={tab}
                        className="align-self-center nav-jumbotron"
                        onSelect={this.changeTab}
                    >
                      <Nav.Link
                            active={"overview" === tab}
                            href={"#country/"+country+"/overview"}>Overview
                      </Nav.Link>
                      <Nav.Link
                            active={"hh_profile" === tab}
                            href={"#country/"+country+"/hh-profile"}>HH Profile
                      </Nav.Link>
                      <Nav.Link
                            active={"farmer_profile" === tab}
                            href={"#country/"+country+"/farmer-profile"}>Farmer Profile
                      </Nav.Link>
                      <Nav.Link
                            active={"farm_practices" === tab}
                            href={"#country/"+country+"/farm-practices"}>Farm Practices
                      </Nav.Link>
                    </Nav>
                    </Row>
                </Jumbotron>
                <div className="page-content">
                    <Row>
                        {charts.map((x, i) => this.generateView(x, i))}
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Country);
