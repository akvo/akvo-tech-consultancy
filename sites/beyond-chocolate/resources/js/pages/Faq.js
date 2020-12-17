import React, { useEffect, Fragment, useState } from "react";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import { useLocale } from "../lib/locale-context";
import { faq } from "../static/faq-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleRight,
    faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

const Faq = () => {
    const [activeId, setActiveId] = useState(null);
    const toggleActive = (id) => {
        if (activeId === id) {
            setActiveId(null);
        } else {
            setActiveId(id);
        }
    }
    const { locale } = useLocale();
    let content = faq[locale.active];
    const renderFaq = () => {
        let data = faq[locale.active];
        return data.map((x,idx) => {
            return (
                <Card key={"fr-"+idx}>
                    <Accordion.Toggle as={Card.Header} eventKey={"ac-" + idx} style={{cursor:"pointer"}} className="faqList" onClick={()=> toggleActive(idx)}>
                        <h5 className={activeId === idx ? "green" : ""}>
                            <FontAwesomeIcon
                                className="mr-2"
                                icon={activeId === idx ? faAngleDown : faAngleRight}
                            /> {x.h}
                        </h5>
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
                <Col className="mx-auto" md="9">
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
