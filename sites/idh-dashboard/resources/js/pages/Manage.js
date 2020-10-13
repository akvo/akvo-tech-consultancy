import React, { Component, Fragment } from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Form, Button, Alert, Jumbotron, Card, Accordion, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { flatFilters, initialNotification } from '../data/utils.js';
import { searchUser, accessUser } from "../data/api";
import intersectionBy from "lodash/intersectionBy";

const initialPropsForm = [
    {
        id:0,
        access:0//0 revoke,1 read,2 full access
    }
];

class Manage extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handleAccess = this.handleAccess.bind(this);
        this.renderForms = this.renderForms.bind(this);
        this.renderCountries = this.renderCountries.bind(this);
        this.searchEmail = this.searchEmail.bind(this);
        this.state = {
            error: "",
            messages: {
                user: {type:"success", message:""},
            },
            notification: initialNotification,
            user: {
                email:"",
                forms:[],
            },
        };
    }

    handleEmail(e) {
        let value = e.target.value;
        this.setState((prevState) => (
            {...prevState, user: {email: value, forms:prevState.user.forms}}
        ));
    }

    handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        if (token === null) {
            return;
        }
        accessUser(token, this.state.user).then(res => {
            this.setState({notification:res});
            setTimeout(() => {
                this.setState({notification:initialNotification})
            }, 3000)
        });
    }

    handleAccess(id, access) {
        let user = this.state.user;
        let forms = user.forms;
            forms = forms.filter(x => x.id !== id);
            forms = [...forms, {id:id, access: access}];
        this.setState({user: {email: user.email, forms: forms}});
    }

    searchEmail() {
        if (this.state.user.email === "") {
            return;
        }
        const token = localStorage.getItem("access_token");
        if (token === null) {
            return;
        }
        searchUser(token, this.state.user.email).then(res => {
            let forms = res.forms.map(x => ({
                id: x.form_id,
                access: x.download + 1,
            }));
            this.setState({
                messages: {...this.state.messages, user: res},
                user: {...this.state.user, forms: forms}
            });
        });
    }

    renderForms(country, ix) {
        return country.childrens.map((c, i) => {
            let access = 0;
            let form = this.state.user.forms.find(x => x.id === c.id);
            if (form){
                access = form.access;
            }
            return (
            <Accordion.Collapse eventKey={ix.toString()} key={i}>
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            {c.company}
                        </Col>
                        <Col md={8} className={"text-right"}>
                            <Form.Check
                                onChange={e => this.handleAccess(c.id, 0)}
                                inline
                                type="radio"
                                name={"company-" + c.id}
                                label="None"
                                defaultChecked={access === 0}
                            />
                            <Form.Check
                                onChange={e => this.handleAccess(c.id, 1)}
                                inline
                                type="radio"
                                name={"company-" + c.id}
                                label="View"
                                checked={access === 1}/>
                            <Form.Check
                                onChange={e => this.handleAccess(c.id, 2)}
                                inline
                                type="radio"
                                name={"company-" + c.id}
                                label="Full Access"
                                checked={access === 2}/>
                        </Col>
                    </Row>
                </Card.Body>
            </Accordion.Collapse>
            )
        });
    }

    renderCountries(countries) {
        return countries.map((x, i) => (
            <Fragment key={i}>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey={i.toString()}>
                    <FontAwesomeIcon className="mr-2" icon={["fas", "plus-circle"]} /> {x.name}
                </Accordion.Toggle>
                {this.renderForms(x, i)}
            </Fragment>
        ));
    }

    render() {
        let error = this.state.error === "" ? false : this.state.error;
        let user = this.props.value.user;
        let access = user.forms;
            access = access.map(x => {
                return {...x, id: x.form_id};
            });
        let source = this.props.value.page.filters.map(x => {
            return {
                ...x,
                childrens: intersectionBy(x.childrens, access, 'id'),
            }
        });
        source = source.filter(x => x.childrens.length > 0);
        let notification = this.state.notification;
        let updated = this.state.user;
        if (user.role !== "admin") {
            return <Redirect to="/not-found" />;
        }
        return (
            <>
                <Jumbotron>
                    <Row className="page-header">
                        <Col md={12} className="page-title text-center">
                            <h2>{user.login ? "Welcome " + user.name : "Not Found"}!</h2>
                        </Col>
                    </Row>
                </Jumbotron>
                <div className="page-content has-jumbotron">
                    {notification.active ? (
                        <Row className="justify-content-md-center">
                        <Col md={10}>
                        <Alert
                            variant={notification.variant}
                            onClose={() => this.setState({ notification: {...notification, active: false} })}
                            dismissible>
                            {notification.message}
                        </Alert>
                        </Col>
                        </Row>
                    ) : ("")}
                    <Row className="justify-content-md-center">
                        <Col md={4}>
                            <Card>
                                <Form>
                                <Card.Header>Email Address</Card.Header>
                                <Card.Body>
                                    <InputGroup>
                                        <Form.Control
                                            type="email"
                                            placeholder="(e.g. john@mail.com)"
                                            onChange={this.handleEmail}
                                        />
                                        <InputGroup.Append>
                                            <InputGroup.Text onClick={e => this.searchEmail()}>Search</InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                     <Form.Text
                                        className={"text-" + this.state.messages.user.type}
                                     >{this.state.messages.user.message}
                                     </Form.Text>
                                </Card.Body>
                                </Form>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Accordion>
                            <Card>
                                <Card.Header>Access</Card.Header>
                                {this.renderCountries(source)}
                                <Card.Footer>
                                    <Form onSubmit={this.handleSubmit}>
                                     <Button variant="primary" type="submit" block>
                                         Update
                                     </Button>
                                    </Form>
                                </Card.Footer>
                            </Card>
                            </Accordion>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Manage);
