import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import {
    Row,
    Col,
    Card,
    Form,
    Button,
    Jumbotron,
    Nav,
} from 'react-bootstrap';
import Charts from '../components/Charts.js';
import Cards from '../components/Cards.js';
import LoadingContainer from './LoadingContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { queueApi, getApi } from '../data/api.js';
import { getHighest } from '../data/utils.js';
import { generateData } from "../charts/chart-generator.js";

const generateSummary = ([total, kind, country, company]) => (
    <div>
        This dashboard is created from the primary data of <b className="text-highlight">{total} {kind}</b> farmers in <b className="text-highlight">{country}</b>. This data was collected during the SDM generation for <b className="text-highlight">{company}</b>.
    </div>
)

class Country extends Component {

    constructor(props) {
        super(props);
        this.changeTab = this.changeTab.bind(this);
        this.getData = this.getData.bind(this);
        this.generateView = this.generateView.bind(this);
        this.generateResources = this.generateResources.bind(this);
        this.handleCheckDownload = this.handleCheckDownload.bind(this);
        this.state = {
            charts: {
                overview:[],
                hh_profile:[],
                farmer_profile:[],
                farm_practices:[],
            },
            summary: "Loading",
            loading: false,
            download: false,
            active: 0,
        };
    }

    changeTab(key) {
        let tab = key.split("/");
        tab = tab[2].replace('-','_');
        this.props.page.changeTab(tab);
        this.getData(this.state.active, tab);
        return true;
    }

    getData(id, tab=this.props.value.page.subpage.tab) {
        this.setState({active:id, loading: true, summary: "Loading"});
        let url = 'country-data/' + id + '/' + tab;
        getApi(url).then(res => {
            let response = res[url];
            this.setState({summary:generateSummary(response.summary), loading:false});
            console.log(response.tabs.length);
            if (response.tabs.length !== 0) {
                response = response.tabs.map((tab) => {
                    let data = tab.charts.map((d, ix) => {
                        let maxheight = 60;
                        let chart =  {
                            identifier: d.kind + '-' + id + '-' + ix,
                            title: d.title,
                            data: d.data,
                            kind: d.kind,
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
            }
        });
        return;
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

    handleCheckDownload () {
        this.setState({download: this.state.download ? false : true});
    }

    generateResources(country, list) {
        let file = list.childrens.find(x => x.id === this.state.active);
            file = country + "-" + file.company;
            file = file.toLowerCase();
            file = file.replace(' ', '_');
        const reports = [
            {type: "raw", text:"Analyzed Farmer Data", href:".xlsx"}
        ];
        const label = "This file contains confidential data that belongs to IDH. Please do not share with client.";
        let aClass = "btn btn-sm btn-block";
            aClass += this.state.download ? " btn-success" : " btn-secondary"
        return reports.map((x,i) => (
            <Col md={4} key={"report-" + i}>
            <Card>
              <Card.Body>
                <Card.Text className="text-center">{x.text} ({x.href})</Card.Text>
              </Card.Body>
                <Card.Footer>
                    <Form>
                        <Form.Group controlId="formBasicCheckbox" onChange={this.handleCheckDownload}>
                        <Form.Check type="checkbox" label={label} defaultChecked={this.state.download}/>
                        </Form.Group>
                    </Form>
                        <hr/>
                    {this.state.download
                        ? (
                            <a href={"/files/" + file + x.href}
                                target="_blank"
                                className={aClass}>Download</a>
                        ) : (
                            <button className={aClass} disabled>Download</button>
                        )}
                </Card.Footer>
            </Card>
            </Col>
        ));
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
        let charts = tab === "resources" || this.state.summary === "Loading" ? [] : this.state.charts[tab];
        return (
            <Fragment>
                <Jumbotron className="has-navigation">
                    <Row className="page-header">
                        <Col md={12} className="page-title text-center">
                            <h2>Project in {country}</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="page-title text-center">
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
                      <Nav.Link
                            active={"resources" === tab}
                            href={"#country/"+country+"/resources"}>
                            <FontAwesomeIcon
                                icon={["fas", "download"]} />
                            Resources
                      </Nav.Link>
                    </Nav>
                    </Row>
                </Jumbotron>
                 <div className="page-content has-jumbotron">
                    {this.state.loading
                        ? (<LoadingContainer/>)
                        : (<Row className="text-center"><div className="summary">{this.state.summary}</div></Row>)
                    }
                    <Row className="justify-content-md-center">
                        {charts.map((x, i) => this.generateView(x, i))}
                        { tab === "resources" ? this.generateResources(country, list) : ""}
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Country);
