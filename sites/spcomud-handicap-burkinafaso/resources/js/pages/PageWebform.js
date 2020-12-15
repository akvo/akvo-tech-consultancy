import React, { Component } from 'react';
import { Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
class PageWebform extends Component {
    render() {
        let filters = this.props.value.filters['overviews'];
        let url = "https://tech-consultancy.akvotest.org/akvo-flow-web/westafrica/" + filters.source;

        return (
            <Container className="container-content container-iframe">
                <iframe
                    src={url}
                    width="100%"
                    frameBorder="0"
                >
                </iframe>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageWebform);