import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps } from "../reducers/actions.js";
//import { PROD_URL } from '../util/Environment'
import QuestionType from "./QuestionType.js";
import GroupPanels from "./GroupPanels.js";
import ToolTip, { Mandatory } from "../util/Badges";
import { Card, CardBody, CardTitle } from "reactstrap";
import { validateMinMax, validateDoubleEntry } from '../util/Utilities.js'
import { colorPallet } from '../util/Themes.js'
import "../App.css";

class Questions extends Component {
    constructor(props) {
        super(props);
        this.getForms = this.getForms.bind(this);
        this.isJsonString = this.isJsonString.bind(this);
        this.renderMandatoryIcon = this.renderMandatoryIcon.bind(this);
        this.renderCachedImage = this.renderCachedImage.bind(this);
        this.renderQuestion = this.renderQuestion.bind(this);
    }

    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    renderQuestion(qid, question) {
        return <QuestionType key={"question-type-" + qid} data={question}/>;
    }

    renderCachedImage(qid) {
        return ""
    }

    renderMandatoryIcon(qid, question) {
        let answered = false;
        let answer = localStorage.getItem(qid);
        if (localStorage.getItem(qid)) {
            answered = true;
        }
        if (answered && question.type === "cascade") {
            answer = JSON.parse(answer);
            let cascadeIsArray = Array.isArray(question.levels.level);
            let levels = cascadeIsArray ? question.levels.level.length : 1;
            answered = answer.length === levels;
            return Mandatory(answered);
        }
        answered = validateMinMax(answer, question) !== null;
        answered = answered ? validateDoubleEntry(answer, question) !== null : answered;
        return Mandatory(answered);
    }

    getForms(questions) {
        let active_group = this.props.value.groups.active;
        let total_active = questions.filter(x => x.group === active_group)
        total_active = total_active.reduce((a, x, i) => {
                let z = 0;
                a = i === 1 ? 0 : a;
                a = questions.filter(b => b.show).length === 1 ? 1 : a;
                z = x.show ? 1 : 0;
                return a + z;
            });
        if (total_active === 0) {
            return (
                <Card key={"card-0"}>
                    <CardBody key={"card-body-0"} id={"card-body-0"}>
                        <CardTitle key={"card-title-0"}>No Active Questions for This Group {Mandatory(false)}</CardTitle>
                        The main question might depend on another answer in the other question group.
                    </CardBody>
                </Card>
            );
        }
        return questions.map(question => {
            let localization = this.props.value.lang.active;
            localization = localization.map((x) => {
                let active = question.lang[x] === undefined ? "" : question.lang[x];
                return active;
            });
            localization = localization.map((x,i) => {
                let colorIndex = colorPallet.length < i ? (i - i) : i;
                return "<span style='color:"+ colorPallet[colorIndex] +"'>" + x + "</span>"
            });
            localization = localization.filter(x => x !== "");
            localization = localization.length === 0 ? question.lang.en : localization.join("</br>");
            let qid = question.id.toString();
            let qi = question.iteration.toString();
            return (
                <div key={"card-" + qid + "-" + qi} id={"form-" + qid}>
                    {question.groupIndex && question.repeat ? (<GroupPanels data={question} type="header"/>) : ""}
                <Card className={question.show === false ? "d-none" : ""}>
                    {question.mandatory ? this.renderMandatoryIcon(qid, question) : ""}
                    <CardBody key={"card-body-" + qid} id={"card-body-" + qid}>
                        <CardTitle key={"card-title-" + qid}>
                            <div className="question-number">{question.order.toString()}.</div>
                            <div className="question-text" dangerouslySetInnerHTML={{__html:  localization}} />
                            {question.help !== undefined ? <ToolTip question={question}/> : ""}
                            {question.type === "photo" ? this.renderCachedImage(qid) : ""}
                        </CardTitle>
                        {this.renderQuestion(qid, question)}
                    </CardBody>
                </Card>
                    {question.last && question.repeat ? (<GroupPanels data={question} type={"footer"}/>) : ""}
                </div>
            );
        });
    }

    render() {
        return this.getForms(this.props.value.questions);
    }
}

export default connect(mapStateToProps)(Questions);
