import React, { Component } from 'react'

class QuestionType extends Component {

    constructor(props) {
        super(props)
        this.value = localStorage.getItem(this.props.data.id)
        this.state = { value: this.value ? this.value : "" }
        this.setDpStorage = this.setDpStorage.bind(this)
        this.getQuestionType = this.getQuestionType.bind(this)
        this.getRadio = this.getRadio.bind(this)
        this.getRadioSelected = this.getRadio.bind(this)
        this.renderRadio = this.renderRadio.bind(this)
        this.getCascade = this.getCascade.bind(this)
        this.renderCascade = this.renderCascade.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        let id = this.props.data.id
        let value = event.target.value
        if (this.props.data.options.allowMultiple) {
            let multiple = true
        }
        this.props.checkDependency(id, value)
        if (this.props.data.options.allowMultiple) {
            let multipleValue = []
            if (localStorage.getItem(id)) {
                multipleValue = JSON.parse(localStorage.getItem(id))
            }
            if (multipleValue.indexOf(value) === -1) {
                multipleValue.push(value)
            } else {
				multipleValue.splice(multipleValue.indexOf(value), 1)
            }
			if (multipleValue.length > 0) {
            	localStorage.setItem(id, JSON.stringify(multipleValue))
            	this.setState({value: multipleValue})
			} else {
				localStorage.removeItem(id)
            	this.setState({value: ""})
			}
        } else {
            localStorage.setItem(id, value)
            this.setState({value: value})
        }
        if (this.props.data.localeNameFlag) {
            let a = JSON.parse(localStorage.getItem('_dpOrder'));
            let names = []
            a.map((b) => {
                let c = localStorage.getItem(b)
                if (c) {
                    names.push(c)
                }
                return true
            })
            let edited = names.join(" - ")
            localStorage.setItem("_dataPointName", edited)
            this.props.dataPoint(edited)
        }
    }

    setDpStorage () {
        if (localStorage.getItem('_dpOrder')) {
            let a = JSON.parse(localStorage.getItem('_dpOrder'));
            if (!a.includes(this.props.data.id)) {
                a.push(this.props.data.id)
            }
            localStorage.setItem('_dpOrder', JSON.stringify(a));
        } else {
            localStorage.setItem('_dpOrder', JSON.stringify([this.props.data.id]));
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

    getRadio (opts) {
        let radioType = (opts.allowMultiple ? "checkbox" : "radio")
        return (
            opts.option.length > 1 ? (opts.option.map((opt, i) => this.renderRadio(
                opt, i, this.props.data.id, radioType)
            )) : (this.renderRadio(opts.option, 0, this.props.data.id, radioType))
        )
    }

    getRadioSelected (value,id) {
        if (localStorage.getItem(id)) {
            if (localStorage.getItem(id) === value) {
            return true
            }
            return false
        }
        return false
    }

    renderRadio (opt, i, id, radioType) {
        let checked = () => (localStorage.getItem(id) === opt.value)
		if (radioType === "checkbox" && this.state.value.indexOf(opt.value) >= 0) {
			checked = () => (true)
		}
        return (
            <div className="form-check"
                 key={id+i}
            >
                <input
                    className="form-check-input"
                    type={radioType}
                    name={id}
                    value={opt.value}
                    id={id+i}
                    key={"input" + id+i}
                    onChange={this.handleChange}
                    checked={checked()}
            />
                <label
                    className="form-check-label"
                    htmlFor={id+i}>
                    {opt.text}
                </label>
            </div>
        )
    }

    getCascade (opts) {
        let url = window.location.pathname.split('/')[1]
        url = 'http://localhost:5000/cascade/' + url + '/' + opts.cascadeResource + '/'
        return opts.levels.level.map((opt, i) => (
            this.renderCascade(opt, i, url)
        ))
    }

    renderCascade (opt, i, url) {
        return (
            <>
            <div>{opt.text}</div>
            <select
                className="form-control"
                value={this.state.value} type="select"
                name={this.props.data.id + '-' + i}
                key={this.props.data.id + '-' + i}
                onChange={this.handleChange}>
            </select>
            </>
        )
    }

    render() {
        if (this.props.data.localeNameFlag) {
            this.setDpStorage()
        }
        let answered = localStorage.getItem(this.props.data.id)
        return this.props.data.type === "option" ? this.getRadio(this.props.data.options) : (
            this.props.data.type === "cascade" ? this.getCascade(this.props.data): (<input
                className="form-control"
                value={answered ? answered : ""}
                key={this.props.data.id}
                type={this.getQuestionType(this.props.data)}
                name={this.props.data.id}
                onChange={this.handleChange} />
            )
        )
    }
}

export default QuestionType;
