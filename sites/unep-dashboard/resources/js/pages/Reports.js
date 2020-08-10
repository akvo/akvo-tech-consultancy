import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Col, Row, Container } from "react-bootstrap";
import Charts from "../components/Charts";
import { generateData } from "../data/chart-utils.js";
import {
    flatten,
    getChildsData,
    pushToParent,
} from "../data/utils.js";

class Reports extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.state = {
            charts: [
                {
                    kind: "BAR",
                    title: "Type of Actions",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 5, childs:false},
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
                    config: generateData(12, true, "80vh"),
                    data: {id: 192, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "SANKEY",
                    title: "Pollutant Target",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 166, childs:true},
                    extra: {
                        tooltip: {show: false},
                    }
                },
            ]
        }
    }

    renderOptions(filterId, childs=true) {
        let active = this.props.value.data.filteredpoints;
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
            />
        )
    }

    render() {
        let charts = this.state.charts.map((list, index) => {
            return this.getCharts(list, index)
        });
        return (
            <Container>
                <div className="datapoint-list"></div>
                <Row className="report-chart-list">
                    {charts}
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
