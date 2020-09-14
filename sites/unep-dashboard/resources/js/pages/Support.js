import React, { Component } from "react";
import { Col, Row, Container, Card, Form, Button } from "react-bootstrap";
import axios from 'axios';

const contents = [{
        q: "What data is represented in the dashboard and the repository?",
        a: <p>The data has been mainly collected through an online stocktaking survey. More details on the set up of the survey can be found <a href="https://papersmart.unon.org/resolution/uploads/guidelines_for_marine_plastic_litter_stocktake_survey_2_hs1.pdf" target="_blank">here</a></p>,
        list: false,
    },{
        q: "Why is there an interactive dashboard and an online repository platform?",
        a: "To enable access to the stocktake of global actions to reduce the flow of marine plastic and microplastic to the oceans for public use, two products have been developed. The dashboard aims to visually summarise the survey results, whereas the main goal of the repository is to store additional information on each individual action.",
        list: ["You are currently visiting the interactive dashboard. The dashboard contains all survey submissions. The aim of the dashboard is to visually represent the survey data on a number of key attributes. The dashboard also allows for comparison on country/region level and downloading of the visuals.","The online repository platform can be accessed here. The repository contains all survey submissions and narrative submissions. A number of custom filters can be applied to search for individual actions. Thereon, users can visit pages of individual actions to read a summary and access additional information on each action, such as reports in PDF format or corresponding websites."]
    },{
        q: "Who are the dashboard and the repository for?",
        a: "The dashboard and repository are both publicly available. Anyone with an interest in the global actions to reduce the flow of marine plastic and microplastic to the oceans. Users can for example be policy makers, researchers, students.",
        list: false,
    },{
        q: "When are the dashboard and the repository built?",
        a: "The project of building the dashboard and the repository started at the end of 2019 and both products have been published online in September 2020.",
        list: false,
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
                {x.list ? (<ul>{x.list.map((l,il) => <li key={il}>{l}</li>)}</ul>) : ""}
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
