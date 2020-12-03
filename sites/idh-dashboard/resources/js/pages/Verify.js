import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Button, Alert } from "react-bootstrap";
import JumbotronWelcome from "../components/JumbotronWelcome";
import axios from "axios";

class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verified: false,
            message: false,
            redirect: false,
            user: {
                id: 0,
                name: "Loading"
            }
        };
    }

    componentDidMount() {
        let params = this.props.match.params;
        axios
            .post("/api/verify", { token: params.verifyToken },
                {
                    headers: {
                        Accept: "application/json"
                    }
                }
            )
            .then(res => {
                this.setState({verified: true, message: res.data.message});
                setTimeout(() => {
                    this.setState({redirect: true})
                }, 3000)
            })
            .catch(err => {
                this.setState({verified: true, message: err.data.message});
            });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/login" />;
        }
        return (
            <Fragment>
                <JumbotronWelcome text={false} />
                <div className="page-content has-jumbotron">
                    <Row className="justify-content-md-center">
                        <Col md={6} className="text-center">
                            {this.state.verified ? (
                                <Alert variant={"success"} dismissible>
                                    {this.state.message}
                                </Alert>
                            ) : "Verifying"}
                            {this.state.verified ? (<strong>Redirect to Login Page</strong>) : ""}
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
