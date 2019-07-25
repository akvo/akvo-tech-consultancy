import React, { Component } from 'react'
import Questions from './Questions'

export class QuestionList extends Component {

    constructor(props) {
        super(props);
        this.reloadData = this.reloadData.bind(this)
        this.updateDependencies = this.updateDependencies.bind(this)
        this.getDependencies = this.getDependencies.bind(this)
        this.hideContent = this.hideContent.bind(this)
        this.state = {}
        this.dependencies = []
        this.solvedDependency = []
    }

    reloadData(x,y) {
        let question = this.dependencies.filter((a) => (
            a['question'] === x
        ))
        if (question[0]) {
            let resolve = question[0]['answers']
            if (resolve.indexOf(y) >= 0) {
                this.solvedDependency.push(question[0])
            } else {
                this.solvedDependency.splice(resolve.indexOf(y), 1)
            }
        }
        this.updateDependencies()
    }

    getDependencies(question) {
        return question.dependency
    }

    updateDependencies() {
        let allClasses = {}
        this.props.data.map((y) => {
            allClasses[y.id] = 'my-4'
        })
        this.setState(allClasses)
        let questions = this.props.data.filter(this.getDependencies)
        this.dependencies = questions.map((x,y) => {
            let answers = x['dependency']['answer-value'].split('|')
            let question = x['dependency']['question']
            let dependentId = this.props.data.filter((a)=>(a.id === question))[0].id
            let data = {'id':dependentId,'answers': answers, 'question': x.id}
            return data
        })
        this.dependencies.map((x,y) => {
            let answered = localStorage.getItem(x.id)
            if (answered !== null && answered.indexOf(x.answers) >= 0) {
                if(this.solvedDependency.indexOf(x.question) === -1) {
                    this.solvedDependency.push(x.question)
                }
                this.setState({[x.question] :'my-4 d-none'})
            } else {
                this.solvedDependency.splice(this.solvedDependency.indexOf(x.question), 1)
                this.setState({[x.question] :'my-4'})
            }
            return true
        })
    }

    hideContent(x) {
        this.setState({[x] :'my-4 d-none'})
    }

    render() {
        return this.props.data.map((questions, index) => (
            <Questions
            key={'question_group-' + index}
            data={questions} index={index}
            dataPoint={this.props.dataPoint}
            reloadData={this.reloadData}
            solvedDependency={this.solvedDependency}
            parentState={this.state}
            hideContent={this.hideContent}
            />
        ))
    }
}

export default QuestionList;
