import { connect } from "react-redux";
import { mapStateToProps } from "../reducers/actions.js";
import React, { Component } from "react";
import Loading from "../util/Loading";
import Error from "../util/Error";
import { FaEye, FaQuestion, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

class GroupHeaders extends Component {
    constructor(props) {
        super(props);
        this.getHeader = this.getHeader.bind(this);
        this.getLoading = this.getLoading.bind(this);
    }

    getHeader = groups => {
        let active = groups.list.filter(g => g.index === groups.active);
        return active.map((group, index) => (
            <nav className="navbar navbar-expand-lg navbar-light navbar-group bg-light border-bottom" key={"ghead-" + index}>
                <div className="col-md-4 header-left">
                    <h4 className="mt-2">{group.heading}</h4>
                </div>
                <div className="col-md-8 text-right">
                    <div className="badge-header">
                        <div className={"badge badge-left badge-secondary"}>
                            <FaQuestion /> Questions
                        </div>
                        <div className={"badge badge-right badge-primary"}>{group.attributes.questions}</div>
                    </div>
                    <div className="badge-header">
                        <div className={"badge badge-left badge-secondary"}>
                            <FaCheckCircle /> Answers
                        </div>
                        <div className={"badge badge-right badge-green"}>{group.attributes.answers}</div>
                    </div>
                    <div className="badge-header">
                        <div className={"badge badge-left badge-secondary"}>
                            <FaExclamationTriangle /> Mandatory
                        </div>
                        <div className={"badge badge-right badge-red"}>{group.attributes.mandatories}</div>
                    </div>
                    <div className="badge-header">
                        <div className={"badge badge-left badge-secondary"}>
                            <FaEye /> Hiddens
                        </div>
                        <div className={"badge badge-right badge-info"}>{group.attributes.hiddens}</div>
                    </div>
                </div>
            </nav>
        ));
    };

    getLoading = () => {
        if (this.props.value.error) {
            return (<Error styles={"header-loading"} />);
        }
        return (<Loading styles={"header-loading"} />);
    }

    render() {
        return this.props.value.questions.length === 1 ? this.getLoading() : this.getHeader(this.props.value.groups);
    }
}

export default connect(mapStateToProps)(GroupHeaders);
