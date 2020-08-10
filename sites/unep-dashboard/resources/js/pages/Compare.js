import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import {
    Container,
    Col,
    Card,
    Row
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const parentStyle = {
    "font-weight":"bold",
    "background-color":"#f2f2f2",
    "padding-left": "15px"
}

class Compare extends Component {
    constructor(props) {
        super(props);
        this.renderIndicator = this.renderIndicator.bind(this);
    }

    renderIndicator(data, depth) {
        let padding = depth === 0 ? 0 : (20*depth);
        let fontSize = depth === 0 ? 16 : 14;
        let styleBase = {"padding-left": padding + "px","font-size": fontSize + "px"};
            styleBase = depth === 0 ? {...styleBase, ...parentStyle} : styleBase;
        let nest = depth + 1;
        return data.map((x, i) => {
            let name = x.name.split('(')[0];
                name = x.childrens.length > 0 && depth !== 0 ? " - " + name : name;
            return (
                <Fragment>
                <tr key={i + "-" + depth}>
                    <td
                        className="first-column"
                        style={styleBase}
                    >
                    {name}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                    {x.childrens.length > 0 ? this.renderIndicator(x.childrens, nest) : ""}
                </Fragment>
            )
        });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <table width={"100%"} className="table-compare">
                            <thead>
                                <tr>
                                    <td align="left" width={"30%"} className="first-column">
                                    </td>
                                    <td align="center">
                                        <Card>
                                            <Card.Body>
                                                <button className="btn btn-secondary btn-sm">
                                                <FontAwesomeIcon
                                                    className="fas-icon"
                                                    icon={["fas", "plus-circle"]} />
                                                 Add Country
                                                </button>
                                            </Card.Body>
                                        </Card>
                                    </td>
                                    <td align="center">
                                        <Card>
                                            <Card.Body>
                                                <button className="btn btn-secondary btn-sm">
                                                <FontAwesomeIcon
                                                    className="fas-icon"
                                                    icon={["fas", "plus-circle"]} />
                                                 Add Country
                                                </button>
                                            </Card.Body>
                                        </Card>
                                    </td>
                                    <td align="center">
                                        <Card>
                                            <Card.Body>
                                                <button className="btn btn-secondary btn-sm">
                                                <FontAwesomeIcon
                                                    className="fas-icon"
                                                    icon={["fas", "plus-circle"]} />
                                                 Add Country
                                                </button>
                                            </Card.Body>
                                        </Card>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderIndicator(this.props.value.page.filters, 0)}
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
