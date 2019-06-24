import React, { Component } from 'react'

class QuestionGroup extends Component {
    constructor(props) {
        super(props);
        this.showQuestion = this.showQuestion.bind(this);
        this.state = {
          _showQuestion: ''
        };
    }

    showQuestion(val) {
        this.props.onSelectGroup(val)
        this.setState(
            {_showQuestion: val}
        )
    }

    render() {
        return this.props.data.map((group, index) => (
                <a key={'group-list-' + index}
                onClick={() => {this.showQuestion(index)}}
                className="list-group-item list-group-item-action bg-light"
                >
                    { group.heading }
                </a>
        ))
    }
}

export default QuestionGroup;
