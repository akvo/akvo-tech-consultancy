import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Form, Button, Alert, Jumbotron } from "react-bootstrap";
import { login } from "../data/api";
import axios from "axios";

class Login extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.state = {
            error: "",
            formSubmitting: false,
            user: {
                email: "",
                password: "",
            },
        };
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
                this.setState({ error: err.error });
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

    componentDidMount() {
        let access_token = localStorage.getItem("access_token");
        if (access_token !== null){
            localStorage.removeItem("access_token");
            this.props.page.compare.reset();
            this.props.user.logout();
        }
    }

    render() {
        let error = this.state.error === "" ? false : this.state.error;
        let user = this.props.value.user;
        return (
            <>
                <Jumbotron>
                    <Row className="page-header">
                        <Col md={12} className="page-title text-center">
                            <h2>Welcome {user.login ? user.name : "to IDH Dataportal"}!</h2>
                        </Col>
                    </Row>
                </Jumbotron>
                <div className="page-content has-jumbotron">
                    <Row className="justify-content-md-center">
                        <Col md={6}>
                            {error ? (
                                <Alert variant={"danger"} onClose={() => this.setState({ error: "" })} dismissible>
                                    {this.state.error}
                                </Alert>
                            ) : (
                                ""
                            )}
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="formBasicEmail" onChange={this.handleEmail}>
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email"/>
                                    <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword" onChange={this.handlePassword}>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password"/>
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Remember Login"/>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
