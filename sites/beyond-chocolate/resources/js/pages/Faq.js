import React, { useEffect, Fragment } from "react";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import { useLocale } from "../lib/locale-context";
import { faq } from "../static/faq-content";

const Faq = () => {
    const { locale } = useLocale();
    let content = faq[locale.active];
    const renderFaq = () => {
        let data = faq[locale.active];
        return data.map((x,idx) => {
            return (
                <Card key={"fr-"+idx}>
                    <Accordion.Toggle as={Card.Header} eventKey={"ac-" + idx} style={{cursor:"pointer"}} className="faqList">
                        <h5>{idx + 1}. {x.h}</h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={"ac-" + idx}>
                        <Card.Body className="faqList">
                            {x.c}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            )
        });
    };

    useEffect(() => {
        renderFaq();
    }, [locale]);

    return (
        <Container fluid>
            <Row>
                <Col className="mx-auto" md="8">
                    <h3>Frequently Asked Question</h3>
                    <hr/>
                    <Accordion>
                        {renderFaq()}
                    </Accordion>
                </Col>
            </Row>
        </Container>
    );

};

export default Faq;
