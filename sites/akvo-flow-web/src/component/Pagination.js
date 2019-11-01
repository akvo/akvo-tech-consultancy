import React, { Component } from 'react'

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.showQuestion = this.showQuestion.bind(this);
    }

    showQuestion(val) {
        console.log(val)
    }

    render() {
        return (
            <div className="btn btn-group ml-auto mt-2 mt-lg-0">
                <button className={"btn btn-secondary"}
                onClick={() => {this.showQuestion(1)}}
                >
                    Prev
                </button>
                <button className={"btn btn-primary"}
                onClick={() => {this.showQuestion(2)}}
                >
                    Next
                </button>
            </div>
        )
    }
}

export default Pagination;
