import React, { useState } from "react";
import { Container, Row, Col, Accordion, Card } from "react-bootstrap";
import { useLocale } from "../lib/locale-context";
import { ic } from "../static/impressum-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleRight,
    faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { ModalDataSecurity } from "../components/Modal";
import { dsc } from "../static/data-security-content";
import { uiText } from "../static/ui-text";

const Impressum = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [activeId, setActiveId] = useState(0);
    const { locale } = useLocale();

    let content = ic(handleShow);
        content = content[locale.active];
    let text = uiText[locale.active];

    const toggleActive = (id) => {
        if (activeId === id) {
            setActiveId(null);
        } else {
            setActiveId(id);
        }
    };

    const renderImpressum = () => {
        let content = ic(handleShow);
        let data = content[locale.active];
        return data.list.map((x,idx) => {
            return (
                <Card key={"ic-"+idx}>
                    <Accordion.Toggle 
                        as={Card.Header} 
                        eventKey={"ic-" + idx} 
                        style={{cursor:"pointer"}} 
                        className="faqList" 
                        onClick={()=> toggleActive(idx)}
                    >
                        <h5 className={activeId === idx ? "green" : ""}>
                            <FontAwesomeIcon
                                className="mr-2"
                                icon={activeId === idx ? faAngleDown : faAngleRight}
                            /> {x.h}
                        </h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={"ic-" + idx}>
                        <Card.Body className="faqList">
                            {x.c}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            )
        });
    };

    return (
        <Container fluid>
            <Row>
                <Col className="mx-auto" md="9">
                    <h3>{ content.t }</h3>
                    <hr/>
                    {/* { content.c } */}
                    <Accordion defaultActiveKey={"ic-" + activeId}>
                        {renderImpressum()}
                    </Accordion>
                </Col>
            </Row>

            <ModalDataSecurity
                text={text}
                show={show}
                handleClose={handleClose}
                locale={locale}
                data={dsc}
            />
        </Container>
    );
};

export default Impressum;
