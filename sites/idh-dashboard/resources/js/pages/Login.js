import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Route, Redirect } from "react-router-dom";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { login } from "../data/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import JumbotronWelcome from '../components/JumbotronWelcome';
import axios from "axios";

class Login extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.resendVerification = this.resendVerification.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.state = {
            error: "",
            verify: false,
            formSubmitting: false,
            user: {
                email: "",
                password: "",
            },
        };
    }

    resendVerification(e) {
        e.preventDefault();
        console.log(this.state.user.email);
    }

    handleRegister(e) {
        e.preventDefault();
        window.open("/register");
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ formSubmitting: true });
        login(this.state.user)
            .then((res) => {
                this.props.user.login(res);
                localStorage.setItem("access_token", res.access_token);
            })
            .catch((err) => {
                this.setState({ error: err.error, verify: err.verify});
                localStorage.removeItem("access_token");
                this.props.user.logout();
            });
    }

    handleEmail(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: { ...prevState.user, email: value },
        }));
    }

    handlePassword(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: { ...prevState.user, password: value },
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
                                <Card.Header>Login</Card.Header>
                                <Card.Body>
                                    <Form onSubmit={this.handleSubmit}>
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
                                        <Form.Group controlId="formBasicCheckbox">
                                            <Form.Check type="checkbox" label="Remember Login" />
                                        </Form.Group>
                                        <Row>
                                            <Col md={7}>
                                                <Button variant="success" type="submit">
                                                    Submit
                                                </Button>
                                            </Col>
                                            <Col md={5} className="text-right">
                                                <Link to="/forgot_password">
                                                <FontAwesomeIcon className="mr-2" icon={["fas", "key"]} />
                                                Forgot Password
                                                </Link>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                                <Card.Footer>
                                    Don't have any account?
                                    <span onClick={e => this.handleRegister(e)} className="span-link">
                                        Register
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
