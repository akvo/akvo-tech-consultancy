import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocale } from "../lib/locale-context";
import { ic } from "../static/impressum-content";

const Impressum = () => {
    const { locale } = useLocale();
    let content = ic[locale.active];

    return (
        <Container fluid>
            <Row>
                <Col className="mx-auto" md="8">
                    <h3>{ content.t }</h3>
                    <hr/>
                    { content.c }
                </Col>
            </Row>
        </Container>
    );
};

export default Impressum;
