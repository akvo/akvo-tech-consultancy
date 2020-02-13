import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Col, Row, Container, Jumbotron } from "react-bootstrap";
import Charts from "../components/Charts";
import axios from "axios";
import { loadingChart, generateOptions } from "../data/chart-utils.js";
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

    render() {
        let selected = this.props.value.filters.selected;
            selected = selected[selected.length - 1];
        let bar = generateOptions("BAR", selected.name, this.props.value.charts.active.values);
        let pie = generateOptions("PIE", selected.name, this.props.value.charts.active.values);
        let maps = generateOptions("MAPS", selected.name, this.props.value.charts.active.values);
        let mapData = {
            column: 12,
            line: true,
            style: {
                height: "500px"
            }
        };
        let chartData = {
            column: 6,
            line: false,
            style: {
                height: "600px"
            }
        };
        return (
            <Container>
                <Row>
                    <Charts option={maps} data={mapData} selected={selected} type={"MAPS"} />
                    <Charts option={bar} data={chartData} selected={selected} type={"BAR"}/>
                    <Charts option={pie} data={chartData} selected={selected} type={"PIE"}/>
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
