import React, { Component } from 'react'

class QuestionType extends Component {

    constructor(props) {
        super(props)
        this.value = localStorage.getItem(this.props.data.id)
        this.state = { value: this.value ? this.value : '' }
        this.setDpStorage = this.setDpStorage.bind(this)
        this.getQuestionType = this.getQuestionType.bind(this)
        this.getOption = this.getOption.bind(this)
        this.renderOption = this.renderOption.bind(this)
        this.radioOption = this.getRadio.bind(this)
        this.renderRadio = this.renderRadio.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({value: event.target.value})
        localStorage.setItem(this.props.data.id, event.target.value)
        if (this.props.data.localeNameFlag) {
            let a = JSON.parse(localStorage.getItem('dp_order'));
            let names = []
            a.map((b) => {
                let c = localStorage.getItem(b)
                if (c) {
                    names.push(c)
                }
            })
            let edited = names.join("-")
            localStorage.setItem("dataPointName", edited)
            this.props.dataPoint(edited)
        }
    }

    setDpStorage () {
        if (localStorage.getItem('dp_order')) {
            let a = JSON.parse(localStorage.getItem('dp_order'));
            if (!a.includes(this.props.data.id)) {
                a.push(this.props.data.id)
            }
            localStorage.setItem('dp_order', JSON.stringify(a));
        } else {
            localStorage.setItem('dp_order', JSON.stringify([this.props.data.id]));
        }

    }

    getQuestionType (props) {
        if (props.type === "free") {
            if (props.validationRule) {
                if (props.validationRule.validationType === "numeric") {
                    return "number"
                }
                return "text"
            }
            return "text"
        }
        if (props.type === "cascade") {
            return "select"
        }
        if (props === "geo") {
            return "text"
        }
        return "text"
    }


    getOption (opts) {
        return (
            <select
                className="form-control"
                value={this.state.value} type="select"
                name={this.props.data.id} key={this.props.data.id}
                onChange={this.handleChange}>
            {opts.length > 1 ? (opts.map((opt, i) => this.renderOption(opt, i))) : (this.renderOption(opts, 0))}
            </select>
        )
    }

    renderOption (opt, i) {
        return (<option value={opt.value} key={i}>{opt.text}</option>)
    }

    getRadio (opts) {
        return (
            <div>
            {
                opts.length > 1 ? (opts.map((opt, i) => this.renderOption(opt, i, this.props.data.id))) :
                (this.renderOption(opts, 0, this.props.data.id))
            }
            </div>
        )
    }

    renderRadio (opt, i, id) {
            <div className="form-group radio">
                <input type="radio"
                    name={id}
                    value={opt}
                    key={id+i}
                    id={id+i}
                checked />
                <label for={id+i}>
                    {opt}
                </label>
            </div>
    }

    render() {
        if (this.props.data.localeNameFlag) {
            this.setDpStorage()
        }
        return this.props.data.type === "option" ? this.getRadio(this.props.data.options.option) :
            (<input
                className="form-control"
                value={this.state.value}
                key={this.props.data.id}
                type={this.getQuestionType(this.props.data)}
                name={this.props.data.id}
                onChange={this.handleChange} />
            )
    }
}

export default QuestionType;
