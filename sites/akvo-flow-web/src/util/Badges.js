import React, { Component } from "react";
import { Button } from "reactstrap";
import {
    FaExclamationTriangle,
    FaCheckCircle,
    FaInfoCircle,
    FaTimesCircle,
} from "react-icons/fa";

export const Mandatory = answered => {
    if (answered) {
        return <FaCheckCircle color="green" className="float-right" />;
    } else {
        return <FaExclamationTriangle color="red" className="float-right" />;
    }
};

class ToolTip extends Component {

    constructor(props) {
        super(props);
        this.showToolTip = this.showToolTip.bind(this);
        this.state = {show: false};
    }

    showToolTip(e) {
        e.preventDefault();
        this.setState({
            show: (this.state.show ? false : true)
        });
    }

    render() {
        let hasUnit = false;
        let notEmpty = true;
        let question = this.props.question.help.text;
        notEmpty = question !== null
        hasUnit = !notEmpty
            ? false
            : (question.includes("##UNIT##")
                ? (question.split("##UNIT##").length === 1
                    ? true
                    : false
                )
                : false);
        if (notEmpty && !hasUnit) {
            question = question.includes("##UNIT##") ? question.split("##UNIT##")[0] : question;
            if (question === "") {
                return "";
            }
            return (
                <div>
                    <Button
                        className="more-info"
                        size="sm"
                        outline={this.state.show}
                        color={this.state.show ? "secondary" : "primary"}
                        onClick={e => this.showToolTip(e)}
                    >
                        {this.state.show ? <FaTimesCircle/> : <FaInfoCircle/>} more info
                    </Button>
                    <div
                        dangerouslySetInnerHTML={{__html: question}}
                        className={this.state.show ? "more-info-content" : "hidden"}
                    />
                </div>
            )
        }
        return "";
    }
}

export default ToolTip;
