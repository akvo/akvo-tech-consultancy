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

    renderAnswer(answer, type) {
        switch(type){
            case "cascade":
                let cascade = [];
                answer = JSON.parse(answer);
                answer.forEach(x => cascade.push(x.text));
                return cascade.join(' - ');
            case "option":
                let options = [];
                answer = JSON.parse(answer);
                answer.forEach(x => options.push(x.text));
                return options.length === 1 ? options[0] : options.join(', ');
            case "photo":
                const db = new Dexie('akvoflow');
                db.version(1).stores({files: 'id'});
                db.files.get(answer).then(value => {
                    document.getElementById("img-ov-" + answer).src = value.blob;
                });
                return (<img className="img img-fluid" id={"img-ov-" + answer} alt={answer}/>);
            default:
                return answer;
        }
    }

    render() {
        let index = this.props.group.index + 1;
        let qid = this.props.qid.replace('-0', this.props.iter);
        let question = this.props.value.questions.find(q => q.id === qid);
        let answer = localStorage.getItem(qid);
        let divclass = answer === null ? "text-red" : "";
        answer = answer === null ? false : this.renderAnswer(answer, question.type);
        if (question === undefined) {
            return (<div key="oq-loading"><p>Loading...</p></div>)
        }
        return (
            <div className="row ov-list" key={"oq-" + this.props.group.index + qid}>
                <div className="col-md-6 ov-question">
                    <span className="mr-2">{index}</span>
                    {question.text}
                </div>
                <div className={"col-md-6"}>
                    { answer ? (
                        <div className={"ov-answer" + divclass}>{answer}</div>
                    ) : this.renderEdit(qid, this.props.group)}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewQuestion);
