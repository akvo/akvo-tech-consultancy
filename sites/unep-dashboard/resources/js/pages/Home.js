import React, { Component } from "react";
import { connect } from "react-redux";
import { chartStateToProps, chartDispatchToProps } from "../reducers/chartActions";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Col, Row, Container, Jumbotron } from "react-bootstrap";
import Charts from "../components/Charts";
import axios from "axios";
import { barExample } from "../data/barExample";
import { pieExample } from "../data/pieExample";
import { mapExample } from "../data/mapExample";
require("../data/world.js");

class Home extends Component {
    constructor(props) {
        super(props);
        this.storeData = this.storeData.bind(this);
    }

    selectData() {
    }

    storeData(filterId) {
    }

    componentDidMount() {
    }

    render() {
        let bar = barExample();
        let pie = pieExample();
        let map = mapExample();
        let mapData = {
            style: {
                height: "500px"
            }
        };
        let chartData = {
            style: {
                height: "600px"
            }
        };
        return (
            <Container>
                <hr />
                <Charts option={map} data={mapData} />
                <Jumbotron className="charts">
                    <Row>
                        <Col sm={6}>
                            <Charts option={bar} data={chartData} />
                        </Col>
                        <Col sm={6}>
                            <Charts option={pie} data={chartData} />
                        </Col>
                    </Row>
                </Jumbotron>
            </Container>
        );
    }
}

export default connect(chartStateToProps, chartDispatchToProps)(Home);
