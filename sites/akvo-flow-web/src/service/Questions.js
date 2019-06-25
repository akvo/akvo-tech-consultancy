import React, { Component } from 'react'
import {
    Card,
    CardText,
    CardBody,
    CardTitle,
    CardSubtitle,
    Button,
    Label,
    FormGroup,
    Input,
    FormText
} from 'reactstrap'
import PropTypes from 'prop-types'
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
                <CardText>
                    <QuestionType data={this.props.data}/>
                </CardText>
            </CardBody>
            </Card>
        )
    }
}

export default Questions;
