import React, { Component } from 'react'
import { Card, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap'
import PropTypes from 'prop-types'

class Questions extends Component {
    // this.setQuestion = this.setQuestion.bind(this)
    // Inject State
    render() {
        return (
            <Card className= {this.props.dependency ? "my-4 d-none" : "my-4"}>
            <CardBody>
                <CardTitle>
                    {this.props.data.text}
                </CardTitle>
                <CardText>
                    {this.props.data.options ?  "options" : ""}
                </CardText>
            </CardBody>
            </Card>
        )
    }
}

export default Questions;
