import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import {
    Card,
    CardBody,
    CardTitle
} from 'reactstrap'
import {
	Mandatory
} from '../util/Badges'
import QuestionType from './QuestionType'


class Questions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _Badge: this.props.value.answers.find(x => x.id = this.props.data.id).answer,
            _Answer: '',
            _isOption: false
        }
        this.checkDependency = this.checkDependency.bind(this)
        this.solveDependent = this.solveDependent.bind(this)
        this.isJsonString = this.isJsonString.bind(this)
        this.renderMandatoryIcon = this.renderMandatoryIcon.bind(this)
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

    renderMandatoryIcon(answered) {
        return (<Mandatory id={'tooltip-' + this.props.data.id} answered={this.state._Badge}/>);
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
        let mandatory = "";
        if(this.props.data.mandatory){
            mandatory = this.renderMandatoryIcon()
        }
		let idx = this.props.data.order + '-' + this.props.data.id.toString()
        return (
            <Card key={"card-" + idx} className= {this.classes} >
            <CardBody key={"card-body-" + idx} id={"card-body-" + idx}>
                <CardTitle key={"card-title-" + idx} id={"card-title-" + idx}>
                    { (this.props.index + 1) + '. ' + this.props.data.text}
                    { mandatory }
                </CardTitle>
                <QuestionType key={'question-type-' + idx} data={this.props.data} dataPoint={this.props.dataPoint} checkDependency={this.checkDependency} isJsonString={this.isJsonString}/>
            </CardBody>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
