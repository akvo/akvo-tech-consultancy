import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import request from "../lib/request";
import useForm from "../lib/use-form";

const WebForm = () => {
    const [newForm, setNewForm] = useState();
    const [availableForms, setAvailableForms] = useState([]);
    const { register, handleSubmit } = useForm();

    const selectNewForm = ({ newForm }) => {
        const form = availableForms.find(f => f.name === newForm);
        setNewForm(form);
    };

    useEffect(async () => {
        const { data } = await request().get("/api/me/surveys");
        setAvailableForms(data);
    }, []);

    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    <div className="d-flex">
                        <div className="p-2 flex-grow-1">
                            <Row>Pick a previously saved forms</Row>
                            <Row>
                                <div>
                                    <Form inline>
                                        <Form.Control
                                            as="select"
                                            className="mb-2 mr-sm-2"
                                            placeholder="Select a saved form"
                                        >
                                            <option></option>
                                        </Form.Control>
                                        <Button type="submit" className="mb-2">
                                            Open
                                        </Button>
                                    </Form>
                                </div>
                            </Row>
                        </div>
                        <div className="p-2 pr-3">
                            <Row>Start filling a new form</Row>
                            <Row>
                                <div>
                                    <Form
                                        inline
                                        onSubmit={handleSubmit(selectNewForm)}
                                    >
                                        <Form.Control
                                            as="select"
                                            className="mb-2 mr-sm-2"
                                            name="newForm"
                                            placeholder="Select a from type"
                                            ref={register}
                                        >
                                            <option></option>
                                            {availableForms.map(f => (
                                                <option
                                                    key={f.name}
                                                    value={f.name}
                                                >
                                                    {f.title}
                                                </option>
                                            ))}
                                        </Form.Control>
                                        <Button type="submit" className="mb-2">
                                            Open
                                        </Button>
                                    </Form>
                                </div>
                            </Row>
                        </div>
                    </div>
                    <Card style={{ height: "100vh" }}>
                        {newForm && (
                            <iframe
                                frameBorder="0"
                                style={{ height: "100vh", width: "100%" }}
                                src={newForm.url}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default WebForm;
