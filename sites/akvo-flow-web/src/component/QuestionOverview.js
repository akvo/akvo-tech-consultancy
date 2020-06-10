import React, { Component, Fragment} from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import { Card, CardBody, CardTitle } from "reactstrap";
import { FaPrint, FaEdit } from "react-icons/fa";

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


class QuestionOverview extends Component {
    constructor(props) {
        super(props);
        this.renderGroups = this.renderGroups.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.renderAnswer = this.renderAnswer.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.printOverview = this.printOverview.bind(this);
        this.goToAnswer = this.goToAnswer.bind(this);
    }

    printOverview() {
        console.log('print!');
    }

    goToAnswer(gi, qid) {
        this.props.changeGroup(gi.index);
        this.props.showOverview(false);
        setTimeout(() => {
            getPos(qid);
        }, 300)
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
            default:
                return answer;
        }
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

    renderQuestions(group, gi) {
        return group.questions.map((qid, ix) => {
            let index = ix + 1;
            let question = this.props.value.questions.find(q => q.id === qid);
            let answer = localStorage.getItem(qid);
            let divclass = answer === null ? "text-red" : "";
            answer = answer === null ? false : this.renderAnswer(answer, question.type);
            if (question === undefined) {
                return (<div key="oq-loading"><p>Loading...</p></div>)
            }
            return question.overview ? (
                <div className="row ov-list" key={"oq-" + gi + "-"+ qid}>
                    <div className="col-md-6 ov-question">
                        <span className="mr-2">{index}</span>
                        {question.text}
                    </div>
                    <div className={"col-md-6"}>
                        { answer ? (
                            <div className={"ov-answer" + divclass}>{answer}</div>
                        ) : this.renderEdit(qid, group)}
                    </div>
                </div>
            ) : "";
        });
    }

    renderGroups() {
        return this.props.value.groups.list.map((group,i) => (
            <Card key={"og-" + i} id={"overview-group-" + i}>
                <CardBody>
                    <CardTitle>
                        <h5>{group.heading}</h5>
                    </CardTitle>
                    {this.renderQuestions(group, i)}
                </CardBody>
            </Card>
        ));
    }

    render() {
        return (
            <Fragment>
            <nav className="navbar navbar-expand-lg navbar-light navbar-group bg-light border-bottom" key="overview-group">
                <div className="col-md-4 header-left">
                    <h4 className="mt-2">Overviews</h4>
                </div>
                <div className="col-md-8 text-right">
                    <button
                        className={"btn btn-primary btn-repeatable"}
                        onClick={(e => this.printOverview())}
                    >
                        Print <FaPrint/>
                    </button>
                </div>
            </nav>
            <div className="container-fluid fixed-container" key={'overview-containers'}>
                    {this.renderGroups()}
            </div>
            </Fragment>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionOverview);
