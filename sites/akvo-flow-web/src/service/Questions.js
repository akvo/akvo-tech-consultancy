import React, { Component } from 'react'
import {
    Card,
    CardText,
    CardBody,
    CardTitle
} from 'reactstrap'
import QuestionType from './QuestionType'


class Questions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _Answer: '',
            _isOption: false
        }
    }

    render() {
        return (
            <Card className= {this.props.data.dependency ? "my-4 d-none" : "my-4"} >
            <CardBody>
                <CardTitle>
                    {this.props.data.text}
                </CardTitle>
                <div>
                    <QuestionType data={this.props.data} dataPoint={this.props.dataPoint} />
                </div>
            </CardBody>
            </Card>
        )
    }
}

export default Questions;
