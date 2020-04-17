import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import React, { Component } from 'react'
import Loading from '../util/Loading'

class GroupButtons extends Component {

    constructor(props) {
        super(props);
        this.showQuestion = this.showQuestion.bind(this)
        this.getQuestionList = this.getQuestionList.bind(this)
        this.listClass = "list-group-item list-group-item-action "
        this.anyActive = this.anyActive.bind(this)
        this.state = {
          _showQuestion: ''
        };
    }

    anyActive = ((group) => {
        let questions = this.props.value.questions.filter((x) => {
            return x.group === group.index;
        });
        return questions.length;
    })

    showQuestion(group) {
        this.props.changeGroup(group)
    }

    getQuestionList(groups){
        return groups.list.map((group) => (
                <div
                    className={"list-group list-group-flush"}
                    key={'group-' + group.index}
                >
                    <button
                        onClick={(e) => {this.showQuestion(group.index)}}
                        className={(group.index === groups.active
                            ?  this.listClass + " bg-current"
                            : this.listClass + " bg-light"
                    )}
                    >
                        <span className="question-group-button">{ group.heading }</span>
                        <span
                            className={"badge badge-group badge-" + (group.index === groups.active ? "primary" : "secondary")}
                        >
                            {this.anyActive(group)}
                        </span>
                    </button>
                </div>
        ))
    }

    getLoading = () => (<Loading styles={'sidebar-loading'}/>)

    render() {
        return (
            this.props.value.questions.length === 1 ?
            this.getLoading() : this.getQuestionList(this.props.value.groups)
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupButtons);
