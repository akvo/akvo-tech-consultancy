import React, { Component } from 'react'
import axios from 'axios';
import QuestionHandler from '../util/QuestionHandler'

class QuestionType extends Component {

    constructor(props) {
        super(props)
        this.api = 'https://tech-consultancy.akvotest.org/akvo-flow-web-api/'
        this.handler = new QuestionHandler()
        this.value = localStorage.getItem(this.props.data.id)
        this.state = { value: this.value ? this.value : '' }
        this.setDpStorage = this.setDpStorage.bind(this)
        this.getRadio = this.getRadio.bind(this)
        this.getRadioSelected = this.getRadio.bind(this)
        this.renderRadio = this.renderRadio.bind(this)
        this.getCascade = this.getCascade.bind(this)
        this.getCascadeDropdown = this.getCascadeDropdown.bind(this)
        this.renderCascade = this.renderCascade.bind(this)
        this.renderCascadeOption = this.renderCascadeOption.bind(this)
        this.limitCascade = 0
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        let id = this.props.data.id
        let value = event.target.value
        this.props.checkDependency(id, value)
        if (this.props.data.type === "cascade") {
            let targetLevel = parseInt(event.target.name.split('-')[1]) + 1
            if (this.limitCascade > targetLevel) {
                this.getCascadeDropdown(value, targetLevel)
            }
        }
        if (this.props.data.options && this.props.data.options.allowMultiple)  {
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
        let answer = localStorage.getItem(this.props.data.id)
        let checked = () => (localStorage.getItem(id) === opt.value)
		if (radioType === "checkbox" && this.state.value.indexOf(opt.value) >= 0) {
			checked = () => (true)
		}
        if(this.props.isJsonString(answer)) {
            answer = JSON.parse(answer)
            if (answer !== null && answer.indexOf(opt.value) >=0) {
			    checked = () => (true)
            }
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

    getCascade (opts, lv) {
        let url = window.location.pathname.split('/')[1]
        url = this.api + 'cascade/' + url + '/' + opts.cascadeResource + '/2'
        return opts.levels.level.map((opt, i) => {
            this.limitCascade = i + 1
            return this.renderCascade(opt, i)
        })
    }

    renderCascade (opt, i) {
        let levels = "cascade_" + i
        let cascades = []
        let options = "options_" + i
        let choose_options = "cascade_" + i
        let dropdown = this.state[this.state[choose_options]]
        let cascade = (
            <>
            <div key={i}>{opt.text}</div>
            <select
                className="form-control"
                value={this.state.selected} type="select"
                name={this.props.data.id + '-' + i}
                key={this.props.data.id + '-' + i}
                onChange={this.handleChange}
            >
                {this.renderCascadeOption(dropdown)}
            </select>
            </>
        )
        cascades.push(cascade)
        if (this.limitCascade <= i) {
            this.handleChange()
        }
        return cascades.map((x, i) => x)
    }

    renderCascadeOption (data) {
        if(data) {
            return data.map((x, i) => {
                let options = (<option key={i} value={x.id} >{x.name}</option>)
                return options
            })
        }
    }

    getCascadeDropdown(lv, ix) {
        if (this.props.data.type === "cascade") {
            let url = window.location.pathname.split('/')[1]
            url = this.api + 'cascade/' + url + '/' + this.props.data.cascadeResource + '/' + lv
            let options = "options_" + lv
            let cascade = "cascade_" + ix
            axios.get(url).then((res) =>
                this.setState({
                    [options]: res.data,
                    [cascade]: [options],
                    value: res.data[0]['id']
                })
            )
        }
    }

    componentDidMount () {
        this.getCascadeDropdown(0, 0)
    }

    render() {
        if (this.props.data.localeNameFlag) {
            this.setDpStorage()
        }
        let answered = localStorage.getItem(this.props.data.id)
        return this.props.data.type === "option" ? this.getRadio(this.props.data.options) : (
            this.props.data.type === "cascade" ? this.getCascade(this.props.data, 0): (<input
                className={this.props.data.type === "photo" ? "form-control-file" : "form-control"}
                value={answered ? answered : ""}
                key={this.props.data.id}
                type={this.handler.getQuestionType(this.props.data)}
                name={this.props.data.id}
                onChange={this.handleChange} />
            )
        )
    }
}

export default QuestionType;
