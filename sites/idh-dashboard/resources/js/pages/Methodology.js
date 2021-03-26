import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { auth } from "../data/api.js";
import { Redirect } from "react-router-dom";

class Methodology extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
    }

    componentDidMount() {
        const token = localStorage.getItem("access_token");
        if (token === null) {
            this.props.user.logout();
            this.setState({ redirect: true });
        }
        if (token) {
            auth(token).then(res => {
                const { status, message } = res;
                if (status === 401) {
                    this.props.user.logout();
                    this.setState({ redirect: true });
                }
                return res;
            });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/login" />;
        }
        return (
            <Fragment>
                <iframe
                    src={
                        "/files/IDH Farmfit Primary Data Collection Methodology Dec 11 2020 updated.pdf"
                    }
                    style={{ overflow: "hidden !important" }}
                    frameBorder={0}
                    width={"100%"}
                    height={"916px"}
                ></iframe>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Methodology);
