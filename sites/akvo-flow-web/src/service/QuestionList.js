import React, { Component } from 'react'
import Questions from './Questions'
import PropTypes from 'prop-types'

export class QuestionList extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return this.props.data.map((questions, index) => (
            <Questions key={'question_list-' + index} data={questions} index={index}/>
        ))
    }
}
// PropTypes
QuestionList.propTypes = {
    data: PropTypes.array.isRequired
}

export default QuestionList;
