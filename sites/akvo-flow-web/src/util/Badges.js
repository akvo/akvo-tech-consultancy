import React from "react";
import ReactTooltip from "react-tooltip";
import {
    FaExclamationTriangle,
    FaCheckCircle,
    FaInfoCircle,
} from "react-icons/fa";

export const Mandatory = answered => {
    if (answered) {
        return <FaCheckCircle color="green" className="float-right" />;
    } else {
        return <FaExclamationTriangle color="red" className="float-right" />;
    }
};

export const ToolTip = (question) => {
    let tid = 'tooltip-' + question.id;
    question = question.help.text;
    if (question !== null) {
        question = "<div class='tooltip-short'>" + question + "</div>";
        return (
            <span data-tip={question} data-for={tid} className={"help-tooltip"}>
                <FaInfoCircle color="#007bff"/>
                <ReactTooltip id={tid} className="tooltips" effect="solid" multiline={true} html={true} clickable={true} delayHide={300}/>
            </span>
        );
    }
    return "";
}
