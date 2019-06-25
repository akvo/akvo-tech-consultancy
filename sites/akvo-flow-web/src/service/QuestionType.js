import React, { Component } from 'react'
import {
    Label,
    Input,
    FormText
} from 'reactstrap'
import PropTypes from 'prop-types'

class QuestionType extends Component {

    constructor(props) {
        super(props)
        this.getOption = this.getOption.bind(this)
        this.renderOption = this.renderOption.bind(this)
    }

    renderOption (opt, i) {
        return (<option value={opt.value} key={i}>{opt.text}</option>)

    }

    getOption (opts) {
        console.log(opts)
        return (
            <Input type="select" name={this.props.data.id} key={this.props.data.id}>
            {opts.length > 1 ? (opts.map((opt, i) => this.renderOption(opt, i))) : (this.renderOption(opts, 0))}
            </Input>
        )
    }


    render() {
        return this.props.data.type === "option" ? this.getOption(this.props.data.options.option) :
            (<Input key={this.props.data.id} type="text" name={this.props.data.id}></Input>)
    }
}

export default QuestionType;
