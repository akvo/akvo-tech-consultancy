import React, { Component } from 'react'
import Questions from './Questions'

export class QuestionList extends Component {

    constructor(props) {
        super(props);
        this.reloadData = this.reloadData.bind(this)
        this.updateDependencies = this.updateDependencies.bind(this)
        this.getDependencies = this.getDependencies.bind(this)
        this.dependencies = []
        this.solvedDependency = []
    }

    reloadData(x,y) {
        let question = this.dependencies.filter((a) => (
            a['question'] === x
        ))
        if (question) {
        }
    }

    solveDependency(x) {

    }

    getDependencies(question) {
        return question.dependency
    }


    updateDependencies() {
        let questions = this.props.data.filter(this.getDependencies)
        this.dependencies = questions.map((x,y) => {
            let answers = x['dependency']['answer-value'].split('|')
            let question = x['dependency']['question']
            let answered = localStorage.getItem(question)
            let data = {'answers': answers, 'question': question}
            return data
        })
    }

    render() {
        this.updateDependencies()
        return this.props.data.map((questions, index) => (
            <Questions
            key={'question_group-' + index}
            data={questions} index={index}
            dataPoint={this.props.dataPoint}
            reloadData={this.reloadData}
            />
        ))
    }
}

export default QuestionList;
