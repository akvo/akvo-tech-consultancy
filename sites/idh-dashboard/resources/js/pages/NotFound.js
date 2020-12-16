import React, { Component } from 'react';
import { Row, Col } from "react-bootstrap";
import JumbotronWelcome from '../components/JumbotronWelcome';

class NotFound extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <JumbotronWelcome text={"Page Not Found"}/>
                <div className="page-content has-jumbotron text-center">
                    <Row className="justify-content-md-center">
                        <Col md={3}>
                            The page is not available
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default NotFound;
