import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import axios from 'axios';
import QuestionHandler from '../util/QuestionHandler'
import { PROD_URL } from '../util/Environment'

const API_URL = (PROD_URL ? "https://tech-consultancy.akvotest.org/akvo-flow-web-api/" : "http://localhost:5000/")
const pathurl = (PROD_URL ? 2 : 1)

class QuestionType extends Component {

    constructor(props) {
        super(props)
        this.instanceUrl = window.location.pathname.split('/')[pathurl]
        this.handler = new QuestionHandler()
        this.value = localStorage.getItem(this.props.data.id)
        this.state = { value: this.value ? this.value : '' }
        this.setDpStorage = this.setDpStorage.bind(this)
        this.getRadioSelected = this.getRadio.bind(this)
        this.renderRadio = this.renderRadio.bind(this)
        this.getCascadeDropdown = this.getCascadeDropdown.bind(this)
        this.renderCascade = this.renderCascade.bind(this)
        this.renderCascadeOption = this.renderCascadeOption.bind(this)
        this.limitCascade = 0
        this.handleChange = this.handleChange.bind(this)
        this.handleCascadeChange = this.handleCascadeChange.bind(this)
        this.handleGlobal = this.handleGlobal.bind(this)
    }

    handleGlobal(questionid, qval){
        if (qval === "" || qval === null){
            this.props.answerReducer([{id:questionid,answer:null}])
        } else {
            this.props.answerReducer([{id:questionid,answer:qval}])
        }
        this.props.checkSubmission()
    }

    handleCascadeChange(targetLevel, text, id) {
        let vals;
        let storage = {id:targetLevel,text:text}
        if (localStorage.getItem(id)) {
            let multipleValue = JSON.parse(localStorage.getItem(id))
            vals = JSON.stringify(multipleValue)
        } else {
            vals = JSON.stringify([storage])
        }
        localStorage.setItem(this.props.data.id, vals)
        this.handleGlobal(id, vals)
        return true
    }

    handleChange(event) {
        let id = this.props.data.id
        let value = event.target.value
        this.props.checkDependency(id, value)
        if (this.props.data.type === "cascade") {
            let ddindex = event.target.selectedIndex
            let text = event.target[ddindex].text
            let targetLevel = parseInt(event.target.name.split('-')[1]) + 1
            this.handleCascadeChange(targetLevel, text, id)
            if (this.limitCascade > targetLevel) {
                this.getCascadeDropdown(value, targetLevel)
            }
        }
        else if (this.props.data.options && this.props.data.options.allowMultiple)  {
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
                this.props.answerReducer([{[id]:value}])
            	this.setState({value: multipleValue})
                this.handleGlobal(id, value)
			} else {
				localStorage.removeItem(id)
            	this.setState({value: ""})
			}
        } else {
            localStorage.setItem(id, value)
            this.setState({value: value})
            this.handleGlobal(id, value)
        }
        if(value === "") {
            this.setState({value: value})
            localStorage.removeItem(id)
            this.handleGlobal(id, value)
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

    getRadio (data, unique) {
        let opts = data.options
        let radioType = (opts.allowMultiple ? "checkbox" : "radio")
        return (
            opts.option.length > 1 ? (opts.option.map((opt, i) => this.renderRadio(
                opt, i, data.id, radioType, unique)
            )) : (this.renderRadio(opts.option, 0, data.id, radioType, unique))
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

    renderRadio (opt, i, id, radioType, unique) {
        let answer = localStorage.getItem(id)
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
                 key={unique + '-div-radio-' + i.toString()}
            >
                <input
                    key={unique + '-radio-' + i.toString()}
                    className="form-check-input"
                    type={radioType}
                    name={id}
                    value={opt.value}
                    onChange={this.handleChange}
                    checked={checked()}
            />
                <label
                    className="form-check-label"
                    htmlFor={"input-" + (id+i).toString()}>
                    {opt.text}
                </label>
            </div>
        )
    }

    getCascade (opts, lv, unique) {
        let l = opts.levels.level.length - 1
        return opts.levels.level.map((opt, i) => {
            this.limitCascade = i + 1
            return this.renderCascade(opt, i, l, unique)
        })
    }

    renderCascade (opt, i, l, unique) {
        let cascades = []
        let choose_options = "cascade_" + i
        let dropdown = this.state[this.state[choose_options]]
        let cascade = (
            <>
            <div>{opt.text}</div>
            <select
                className="form-control"
                value={this.state.selected} type="select"
                name={this.props.data.id.toString() + '-' + i}
                onChange={this.handleChange}
            >
                <option key={unique + '-cascade-options-' + 0} value="">Please Select</option>
                {this.renderCascadeOption(dropdown,(i+1),opt.text, unique)}
            </select>
            </>
        )
        cascades.push(cascade)
        if (this.limitCascade <= i) {
            this.handleChange()
        }
        return cascades.map((x, i) => x)
    }

    renderCascadeOption (data,targetLevel, unique) {
        if(data) {
            return data.map((x, i) => {
                let options = (
                    <option
                        key={unique + '-cascade-options-' + i}
                        value={x.id}
                    >
                        {x.name}
                    </option>
                )
                return options
            })
        }
    }

    getCascadeDropdown(lv, ix) {
        if (this.props.data.type === "cascade") {
            let url = this.instanceUrl
            url = API_URL + 'cascade/' + url + '/' + this.props.data.cascadeResource + '/' + lv
            let options = "options_" + lv
            let cascade = "cascade_" + ix
            axios.get(url).then((res) =>{
                this.setState({
                    [options]: res.data,
                    [cascade]: [options],
                    value: res.data[ix]['id']
                })
                return res
            }).then((res) => {
                let levels = this.props.data.levels.level.length
                if (lv < levels) {
                    this.getCascadeDropdown(this.state.value, ix + 1)
                    if (localStorage.getItem(this.props.data.id)){
                        let selected = JSON.parse(localStorage.getItem(this.props.data.id));
                        this.handleCascadeChange(ix, selected[ix]['name'], selected[ix]['id'])
                    } else {
                        this.handleCascadeChange(ix, res.data[ix]['name'], res.data[ix]['id'])
                    }
                }
                //this.getCascadeDropdown(value, targetLevel)
            })
        }
    }

    getInput(data, unique, validation, answered) {
        return (
            <input
                className={data.type === "photo" ? "form-control-file" : "form-control"}
                value={answered ? answered : ""}
                min={validation.minVal ? validation.minVal : ""}
                max={validation.maxVal ? validation.maxVal: ""}
                key={unique}
                type={this.handler.getQuestionType(data)}
                name={'Q-' + data.id.toString()}
                onChange={this.handleChange}
            />
        )
    }

    getInputOther(data, unique, answered) {
        return (
            <input
                className={data.type === "photo" ? "form-control-file" : "form-control"}
                value={answered ? answered : ""}
                key={unique}
                type={this.handler.getQuestionType(data)}
                name={'Q-' + data.id.toString()}
                onChange={this.handleChange}
            />
        )
    }

    getTextArea(data, unique, answered) {
        return (
            <textarea
                key={unique}
                rows="3"
                className="form-control"
                value={answered ? answered : ""}
                type={this.handler.getQuestionType(data)}
                onChange={this.handleChange}
                name={'Q-' + data.id.toString()}
            />
        )
    }

    componentDidMount () {
        if (this.props.data.type === "cascade"){
            this.getCascadeDropdown(0, 0)
        }
        let current = localStorage.getItem(this.props.data.id)
        let identifier = this.props.data.id
        this.props.answerReducer([{id: identifier, answer:current}])
        this.props.checkSubmission()
    }

    render() {
        let data = this.props.data
        let key = 'question-form-' + data.id.toString()
        let formtype = data.type
        let answered = localStorage.getItem(data.id)
        if (data.validationRule && data.validationRule.validationType === "numeric") {
            formtype = "number"
        }
        if (data.localeNameFlag) {
            this.setDpStorage()
        }
        switch(formtype) {
            case "option":
                return this.getRadio(data, key)
            case "cascade":
                return this.getCascade(data,0, key)
            case "number":
                return this.getInput(data, key, data.validationRule, answered)
            case "photo":
                return this.getInputOther(data, key, answered)
            case "date":
                return this.getInputOther(data, key, answered)
            default:
                return this.getTextArea(data, key, answered)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionType);
