import React, { Component } from "react";
import { redux } from "react-redux";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import { Col } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import { generateOptions } from "../charts/chart-generator.js";

class Charts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let options = generateOptions(
            this.props.kind,
            this.props.title,
            this.props.dataset
        );
        return (
            <Col md={this.props.config.column}>
                <ReactEcharts
                    option={options}
                    notMerge={true}
                    lazyUpdate={true}
                />
                {this.props.config.line ? <hr /> : ""}
            </Col>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
