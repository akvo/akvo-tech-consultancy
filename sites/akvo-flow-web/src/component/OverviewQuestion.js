import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import { FaEdit } from "react-icons/fa";
import Dexie from 'dexie';

const getPos = (question_id) => {
    const elemChild = document.getElementById("form-" + question_id);
    const elemParent = document.getElementById("form-container");
    const divElem = document.getElementById("card-body-" + question_id);
    if (elemChild !== null && elemParent !== null) {
        elemParent.scrollTop = elemChild.offsetTop - elemParent.offsetTop - 17;
        divElem.classList.add("ov-alerts");
        setTimeout(() => {
            divElem.classList.remove("ov-alerts");
        }, 3000)
    }
    return true;
}


class OverviewQuestion extends Component {
    constructor(props) {
        super(props);
        this.renderAnswer = this.renderAnswer.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.goToAnswer = this.goToAnswer.bind(this);
    }

    goToAnswer(gi, qid) {
        this.props.changeGroup(gi.index);
        this.props.showOverview(false);
        setTimeout(() => {
            getPos(qid);
        }, 300)
    }


    renderEdit(qid, group) {
        return (
            <div
                className="badge-overview"
                key={qid}
                onClick={e => this.goToAnswer(group, qid)}
            >
                <div className="badge badge-left badge-red"><FaEdit /></div>
                <div className="badge badge-right badge-secondary">Edit</div>
            </div>
        )
    }

    renderAnswer(qid, answer, type) {
        switch(type){
            case "cascade":
                let cascade = [];
                answer = JSON.parse(answer);
                answer.forEach(x => cascade.push(x.text));
                return cascade.join(' - ');
            case "option":
                let options = [];
                answer = JSON.parse(answer);
                answer.forEach((x,i) => {
                    let text = x.text;
                    if (x.text === "Other Option") {
                        text = localStorage.getItem("other_" + qid);
                    }
                    options[i] = text;
                });
                return options.length === 1 ? options[0] : options.join(', ');
            case "photo":
                const db = new Dexie('akvoflow');
                db.version(1).stores({files: 'id'});
                db.files.get(answer).then(value => {
                    document.getElementById("img-ov-" + answer).src = value.blob;
                });
                return (<img className="img img-fluid" id={"img-ov-" + answer} alt={answer}/>);
            case "geo":
                answer = answer.split('|')
                return (<div>Latitude: {answer[0]}<br/>Longitude: {answer[0]}</div>);
            default:
                return answer;
        }
    }

    render() {
        let qid = this.props.qid.replace('-0', this.props.iter);
        let question = this.props.value.questions.find(q => q.id === qid);

        let localization = this.props.value.lang.active;
        localization = localization.map((x) => {
            let active = question.lang[x] === undefined ? "" : question.lang[x];
            return active;
        });
        localization = localization.filter(x => x !== "");
        localization = localization.length === 0 ? question.lang.en : localization.join(" / ");

        let answer = localStorage.getItem(qid);
        let divclass = answer === null ? "text-red" : "";
        answer = answer === null ? false : this.renderAnswer(qid, answer, question.type);
        if (question === undefined) {
            return (<div key="oq-loading"><p>Loading...</p></div>)
        }
        if (question.overview) {
            return (
                <div className="row ov-list" key={"oq-" + this.props.group.index + qid}>
                    <div className="col-md-8 ov-question">
                        <span className="mr-2">{this.props.index + 1}</span>
                            {localization}
                    </div>
                            <div className="col-md-4">
                        { answer ? (
                            <div className={"ov-answer" + divclass}>{answer}</div>
                        ) : this.renderEdit(qid, this.props.group)}
                    </div>
                </div>
            );
        }
        return "";
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewQuestion);
