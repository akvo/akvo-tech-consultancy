import React, { Component } from "react";
import { Col, Row, Container, Card, Form, Button } from "react-bootstrap";
import axios from 'axios';

const contents = [{
        q: "Lorem Ipsum?",
        a: "Dolor sit amet"
    },{
        q: "Ipsum Lorem?",
        a: "Dolor sit amet"
}];

const glossary = [{
        c: "Lorem Ipsum",
        m: "Dolor sit amet"
    },{
        c: "Ipsum Lorem",
        m: "Dolor sit amet"
}];

class Support extends Component {
    constructor(props) {
        super(props);
        this.renderFaq = this.renderFaq.bind(this);
        this.renderGlossary = this.renderGlossary.bind(this);
        this.renderContact = this.renderContact.bind(this);
        this.updateValidator = this.updateValidator.bind(this);
        this.updateValidatorAnswer = this.updateValidatorAnswer.bind(this);
        this.state = {
            validatorAnswer: 0,
            validatorValue: -1,
        }
    }

    updateValidatorAnswer(e) {
        let value = e.target.value !== "" ? parseInt(e.target.value) : 0;
        this.setState({validatorAnswer: value})
    }

    updateValidator() {
        let validatorX = Math.floor(Math.random() * 9) + 1;
        let validatorY = Math.floor(Math.random() * 9) + 1;
        var canv = document.createElement("canvas");
        canv.width = 100;
        canv.height = 50;
        let ctx = canv.getContext("2d");
        ctx.font = "25px Georgia";
        ctx.strokeText(validatorX + "+" + validatorY, 0, 30);
        this.setState({validatorValue: validatorX + validatorY});
        document.getElementById("captcha-number").appendChild(canv);
    }

    renderFaq() {
        return contents.map((x, i) => (
            <Col key={"faq-" + i} md={12}>
                <strong>{i + 1}. {x.q}</strong>
                <p>{x.a}</p>
                {i < contents.length - 1? (<hr/>) : ""}
            </Col>
        ))
    }

    renderGlossary() {
        return glossary.map((x, i) => (
            <tr key={"glossary-" + i}>
                <td width={"20%"}><strong>{x.c}</strong>:</td>
                <td>{x.m}</td>
            </tr>
        ))

    }

    componentDidMount() {
        this.updateValidator();
    }

    renderContact() {
        let valid = this.state.validatorAnswer === 0
            ? true
            : (this.state.validatorAnswer === this.state.validatorValue)
        let disabled = this.state.validatorAnswer !== this.state.validatorValue;
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Subject</Form.Label>
                    <Form.Control type="text" placeholder="Enter Subject" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Your Message</Form.Label>
                    <Form.Control as="textarea" rows="3"/>
                </Form.Group>
                <Form.Group
                    onChange={this.updateValidatorAnswer}
                >
                    <div id="captcha-number"></div>
                    <Form.Control
                        type="number"
                        placeholder="Enter Value"
                    />
                    { valid ? "" : (
                        <Form.Text className="text-muted text-danger">Please enter correct value</Form.Text>
                    )}
                </Form.Group>
                <Button variant={disabled ? "secondary" : "primary"} type="submit" disabled={disabled}>
                    Submit
                </Button>
            </Form>
        )
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={6}>
                        <Card className={"card-supports"}>
                            <Card.Header>Contact Us</Card.Header>
                            <Card.Body>
                            {this.renderContact()}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                    <Card className={"card-supports"}>
                        <Card.Header>Frequently Asked Questions</Card.Header>
                        <Card.Body>
                            {this.renderFaq()}
                        </Card.Body>
                        <Card.Header>Glossary</Card.Header>
                        <Card.Body>
                            <Col md={12}>
                            <table>
                                <tbody>
                                    {this.renderGlossary()}
                                </tbody>
                            </table>
                            </Col>
                        </Card.Body>
                    </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Support;
