import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps } from "../reducers/actions.js";
import { PROD_URL } from '../util/Environment'
import QuestionType from "./QuestionType.js";
import { Mandatory, ToolTip } from "../util/Badges";
import { Card, CardBody, CardTitle } from "reactstrap";
import "../App.css";

const API_ORIGIN = (PROD_URL ? ( window.location.origin + "/" + window.location.pathname.split('/')[1] + "-api/" ) : process.env.REACT_APP_API_URL);

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
        return <QuestionType key={"question-type-" + qid} data={question} />;
    }

    renderCachedImage(qid) {
        let cached = false;
        if (localStorage.getItem(qid) !== null){
            cached = API_ORIGIN + "fetch-image/" + localStorage.getItem(qid);
            return (
            <div className="d-block display-cache-image">
                Cached file:
                <a href={cached} rel="noopener noreferrer" target="_blank"> {localStorage.getItem(qid)}</a>
            </div>
            )
        }
        return ""
    }

    renderMandatoryIcon(qid) {
        let answered = false;
        if (localStorage.getItem(qid)) {
            answered = true;
        }
        return Mandatory(answered);
    }

    getForms(questions) {
        let total_active = questions.reduce((a, x, i) => {
            let z = 0;
            if (i === 1) {
                a = 0;
            }
            z = x.group === this.props.value.groups.active ? 1 : 0;
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
            localization = localization.filter(x => x !== "");
            localization = localization.length === 0 ? question.lang.en : localization.join(" / ");
            let qid = question.id.toString();
            return (
                <Card key={"card-" + qid} className={question.show === false ? "d-none" : ""}>
                    <CardBody key={"card-body-" + qid} id={"card-body-" + qid}>
                        <CardTitle key={"card-title-" + qid}>
                            {question.order.toString() + ". " + localization}
                            {question.mandatory ? this.renderMandatoryIcon(qid) : ""}
                            {question.help !== undefined ? ToolTip(question) : ""}
                            {question.type === "photo" ? this.renderCachedImage(qid) : ""}
                        </CardTitle>
                        {this.renderQuestion(qid, question)}
                    </CardBody>
                </Card>
            );
        });
    }

    render() {
        return this.getForms(this.props.value.questions);
    }
}

export default connect(mapStateToProps)(Questions);
