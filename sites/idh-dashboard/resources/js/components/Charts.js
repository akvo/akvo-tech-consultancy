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
        let options = generateOptions(this.props.kind, this.props.title, this.props.dataset);
        if (this.props.config.column === 0) {
            return
                <ReactEcharts
                    option={options}
                    notMerge={true}
                    lazyUpdate={true}
                    style={this.props.config.style}/>;
        }
        return (
            <Col md={this.props.config.column}>
                <div className="card-chart">
                    <ReactEcharts
                        option={options}
                        notMerge={true}
                        lazyUpdate={true}
                        style={this.props.config.style}/>
                    {this.props.config.line ? <hr /> : ""}
                </div>
            </Col>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
