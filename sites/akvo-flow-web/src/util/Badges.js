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
    return (
        <span data-tip={question.help.text} className={"help-tooltip"}>
            <FaInfoCircle color="#007bff"/>
        <ReactTooltip className="tooltips" effect="solid"/>
        </span>
    )
}
