import React, { Component, Fragment } from "react";
import { Col, Row, Container, Card, Form, Button, ResponsiveEmbed } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { qna, links, glossary } from '../data/static/content-support.js';
import { validateEmail } from '../data/utils.js';

const API = process.env.MIX_PUBLIC_URL + "/api/";
const defaultState = {
    validatorAnswer: "",
    validatorValue: -1,
    mailing: {
        subject: "",
        from: "",
        message: ""
    },
    warning:'',
    emailsent: false,
    sending:false
}

class Support extends Component {
    constructor(props) {
        super(props);
        this.renderFaq = this.renderFaq.bind(this);
        this.renderGlossary = this.renderGlossary.bind(this);
        this.renderContact = this.renderContact.bind(this);
        this.updateValidator = this.updateValidator.bind(this);
        this.updateValidatorAnswer = this.updateValidatorAnswer.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = defaultState;
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
        return qna.map((x, i) => (
            <Col key={"faq-" + i} md={12}>
                <strong>{i + 1}. {x.q}</strong><br/><br/>
                {x.a}
                {x.l ? (<ul>{x.l.map((l,il) => <li key={il}>{l}</li>)}</ul>) : ""}
                {i <qna.length - 1? (<hr/>) : ""}
            </Col>
        ))
    }

    renderGlossary() {
        return glossary.map((x, i) => (
            <tr key={"glossary-" + i}>
                <td width={"40%"}><strong>{x.c}</strong>:</td>
                <td>{x.m}</td>
            </tr>
        ))

    }

    handleChange(event) {
        let mailing = this.state.mailing;
            mailing = {...mailing, [event.target.id]:event.target.value}
        this.setState({mailing:mailing});
    }

    handleSubmit() {
        this.setState({sending:true});
        let mailing = this.state.mailing;
        let warning = [];
        let send = true;
        if (mailing.from === '') {
            warning = ["Email Address"];
        }
        if (mailing.from !== '' && validateEmail(mailing.from) === false) {
            warning = ["Email Address format is incorrect"];
        }
        if (mailing.subject === '') {
            warning = [...warning, "Subject"];
        }
        if (mailing.message === '') {
            warning = [...warning, "Message"];
        }
        if (warning.length > 0) {
            send = false;
            warning = warning.join(', ') + ' cannot be empty.';
            this.setState({warning: warning, sending:false})
        }
        if (send) {
            let formData = new FormData();
            let token = document.querySelector('meta[name="csrf-token"]').content;
            formData.set('email', mailing.from);
            formData.set('subject', mailing.subject);
            formData.set('message', mailing.message);
            axios.post(API + 'send-email', formData, {'Content-Type':'multipart/form-data', 'X-CSRF-TOKEN': token})
                .then(res => {
                    this.setState({emailsent:true});
                    if (res.data.sent) {
                        setTimeout(() => {
                            this.setState(defaultState);
                            const captcha = document.getElementById("captcha-number");
                            captcha.removeChild(captcha.childNodes[0]);
                            this.updateValidator();
                        }, 5000);
                    }
                }).catch(err => {
                    this.setState({sending:false});
                    this.setState({warning: "Internal Server Error"});
                });
            console.log(mailing);
        }
    }

    componentDidMount() {
        this.updateValidator();
    }

    renderContact() {
        let valid = this.state.validatorAnswer === 0
            ? true
            : (this.state.validatorAnswer === this.state.validatorValue)
        let disabled = this.state.validatorAnswer !== this.state.validatorValue || this.state.sending;
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        id="from"
                        onChange={this.handleChange}
                        value={this.state.mailing.from}/>
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                        type="text"
                        id="subject"
                        placeholder="Enter Subject"
                        onChange={this.handleChange}
                        value={this.state.mailing.subject}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Your Message</Form.Label>
                    <Form.Control
                        as="textarea"
                        id="message"
                        rows="3"
                        onChange={this.handleChange}
                        value={this.state.mailing.message}/>
                </Form.Group>
                <Form.Group>
                    <div id="captcha-number"></div>
                    <Form.Control
                        type="number"
                        placeholder="Enter Value"
                        onChange={this.updateValidatorAnswer}
                        value={this.state.validatorAnswer}/>
                    { valid ? "" : (
                        <Form.Text className="text-muted text-danger">Please enter correct value</Form.Text>
                    )}
                </Form.Group>
                <Button
                    variant={disabled ? "secondary" : "primary"}
                    onClick={e => this.handleSubmit()}
                    disabled={disabled}>
                    {this.state.sending ? (
                        <Fragment>
                        <FontAwesomeIcon
                            className="fas-icon"
                            spin={true}
                            icon={["fas", "spinner"]} />
                            Submitting
                        </Fragment>
                    ) : "Submit"}
                </Button>
                <hr/>
                { this.state.warning !== ""
                    ? (<Form.Text className="text-danger">{this.state.warning}</Form.Text>)
                    : ""
                }
            </Form>
        )
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={8}>
                    <Card className={"card-supports"}>
                        <Card.Header>Frequently Asked Questions</Card.Header>
                        <Card.Body>
                            {this.renderFaq()}
                        </Card.Body>
                        <Card.Header>Use of Dashboard</Card.Header>
                        <Card.Body >
                            <ResponsiveEmbed aspectRatio="16by9">
                                <iframe
                                src={links.videoDemo}
                                className="embed-responsive-item"
                                allow="fullscreen"
                                >
                                </iframe>
                            </ResponsiveEmbed>
                        </Card.Body>
                        <Card.Header>Glossary</Card.Header>
                        <Card.Body>
                        <Col md={12}>
                            <table className="vertical-align-top">
                                <tbody>
                                    {this.renderGlossary()}
                                </tbody>
                            </table>
                        </Col>
                        </Card.Body>
                    </Card>
                    </Col>
                    <Col md={4} className="card-fixed">
                        <Card className={"card-supports"}>
                            <Card.Header>Contact Us</Card.Header>
                            <Card.Body>
                            { this.state.emailsent ? (
                                <div className="alert alert-success">
                                    <strong>Your message has been successfully sent!</strong>
                                </div>
                            ) : "" }
                            {this.renderContact()}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Support;
