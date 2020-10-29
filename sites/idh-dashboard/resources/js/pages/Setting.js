import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Form, Button, Alert, Card, ListGroup } from "react-bootstrap";
import { updateUser } from "../data/api";
import { flatFilters, initialNotification } from '../data/utils.js';
import intersectionBy from "lodash/intersectionBy";
import JumbotronWelcome from "../components/JumbotronWelcome";

class Setting extends Component {
    constructor(props) {
        super(props);
        this.handleOldPassword = this.handleOldPassword.bind(this);
        this.handleNewPassword = this.handleNewPassword.bind(this);
        this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            error: "",
            notification: initialNotification,
            user: {
                old_password: "",
                new_password: "",
                confirm_password: "",
            },
            validated :false,
            setValidated: false
        };
    }

    handleOldPassword(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: { ...prevState.user, old_password: value },
        }));
    }

    handleNewPassword(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: { ...prevState.user, new_password: value },
        }));
    }

    handleConfirmPassword(e) {
        let value = e.target.value;
        this.setState((prevState) => {
            if (prevState.user.new_password !== value) {
                return { user: { ...prevState.user, confirm_password: value }, error: "Password didn't match" };
            }
            return { user: { ...prevState.user, confirm_password: value }, error: "" };
        });
    }

    handleSubmit(e) {
        const form = e.currentTarget;
        const validated = form.checkValidity();
        if (!validated) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (validated) {
            e.preventDefault();
            const token = localStorage.getItem("access_token");
            if (token !== null) {
                let credentials= {
                    password: this.state.user.old_password,
                    new_password: this.state.user.new_password
                }
                updateUser(token, credentials)
                    .then(res => {
                        this.setState({notification:res});
                        setTimeout(() => {
                            this.setState({notification:initialNotification})
                        }, 3000)
                    });
            }
        }
        this.setState({validated: true});
    }

    render() {
        let error = this.state.error === "" ? false : this.state.error;
        let user = this.props.value.user;
        let source = flatFilters(this.props.value.page.filters);
        let access = user.forms;
            access = access.map(x => {
                return {...x, id: x.form_id};
            });
            source = intersectionBy(source, access, 'id');
        let notification = this.state.notification;
        let updated = this.state.user;
        return (
            <>
                <JumbotronWelcome text={user.login ? "Welcome" + user.name : "Page Not Found"}/>
                <div className="page-content has-jumbotron">
                    {notification.active ? (
                        <Row className="justify-content-md-center">
                        <Col md={user.role === "user" ? 10 : 6}>
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
                        <Col md={user.role === "user" ? 6 : 6}>
                            <Card>
                            <Card.Header>Change Password</Card.Header>
                            <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                            <Card.Body>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder={user.email} readOnly />
                                    <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword" onChange={this.handleOldPassword}>
                                    <Form.Label>Old Password</Form.Label>
                                    <Form.Control type="password" placeholder="Old Password" required />
                                </Form.Group>
                                <Form.Group controlId="formBasicNewPassword" onChange={this.handleNewPassword}>
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control type="password" placeholder="New Password" required />
                                    <Form.Control.Feedback type="invalid">
                                        Password didn't match
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                    controlId="formBasicConfirmPassword"
                                    onChange={this.handleConfirmPassword}
                                >
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Confirm Password" required />
                                    <Form.Control.Feedback type="invalid">
                                        Password didn't match
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="primary" type="submit" block>
                                    Update
                                </Button>
                            </Card.Footer>
                            </Form>
                            </Card>
                        </Col>
                        { user.role === "user" ? (
                            <Col md={4}>
                                <Card>
                                    <Card.Header>{user.role !== "user" ? "Role" : "Access"}</Card.Header>
                                        <ListGroup variant="flush">
                                        { source.map((x, i) => (
                                            <ListGroup.Item key={"access-"+x.id}>
                                                {i+1}. {x.name} / {x.company}
                                            </ListGroup.Item>
                                        ))}
                                        </ListGroup>
                                </Card>
                            </Col>
                        ) : "" }
                    </Row>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
