import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import React, { Component } from 'react'

class GroupButtons extends Component {

    constructor(props) {
        super(props);
        this.showQuestion = this.showQuestion.bind(this)
        this.getQuestionList = this.getQuestionList.bind(this)
        this.listClass = "list-group-item list-group-item-action "
        this.getUrl = this.getUrl.bind(this)
        this.state = {
          _showQuestion: ''
        };
    }

    getUrl = ((group) => (
        "#" + group.replace(/ /g,"-").toLowerCase()
    ))

    showQuestion(group) {
        this.props.changeGroup(group)
    }

    componentDidMount() {
    }

    getQuestionList(groups){
        return groups.list.map((group) => (
                <div className="list-group list-group-flush" key={'group-' + group.index}>
                <a onClick={() => {this.showQuestion(group.index)}}
                href={this.getUrl(group.heading)}
                className={(group.index === groups.active ?
                        this.listClass + " bg-current" : this.listClass + " bg-light"
                )}
                >
                    { group.heading }
                </a>
                </div>
        ))
    }

    render() {return this.getQuestionList(this.props.value.groups)}

}

export default connect(mapStateToProps, mapDispatchToProps)(GroupButtons);
