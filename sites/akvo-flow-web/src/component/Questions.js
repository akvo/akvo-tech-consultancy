import React, { Component } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps } from '../reducers/actions.js'
import QuestionType from './QuestionType.js'
import { Mandatory } from '../util/Badges'
import {
    Card,
    CardBody,
    CardTitle
} from 'reactstrap'
import '../App.css'

class Questions extends Component {

    constructor(props) {
        super(props);
        this.getForms = this.getForms.bind(this);
        this.isJsonString = this.isJsonString.bind(this);
        this.renderMandatoryIcon = this.renderMandatoryIcon.bind(this);
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
        return(
           <QuestionType key={'question-type-' + qid} data={question} />
        )
    }

    renderMandatoryIcon(qid) {
        let answered = false;
        if (localStorage.getItem(qid)){
            answered = true;
        }
        return (Mandatory(answered));
    }

    getForms(questions){
        return questions.map((question) => {
            let qid = question.id.toString()
            return (
                <Card key={"card-" + qid} className= {question.show === false ? 'd-none' : ''} >
                <CardBody key={"card-body-" + qid} id={"card-body-" + qid}>
                    <CardTitle key={"card-title-" + qid}>
                        { (question.order.toString()) + '. ' + question.text }
                        { question.mandatory ? this.renderMandatoryIcon(qid) : ''}
                    </CardTitle>
                    {this.renderQuestion(qid, question)}
                </CardBody>
                </Card>
            )}
        )
    }

    render() {
        return this.getForms(this.props.value.questions);
    }
}

export default connect(mapStateToProps)(Questions);
