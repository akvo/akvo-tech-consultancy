import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Col, Row, Container } from "react-bootstrap";
import Charts from "../components/Charts";
import { generateData } from "../data/chart-utils.js";
import {
    flatten,
    getChildsData,
    pushToParent,
    formatCurrency
} from "../data/utils.js";

class Reports extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.getReportTable = this.getReportTable.bind(this);
        this.reportToggle = this.reportToggle.bind(this);
        this.state = {
            charts: [
                {
                    kind: "TREEMAP",
                    title: "Type of Actions",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 5, childs:false},
                    extra: {}
                },
                {
                    kind: "PIE",
                    title: "Role of Organisation",
                    subtitle: "Count of Actions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 77, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "PIE",
                    title: "Evaluation of Actual Outcomes",
                    subtitle: "Count of Actions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 112, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "BAR",
                    title: "Lifecycle of Plastics",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 139, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "BAR",
                    title: "Source to Sea",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 123, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "PIE",
                    title: "Action Target",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 150, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "BAR",
                    title: "Sector",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "70vh"),
                    data: {id: 192, childs:false},
                    extra: {}
                },
                {
                    kind: "PIE",
                    title: "Pollutant Target",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "100vh"),
                    data: {id: 166, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
            ]
        }
    }

    componentDidMount() {
        this.props.report.reset();
    }

    renderOptions(filterId, childs=true) {
        let active = this.props.value.reports;
        let thefilter = flatten(this.props.value.page.filters);
            thefilter = thefilter.filter(x => x.id === filterId);
        let datapoints = this.props.value.data.master.map(x => x.values);
            thefilter = getChildsData(thefilter, datapoints, active);
        if (thefilter.length > 0) {
            thefilter = thefilter[0].children;
        }
        if (thefilter.length > 0 && childs === false) {
            thefilter = pushToParent(thefilter)
        }
        return thefilter;
    }

    getCharts(list, index) {
        let data = this.renderOptions(list.data.id, list.data.childs);
        return (
            <Charts
                key={index}
                title={list.title}
                subtitle={list.subtitle}
                kind={list.kind}
                config={list.config}
                dataset={data}
                extra={list.extra}
                reports={true}
            />
        )
    }

    reportToggle(active, x) {
        if (active) {
            return this.props.report.delete(x.datapoint_id);
        }
        return this.props.report.append(x.datapoint_id);
    }

    getReportTable() {
        let datapoints = this.props.value.data.filteredpoints;
        datapoints = this.props.value.data.datapoints.filter(x => datapoints.includes(x.datapoint_id));
        return datapoints.map((x, i) => {
            let active = this.props.value.reports.includes(x.datapoint_id);
            return (
                <tr key={'datapoint-'+i}>
                    <td align="center"
                        onClick={e => this.reportToggle(active, x)}
                        className="report-select">
                        <FontAwesomeIcon
                            color={active ? "green" : "grey"}
                            icon={["fas", active ? "check-circle" : "plus-circle"]}
                        />
                    </td>
                    <td className="report-title">{x.title}</td>
                    <td align="right">5</td>
                    <td className="report-funds">{formatCurrency(x.f)}</td>
                </tr>
            )
        });
    }

    render() {
        let charts = this.state.charts.map((list, index) => {
            return this.getCharts(list, index)
        });
        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <table width={"100%"} className="table-report">
                            <thead>
                                <tr>
                                    <td align="center" className="report-select">Select</td>
                                    <td className="report-title">Project Name</td>
                                    <td align="right">Countries</td>
                                    <td align="right">Funds (USD)</td>
                                </tr>
                            </thead>
                            <tbody>
                                {this.getReportTable()}
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row>
                {/*<Row className="report-chart-list">*/}
                    {charts}
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
