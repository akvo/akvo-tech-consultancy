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
        this.clickEvent = this.clickEvent.bind(this);
    }

    clickEvent(params) {
        if (params.seriesType === "map" && params.data) {
            if (params.data.link) {
                window.open(params.data.link);
            }
        }
    }

    render() {
        let options = generateOptions(this.props.kind, this.props.title, this.props.dataset, this.props.compare);
        let onEvents = {
            'click': this.clickEvent,
        }
        if (this.props.config.column === 0) {
            return (
                <ReactEcharts
                    option={options}
                    notMerge={true}
                    lazyUpdate={true}
                    onEvents={onEvents}
                    style={this.props.config.style}
                />

            );
        }
        return (
            <Col md={this.props.config.column} className={"mx-auto"}>
                <div className="card-chart">
                    <ReactEcharts
                        option={options}
                        notMerge={true}
                        lazyUpdate={true}
                        style={this.props.config.style}
                        onEvents={onEvents}/>
                    {this.props.config.line ? <hr /> : ""}
                </div>
            </Col>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
