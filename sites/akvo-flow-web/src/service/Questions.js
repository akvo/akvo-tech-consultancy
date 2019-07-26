import React, { Component } from 'react'
import {
    Card,
    CardBody,
    CardTitle
} from 'reactstrap'
import QuestionType from './QuestionType'


class Questions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _Answer: '',
            _isOption: false,
        }
        this.checkDependency = this.checkDependency.bind(this)
        this.solveDependent = this.solveDependent.bind(this)
        this.isJsonString = this.isJsonString.bind(this)
        this.classes = 'd-none'
    }

    checkDependency (x,y) {
        this.props.reloadData(x,y)
        if (this.props.data.dependency) {
            this.solveDependent()
        }
    }

    solveDependent () {
        let dependentId = this.props.data.dependency.question
        let isResolved  = (this.props.solvedDependency.indexOf(dependentId) >= 0 ? true : false)
        if (isResolved) {
           this.cardClass =""
        }
        let dependencyAnswer = localStorage.getItem(this.props.data.dependency.question)
        return dependencyAnswer
    }

    componentDidMount() {
        this.checkDependency('','')
    }

    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    render() {
        this.classes = this.props.parentState[this.props.data.id]
        if (this.props.data.dependency) {
            let answerValue = this.props.data.dependency['answer-value']
            let currentAnswer = localStorage.getItem(this.props.data.dependency.question)
            if (this.isJsonString(currentAnswer)) {
                if (currentAnswer !== null && currentAnswer.indexOf(answerValue) >= 0) {
                    this.classes = ''
                } else {
                    this.classes = 'd-none'
                }
            } else {
                if (answerValue !== currentAnswer) {
                    this.classes = 'd-none'
                } else {
                    this.classes = ''
                }
            }
        }
        return (
            <Card key={"card-" + this.props.index} className= {this.classes} >
            <CardBody key={"card-body-" + this.props.index}>
                <CardTitle key={"card-title-" + this.props.index}>
                    { (this.props.index + 1) + '. ' + this.props.data.text}
                </CardTitle>
                <QuestionType key={this.props.index} data={this.props.data} dataPoint={this.props.dataPoint} checkDependency={this.checkDependency} isJsonString={this.isJsonString}/>
            </CardBody>
            </Card>
        )
    }
}

export default Questions;
