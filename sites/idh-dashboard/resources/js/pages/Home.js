import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Jumbotron, Dropdown } from "react-bootstrap";
import Charts from "../components/Charts";
import { generateData } from "../charts/chart-generator.js";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            charts: [],
        };
    }

    render() {
        let data = this.props.value.page.filters.map((x) => {
            return {
                name: x.name,
                value: x.childrens.length,
            };
        });
        let maps = {
            title: "Country Project",
            data: { maps: "world", records: data },
            kind: "MAPS",
            config: generateData(12, true, "80vh"),
        };
        return (
            <Fragment>
                <Jumbotron>
                    <Row className="page-header">
                        <Col md={12} className="page-title text-center">
                            <h2>Welcome to IDH Dataportal</h2>
                        </Col>
                    </Row>
                </Jumbotron>
                <div className="page-content has-jumbotron">
                    <Row>
                        <Charts identifier={"map-home"} title={maps.title} dataset={maps.data} kind={maps.kind} config={maps.config} />
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
