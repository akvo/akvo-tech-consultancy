import React, { Component } from 'react'
import {
    Card,
    CardBody,
    CardTitle
} from 'reactstrap'
import QuestionType from './QuestionType'


class Questions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _Answer: '',
            _isOption: false,
        }
        this.cardClass = 'my-4'
        this.checkDependency = this.checkDependency.bind(this)
        this.solveDependent = this.solveDependent.bind(this)
    }

    checkDependency (x,y) {
        this.props.reloadData(x,y)
        if (this.props.data.dependency) {
            this.cardClass = "my-4 d-none"
            this.solveDependent()
        }
    }

    solveDependent () {
        let dependencyAnswer = localStorage.getItem(this.props.data.dependency.question)
        if (dependencyAnswer){
            let defaultAnswer = this.props.data.dependency['answer-value']
            if (defaultAnswer === dependencyAnswer) {
                this.cardClass ="my-4"
            }
        }
        return dependencyAnswer
    }

    componentDidMount() {
        this.checkDependency('','')
    }

    render() {
        return (
            <Card key={"card-" + this.props.index} className= {this.cardClass} >
            <CardBody key={"card-body-" + this.props.index}>
                <CardTitle key={"card-title-" + this.props.index}>
                    { (this.props.index + 1) + '. ' + this.props.data.text}
                </CardTitle>
                <QuestionType key={this.props.index} data={this.props.data} dataPoint={this.props.dataPoint} checkDependency={this.checkDependency}/>
            </CardBody>
            </Card>
        )
    }
}

export default Questions;
