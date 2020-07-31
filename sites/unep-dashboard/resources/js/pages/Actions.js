import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Col, Row, Container } from "react-bootstrap";
import Charts from "../components/Charts";
import { generateData } from "../data/chart-utils.js";

class Actions extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.state = {
            charts: [
                {
                    kind: "TREEMAP",
                    title: "Count of Actions",
                    config: generateData(12, true, "80vh")
                },
            ]
        }
    }

    getCharts(list, index) {
        const extra = {};
        return (
            <Charts
                key={index}
                title={list.title}
                kind={list.kind}
                config={list.config}
                extra={extra}
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
