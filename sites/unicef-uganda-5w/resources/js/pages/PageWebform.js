import React, { Component } from 'react';
import { Container, Row } from "react-bootstrap";

class PageWebform extends Component {
    render() {
        return (
            <Container className="container-content container-iframe">
                <iframe
                    src="https://tech-consultancy.akvotest.org/akvo-flow-web/wai/1006554002"
                    width="100%"
                    frameBorder="0"
                >
                </iframe>
            </Container>
        );
    }
}

export default PageWebform;
