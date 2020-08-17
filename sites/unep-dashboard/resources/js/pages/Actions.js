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
                    title: "Type of Actions",
                    subtitle: "Number of Reported Actions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 5, childs:true},
                    extra: {}
                },
                {
                    kind: "ROSEPIE",
                    title: "Role of Organisation",
                    subtitle: "Number of Reported Actions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 77, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "PIE",
                    title: "Evaluation of Actual Outcomes",
                    subtitle: "Number of Reported Actions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 112, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "TREEMAP",
                    title: "Responsible Actors",
                    subtitle: "Number of Reported Actions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 83, childs:true},
                    extra: {}
                },
                {
                    kind: "TREEMAP",
                    title: "Reporting and Evaluation",
                    subtitle: "Number of Reported Actions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 100, childs:true},
                    extra: {}
                },
                {
                    kind: "BAR",
                    title: "Lifecycle of Plastics",
                    subtitle: "Number of Reported Actions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 139, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "BAR",
                    title: "Source to Sea",
                    subtitle: "Number of Reported Actions",
                    config: generateData(12, true, "80vh"),
                    data: {id: 123, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "PIE",
                    title: "Action Target",
                    subtitle: "Number of Reported Actions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 150, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "TREEMAP",
                    title: "Sector",
                    subtitle: "Number of Reported Actions",
                    config: generateData(6, true, "80vh"),
                    data: {id: 192, childs:false},
                    extra: {}
                },
                {
                    kind: "SANKEY",
                    title: "Pollutant Target",
                    subtitle: "Number of Reported Actions",
                    config: generateData(8, true, "65vh"),
                    data: {id: 166, childs:true},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "TABLE",
                    title: "Impact",
                    subtitle: "Number of Reported Actions",
                    config: generateData(4, true, "60vh"),
                    data: {id: 156, childs:false},
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
