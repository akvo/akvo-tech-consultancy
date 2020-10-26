import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Button, Jumbotron, Table, Dropdown } from "react-bootstrap";
import Charts from "../components/Charts";
import { generateData } from "../charts/chart-generator.js";
import { flatFilters } from '../data/utils.js';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            charts: [],
        };
    }

    render() {
        let page = this.props.value.page;
        let data = page.filters.map((x) => {
            return {
                name: x.name,
                value: x.childrens.length,
            };
        });
        let source = flatFilters(page.filters);
        let maps = {
            title: "Country Project",
            data: { maps: "world", records: data },
            kind: "MAPS",
            config: generateData(12, true, "60vh"),
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
                        <Col md={8}>
                        <Charts identifier={"map-home"} title={maps.title} dataset={maps.data} kind={maps.kind} config={maps.config} />
                        </Col>
                        <Col md={4}>
                            <Table bordered hover size="sm">
                                <thead>
                                    <tr>
                                    <th>Country</th>
                                    <th>Crop</th>
                                    <th>Company</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                            {source.map((x, i) => (
                                    <tr key={"tbl-" + i}>
                                    <td>{x.name.split(' - ')[0]}</td>
                                    <td>{x.kind}</td>
                                    <td>{x.company}</td>
                                        <td><Button block size="sm" variant="primary">View</Button></td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
