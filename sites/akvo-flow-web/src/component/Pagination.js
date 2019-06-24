import React, { Component } from 'react'

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.showQuestion = this.showQuestion.bind(this);
        this.state = {
          _showQuestion: ''
        };
    }

    showQuestion(val) {
        this.props.onSelectGroup(val)
        this.setState({
              _showQuestion: val,
              _prevDisable: (this.props.data.prev <= 0 ? false : true),
              _nextDisable: (this.props.data.next === (this.props.data.total) ? false : true)
        })
        console.log(this.state)
    }

    render() {
        return (
            <div className="btn btn-group ml-auto mt-2 mt-lg-0">
                <button className={"btn " + (this.state._prevDisable === false ? "btn-secondary" : "btn-primary")}
                onClick={() => {this.showQuestion(this.props.data.prev)}}
                >
                    Prev
                </button>
                <button className={"btn " + (this.state._nextDisable === false ? "btn-secondary" : "btn-primary")}
                onClick={() => {this.showQuestion(this.props.data.next)}}
                >
                    Next
                </button>
            </div>
        )
    }
}

export default Pagination;
