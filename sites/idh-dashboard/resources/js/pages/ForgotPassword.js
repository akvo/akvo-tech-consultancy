import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Row, Col, Button, Card, Form, Alert } from "react-bootstrap";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import JumbotronWelcome from "../components/JumbotronWelcome";
import { forgot, updatePassword } from "../data/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleMatchPassword = this.handleMatchPassword.bind(this);
        this.state = {
            error: false,
            errors: {
                password: false,
            },
            message: false,
            varify: false,
            user: {
                email: "",
                password: "",
                password_confirmation: "",
                token: false
            },
            redirect: false,
            disable_submit: false,
            create_new_password: false
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({disable_submit:true});
        if (this.state.create_new_password) {
            updatePassword(this.state.user)
                .then((res) => {
                    this.setState({...res, error:false});
                    setTimeout(() => {
                        this.setState({redirect:true});
                    }, 3000);
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({...err, error: true, disable_submit: false});
                });
            return;
        }
        forgot(this.state.user)
            .then((res) => {
                this.setState({...res, error:false, disable_submit: false});
                setTimeout(() => {
                    this.setState({redirect:true});
                }, 3000);
            })
            .catch((err) => {
                this.setState({...err, error: true, disable_submit: false});
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

    handleMatchPassword(e) {
        let value = e.target.value;
        this.setState((prevState) => ({
            user: { ...prevState.user, password_confirmation: value },
        }));
    }

    renderErrors(errors, errorType) {
        if (errorType === "confirm") {
            errors = errors.filter(x => x.includes("match"));
        }
        if (errorType === "password") {
            errors = errors.filter(x => !x.includes("match"));
            errors = errors.map((x) => {
                x = x.includes("invalid") ? "The password must contains Uppercase, lowercase and numeric value" : x;
                return x;
            })
        }
        return errors.map(x => (
            <Form.Text key={x} className="text-danger">
                {x}
            </Form.Text>
        ));
    }

    componentDidMount() {
        let params = this.props.match.params;
        if (params.verifyToken !== undefined) {
            this.setState({create_new_password: true, user:{...this.state.user, token: params.verifyToken}});
        }
    }

    renderErrors(errors, errorType) {
        if (errorType === "confirm") {
            errors = errors.filter(x => x.includes("match"));
        }
        if (errorType === "password") {
            errors = errors.filter(x => !x.includes("match"));
            errors = errors.map((x) => {
                x = x.includes("invalid") ? "The password must contains Uppercase, lowercase and numeric value" : x;
                return x;
            })
        }
        return errors.map(x => (
            <Form.Text key={x} className="text-danger">
                {x}
            </Form.Text>
        ));
    }


    render() {
        let message = this.state.message;
        let new_password = this.state.create_new_password;
        if (this.state.redirect) {
            return (
                <Redirect to="/login" />
            );
        }
        return (
            <Fragment>
                <JumbotronWelcome text={false}/>
                <div className="page-content has-jumbotron">
                    <Row className="justify-content-md-center">
                        <Col md={6}>
                            {this.state.error ? (
                                <Alert variant={"danger"} onClose={() => this.setState({ error: false })} dismissible>
                                    {this.state.message}
                                </Alert>
                            ) : (
                                ""
                            )}
                            {this.state.verify ? (
                                <Alert variant={"success"} onClose={() => this.setState({ verify: false })} dismissible>
                                    {this.state.message}
                                </Alert>
                            ) : ""}
                            <Card>
                                <Card.Header>{new_password ? "Create New" : "Forgot"} Password</Card.Header>
                                <Card.Body>
                                        <Form onSubmit={this.handleSubmit}>
                                            {new_password ? (
                                                <>
                                                <Form.Group controlId="formBasicPassword" onChange={this.handlePassword}>
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control type="password" placeholder="Password" />
                                                    {this.state.errors.password
                                                        ? this.renderErrors(this.state.errors.password, "password")
                                                        : ""}
                                                </Form.Group>
                                                <Form.Group controlId="formBasicConfirmPassword" onChange={this.handleMatchPassword}>
                                                    <Form.Label>Confirm Password</Form.Label>
                                                    <Form.Control type="password" placeholder="Confirm Password" />
                                                    {this.state.errors.password
                                                        ? this.renderErrors(this.state.errors.password, "confirm")
                                                    : ""}
                                                </Form.Group>
                                                </>
                                            ) : (
                                                <Form.Group controlId="formBasicEmail" onChange={this.handleEmail}>
                                                    <Form.Label>Email address</Form.Label>
                                                    <Form.Control type="email" placeholder="Enter email" />
                                                    <Form.Text className="text-muted">
                                                    We'll never share your email with anyone else.
                                                    </Form.Text>
                                                </Form.Group>
                                            )}
                                            <Button
                                                    variant={new_password ? "success" : "primary"}
                                                    type="submit"
                                                    disabled={this.state.disable_submit}
                                            >
                                                {this.state.disable_submit ? (
                                                    <FontAwesomeIcon className="mr-2" icon={["fas", "spinner"]} spin={true}/>
                                                ) : ""}
                                                {new_password ? "Update Password" : "Send Email"}
                                            </Button>
                                        </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
