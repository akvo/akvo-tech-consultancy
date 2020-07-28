import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Col, Row, Container, Jumbotron } from "react-bootstrap";
import Charts from "../components/Charts";
import { generateData } from "../data/chart-utils.js";
require("../data/world.js");

class Home extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.state = {
            charts: [
                {
                    kind: "MAPS",
                    calc: "VALUES",
                    data: generateData(8, true, "500px")
                },
            ]
        }
    }

    getCharts(list, index) {
        return (
            <Charts
                key={index}
                kind={list.kind}
                data={list.data}
                calc={list.calc}
            />
        )
    }

    render() {
        let chart = this.state.charts.map((list, index) => {
                return this.getCharts(list, index)
        });
        return (
            <Container>
                <Row>
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
