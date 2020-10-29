import React, { Component } from 'react';
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { register } from "../data/api";
import JumbotronWelcome from "../components/JumbotronWelcome";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            error: "",
            verify: false,
            formSubmitting: false,
            user: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            },
        };
    }

    handleLogin(e) {
        e.preventDefault();
        window.open("/login");
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        register(this.state.user)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(res);
            });
    }

    handleEmail(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: { ...prevState.user, email: value },
        }));
    }

    handleFirstName(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: { ...prevState.user, firstName: value },
        }));
    }

    handleLastName(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: { ...prevState.user, lastName: value },
        }));
    }

    handlePassword(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: { ...prevState.user, password: value },
        }));
    }

    handleMatchPassword(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: { ...prevState.user, confirmPassword: value },
        }));
    }


    render() {
        let error = this.state.error === "" ? false : this.state.error;
        let user = this.props.value.user;
        if (user.login) {
            return <Redirect to="/" />;
        }
        return (
            <>
                <JumbotronWelcome text={false}/>
                <div className="page-content has-jumbotron">
                    <Row className="justify-content-md-center">
                        <Col md={6}>
                            {error ? (
                                <Alert variant={"danger"} onClose={() => this.setState({ error: "" })} dismissible>
                                    {this.state.error}
                                    {this.state.verify ? (
                                        <span onClick={e => this.resendVerification(e)} className="span-link">
                                            Resend email verification
                                        </span>
                                    ) : ""}
                                </Alert>
                            ) : (
                                ""
                            )}
                            <Card>
                                <Card.Header>Register</Card.Header>
                                <Card.Body>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group controlId="formBasicFirstName" onChange={this.handleFirstName}>
                                                    <Form.Label>First Name</Form.Label>
                                                    <Form.Control type="text" placeholder="First Name" />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group controlId="formBasicLastName" onChange={this.handleLastName}>
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Last Name" />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group controlId="formBasicEmail" onChange={this.handleEmail}>
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control type="email" placeholder="Enter email" />
                                            <Form.Text className="text-muted">
                                            We'll never share your email with anyone else.
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group controlId="formBasicPassword" onChange={this.handlePassword}>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" />
                                        </Form.Group>
                                        <Form.Group controlId="formBasicConfirmPassword" onChange={this.handleMatchPassword}>
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control type="password" placeholder="Confirm Password" />
                                        </Form.Group>
                                        <Row>
                                        <Col md={12}>
                                            <Button variant="success" type="submit">
                                                Register
                                            </Button>
                                        </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                                <Card.Footer>
                                    Already have account?
                                    <span onClick={e => this.handleLogin(e)} className="span-link">
                                        Login
                                    </span>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
