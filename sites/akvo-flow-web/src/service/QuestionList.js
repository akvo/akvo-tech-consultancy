import React, { Component } from 'react'
import Questions from './Questions'

export class QuestionList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return this.props.data.map((questions, index) => (
            <Questions key={'question_group-' + index} data={questions} index={index} dataPoint={this.props.dataPoint}/>
        ))
    }
}

export default QuestionList;
