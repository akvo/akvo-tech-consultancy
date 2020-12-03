import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Col, Row, Container } from "react-bootstrap";
import Charts from "../components/Charts";
import Tables from "../components/Tables";
import { generateData } from "../data/chart-utils.js";
import {
    flatten,
    getChildsData,
    pushToParent,
} from "../data/utils.js";

class Actions extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.state = {
            charts: [
                {
                    kind: "TREEMAP",
                    title: "typeActions",
                    subtitle: "numberReportedActions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 5, childs:true},
                    extra: {}
                },
                {
                    kind: "ROSEPIE",
                    title: "roleOrganisation",
                    subtitle: "numberReportedActions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 77, childs:false},
                    extra: {}
                },
                {
                    kind: "PIE",
                    title: "evaluationActualOutcomes",
                    subtitle: "numberReportedActions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 112, childs:false},
                    extra: {}
                },
                {
                    kind: "TREEMAP",
                    title: "responsibleActors",
                    subtitle: "numberReportedActions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 83, childs:true},
                    extra: {}
                },
                {
                    kind: "TREEMAP",
                    title: "reportingEvaluation",
                    subtitle: "numberReportedActions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 100, childs:true},
                    extra: {}
                },
                {
                    kind: "BAR",
                    title: "lifecyclePlastics",
                    subtitle: "numberReportedActions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 140, childs:false},
                    extra: {}
                },
                {
                    kind: "BAR",
                    title: "sourceSea",
                    subtitle: "numberReportedActions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 124, childs:false},
                    extra: {}
                },
                {
                    kind: "PIE",
                    title: "actionTarget",
                    subtitle: "numberReportedActions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 151, childs:false},
                    extra: {}
                },
                {
                    kind: "TREEMAP",
                    title: "sector",
                    subtitle: "numberReportedActions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 193, childs:false},
                    extra: {}
                },
                {
                    kind: "SANKEY",
                    title: "pollutantTargeted",
                    subtitle: "numberReportedActions",
                    config: generateData(8, true, "65vh"),
                    data: {id: 167, childs:true},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "TABLE",
                    title: "impact",
                    subtitle: "numberReportedActions",
                    config: generateData(4, true, "60vh"),
                    data: {id: 157, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
            ]
        }
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

    getCharts(list, index) {
        let data = list.data;
        if (data) {
            data = this.renderOptions(data.id, data.childs);
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
                    extra={list.extra}
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
        let charts = this.state.charts.map((list, index) => {
            return this.getCharts(list, index)
        });
        return (
            <Container>
                <Row>
                    {charts}
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
