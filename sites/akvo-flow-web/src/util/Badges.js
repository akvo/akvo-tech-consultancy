import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps } from "../reducers/actions.js";
import {
    FaExclamationTriangle,
    FaCheckCircle,
    FaInfoCircle,
    FaTimesCircle,
} from "react-icons/fa";
import isoLangs from './Languages.js'

export const Mandatory = answered => {
    if (answered) {
        return (
            <div className="mandatory-icon">
                <FaCheckCircle color="green" className="float-right" />
            </div>
        );
    }
    return (
        <div className="mandatory-icon">
            <FaExclamationTriangle color="red" className="float-right" />
        </div>
    );
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
        if (!this.props.tooltips) {
            return "";
        }
        let localization = this.props.value.lang.active;
        let tooltips = this.props.tooltips;
        localization = localization.map((x) => {
            let active = tooltips[x] === undefined ? "" : tooltips[x];
            return active;
        });
        localization = localization.filter(x => x !== "");
        localization = localization.map((x,i) => {
            let activeLang = i !== 0
                ? ("<b>" + isoLangs[this.props.value.lang.active[i]].nativeName + ": </b>")
                : "";
            let extraClass = i !== 0 ? "class='trans-lang-ttp'" : "";
            return "<span " + extraClass + ">" + activeLang + x + "</span>";
        });
        localization = localization.length === 0 ? tooltips.en : localization.join("");
        return (
            <div>
                <button
                    className={ "more-info " + (this.state.show ? "more-info-active" : "")}
                    onClick={e => this.showToolTip(e)}
                >
                    {this.state.show ? <FaTimesCircle/> : <FaInfoCircle/>} more info
                </button>
                <div
                    dangerouslySetInnerHTML={{__html: localization}}
                    className={this.state.show ? "more-info-content" : "hidden"}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps)(ToolTip);
