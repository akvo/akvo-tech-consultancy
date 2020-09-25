import React, { Component, Fragment } from "react";
import { redux } from "react-redux";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import { Col, Card } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import { generateOptions } from "../charts/chart-generator.js";

class Charts extends Component {
    constructor(props) {
        super(props);
        this.getExtraAttributes = this.getExtraAttributes.bind(this);
    }

    getExtraAttributes(data) {
        return data.map((x,i) => (
            <Fragment key={i}>
            <Card.Body>
            <Card.Title>
                <h2 className="extra-counter">{x.data.value}</h2>
            </Card.Title>
                <p className="text-center">{x.text.replace('###', x.data.name)}</p>
            </Card.Body>
            </Fragment>
        ));
    }

    render() {
        let options = generateOptions(
            this.props.kind,
            this.props.title,
            this.props.dataset
        );
        let extras = this.props.extras;
        return (
            <Fragment>
            <Col md={this.props.config.column}>
                <ReactEcharts
                    option={options}
                    notMerge={true}
                    lazyUpdate={true}
                    style={this.props.config.style}
                />
                {this.props.config.line ? <hr /> : ""}
            </Col>
            {extras.length > 0 ? (
                <Col md={4}>
                    <Card>
                    {this.getExtraAttributes(extras)}
                    </Card>
                </Col>
            ) : ""}
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
