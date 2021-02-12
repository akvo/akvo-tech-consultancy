import React, { Component } from 'react';
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { useLocation } from 'react-router-dom';
import LoadingContainer from "../components/LoadingContainer";
import Charts from "../components/Charts.js";
import Cards from "../components/Cards.js";
import Tables from "../components/Tables.js";
import { Row, Col, Card, Form, Button, Jumbotron, Spinner } from "react-bootstrap";
import { queueApi, getApi, userDownload } from "../data/api.js";
import { generateData } from "../charts/chart-generator.js";

const generateSummary = ([total, kind, country, company]) => (
    <div>
        This dashboard is created from the primary data of{" "}
        <b className="text-highlight">
            {total} {kind}
        </b>{" "} farmers in <b className="text-highlight">{country}</b>.
        This data was collected during the SDM generation for <b className="text-highlight">{company}</b>.
    </div>
);


class CountryTab extends Component {

    constructor(props) {
        super(props);
        this.generateResources = this.generateResources.bind(this);
        this.handleCheckDownload = this.handleCheckDownload.bind(this);
        this.getData = this.getData.bind(this);
        this.generateView = this.generateView.bind(this);
        this.state = {
            charts: [],
            summary: "Loading",
            loading: false,
            download: false,
            tab: "overview",
            iframeLoading: true,
            iframeH: "916px",
            downloadContent: {
                files: [],
                report_url: null,
            },
        };
    }

    handleCheckDownload() {
        this.setState({ download: this.state.download ? false : true });
    }

    getData({country, companyId, tab}) {
        const id = parseInt(companyId);
        const url = "country-data/" + id + "/" + tab;
        this.setState({ active: id , tab: tab});
        if (tab === "download") {
            getApi(url).then((res) => {
                let response = res[url];
                this.setState({ summary: generateSummary(response.summary), loading: false });
                if (response.tabs.length !== 0) {
                    response = response.tabs.map((tab) => {
                        this.setState({ downloadContent: {files: tab.files, report_url: tab.report_url} });
                    });
                }
            });
            // this.setState({loading:false});
            return;
        }
        getApi(url).then((res) => {
            let response = res[url];
            this.setState({ summary: generateSummary(response.summary), loading: false });
            if (response.tabs.length !== 0) {
                response = response.tabs.map((tab) => {
                    let data = tab.charts.map((d, ix) => {
                        let maxheight = 60;
                        let chart = {
                            identifier: d.kind + "-" + id + "-" + ix,
                            title: d.title,
                            data: d.data,
                            kind: d.kind,
                            config: generateData(d.width, false, maxheight + "vh"),
                            width: d.width,
                        };
                        if (chart.kind === "CARDS") {
                            maxheight = maxheight / chart.data.length;
                            let rows = chart.data.map((c, i) => {
                                return {
                                    identifier: "cards-" + ix + "-" + i,
                                    first_title: c.first_title,
                                    title: c.title,
                                    data: c.data,
                                    kind: c.kind,
                                    config: generateData(c.width, false, maxheight + "vh"),
                                    width: c.width,
                                };
                            });
                            chart = {
                                ...chart,
                                data: rows,
                            };
                        }
                        return chart;
                    });
                    this.setState({charts: data});
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
            return <Cards
                identifier={x.identifier}
                title={x.title}
                kind={x.kind}
                key={"card-" + i}
                dataset={x.data}
                config={x.config}/>;
        }
        if (x.kind === "TABLE") {
            return <Tables
                identifier={x.identifier}
                title={x.title}
                kind={x.kind}
                key={"table-" + i}
                dataset={x.data}
                config={x.config} />
        }
        return <Charts
                identifier={x.identifier}
                title={x.title} key={"chart-" + i}
                dataset={x.data}
                kind={x.kind}
                config={x.config}/>;
    }

    generateResources(params) {
        let country = this.props.value.page.filters.find(x => x.name === params.country.toTitle());
        let company = country.childrens.find(x => x.id === parseInt(params.companyId));
        let file = params.country + "-" + company.company.toLowerCase().replace(' ', '_');
        file = file.toLowerCase();
        file = file.replace(" ", "_");
        // const reports = [{ type: "raw", text: "Analyzed Farmer Data", to: ".xlsx" }];
        const reports = this.state.downloadContent.files;
        const label = "This file contains confidential data that belongs to IDH. Please do not share with client.";
        let aClass = "btn btn-sm btn-block";
        aClass += this.state.download ? " btn-success" : " btn-secondary";
        let reportResults = reports.map((x, i) => {
            return (
                // <Col md={4} key={"report-" + i}>
                //     <Card>
                //         <Card.Body>
                //             <Card.Text className="text-center">
                //                 {x.text} ({x.to})
                //             </Card.Text>
                //         </Card.Body>
                //         <Card.Footer>
                //             <Form>
                //                 <Form.Group controlId="formBasicCheckbox" onChange={this.handleCheckDownload}>
                //                     <Form.Check type="checkbox" label={label} defaultChecked={this.state.download} />
                //                 </Form.Group>
                //             </Form>
                //             <hr />
                //             {this.state.download ? (
                //                 <a href={"/files/" + file + x.to}
                //                     onClick={e => userDownload(this.props.match.params.companyId)}
                //                     target="_blank"
                //                     className={aClass}
                //                 >
                //                     Download
                //                 </a>
                //             ) : (
                //                 <button className={aClass} disabled>
                //                     Download
                //                 </button>
                //             )}
                //         </Card.Footer>
                //     </Card>
                // </Col>   
                <Col md={reports.length === 1 ? 12 : 6} key={"report-" + i}>
                    <Jumbotron style={{backgroundImage:'none', backgroundColor:'white'}} className="text-center">
                        <h6>{x.text} ({x.to})</h6>
                        <Form className="mt-2">
                            <Form.Group controlId="formBasicCheckbox" onChange={this.handleCheckDownload}>
                                <Form.Check type="checkbox" label={label} defaultChecked={this.state.download} />
                            </Form.Group>
                         </Form>
                         <div className="d-flex justify-content-center">
                            {this.state.download ? (
                                <a href={"/files/" + file + x.to}
                                    onClick={e => userDownload(this.props.match.params.companyId)}
                                    target="_blank"
                                    className={aClass}
                                    style={{width:"25rem"}}
                                >
                                    Download
                                </a>
                            ) : (
                                <button className={aClass} style={{width:"25rem"}} disabled>
                                    Download
                                </button>
                            )}
                         </div>
                    </Jumbotron>
                </Col>
            );
        });
        return (
            <>
                <Col className="mt-2" md={10} md={10}>
                    <Row className="d-flex justify-content-center">{reportResults}</Row>
                </Col>
                
                <Col className="mt-5" md={10} key="data-delivey">
                    <div className="text-center">
                        <h3>Data Analysis Report</h3>
                        <hr/>
                    </div>
                    { 
                        (this.state.iframeLoading) && (
                            <div className="d-flex justify-content-center">
                                <Spinner className="mt-3" animation="border" variant="primary" />
                            </div>
                        )
                    }
                    <iframe 
                        id="iframe-test"
                        src={this.state.downloadContent.report_url}
                        style={{overflow:"hidden !important", visibility: 'hidden'}}
                        frameBorder={0}
                        width={"100%"}
                        height={this.state.iframeH}
                        onLoad={(e) => {
                            const iframe = document.getElementById('iframe-test');
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            const head = iframeDoc.head;
                            const scrollH = iframeDoc.body.scrollHeight;
                            const iframeH = scrollH + (scrollH/2) + 'px';
                            head.innerHTML = head.innerHTML + '<style>.main-container{max-width: 100%!important;} html, body {background-color: #fff; color: #636b6f; font-family: "Assistant", sans-serif; font-weight: 200; height: 100vh; margin: 0;}</style>'
                            this.setState({ iframeLoading: false, iframeH: iframeH });
                            iframe.style.removeProperty('visibility');
                        }}
                    >
                    </iframe>
                </Col>
            </>
        );
    }

    componentDidMount() {
        this.getData(this.props.match.params);
    }

    UNSAFE_componentWillReceiveProps() {
        this.setState({ loading: true, charts:[] });
        setTimeout(() => {
            this.getData(this.props.match.params);
        }, 100);
    }

    render() {
        return this.state.loading
            ? (<LoadingContainer />) : (
                <>
                    <Row className="text-center">
                        <div className="summary">{this.state.summary}</div>
                    </Row>
                    <Row className="justify-content-md-center">
                        {this.state.tab === "download" ? this.generateResources(this.props.match.params) : ""}
                        {this.state.charts.map((x, i) => this.generateView(x,i))}
                    </Row>
                </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountryTab);
