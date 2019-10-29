import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import axios from 'axios';
import { isJsonString } from  '../util/QuestionHandler.js'
import { PROD_URL } from '../util/Environment'
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

const API_URL = (PROD_URL ? "https://tech-consultancy.akvotest.org/akvo-flow-web-api/" : "http://localhost:5000/")
const pathurl = (PROD_URL ? 2 : 1)

registerPlugin(FilePondPluginImagePreview);

class QuestionType extends Component {

    constructor(props) {
        super(props)
        this.instanceUrl = window.location.pathname.split('/')[pathurl]
        this.value = localStorage.getItem(this.props.data.id)
        this.state = {
            value: this.value ? this.value : '',
        }
        this.setDpStorage = this.setDpStorage.bind(this)
        this.getRadioSelected = this.getRadio.bind(this)
        this.getPhoto = this.getPhoto.bind(this)
        this.renderRadio = this.renderRadio.bind(this)
        this.getCascadeDropdown = this.getCascadeDropdown.bind(this)
        this.renderCascade = this.renderCascade.bind(this)
        this.renderCascadeOption = this.renderCascadeOption.bind(this)
        this.limitCascade = 0
        this.handleChange = this.handleChange.bind(this)
        this.handlePhoto = this.handlePhoto.bind(this)
        this.handleCascadeChange = this.handleCascadeChange.bind(this)
        this.handleGlobal = this.handleGlobal.bind(this)
    }

    handleGlobal(questionid, qval){
        if (qval === "" || qval === null){
            this.props.restoreAnswers(this.props.value.questions)
        } else {
            this.props.restoreAnswers(this.props.value.questions)
        }
        this.props.changeGroup(this.props.value.groups.active)
        this.props.checkSubmission()
    }

    handleCascadeChange(targetLevel, text, id, value) {
        let vals;
        let storage = {id:targetLevel,text:text, option:parseInt(value)}
        if (localStorage.getItem(id)) {
            let multipleValue = JSON.parse(localStorage.getItem(id))
            let current = multipleValue.filter(x => x.id < targetLevel);
            vals = JSON.stringify([...current, storage])
        } else {
            vals = JSON.stringify([storage])
        }
        if (targetLevel !== 0){
            localStorage.setItem(this.props.data.id, vals)
            this.handleGlobal(this.props.data.id, vals)
        }
        return true
    }

    handlePhoto(image) {
        let id = this.props.data.id
        localStorage.setItem(id, image)
        this.setState({value: image})
        this.handleGlobal(id, image)
    }

    handleChange(event) {
        let id = this.props.data.id
        let value = event.target.value
        if (this.props.data.type === "cascade") {
            let ddindex = event.target.selectedIndex
            let text = event.target[ddindex].text
            let targetLevel = parseInt(event.target.name.split('-')[1]) + 1
            this.handleCascadeChange(targetLevel, text, id, value)
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
                // this.props.answerReducer([{[id]:value}])
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
                    if (isJsonString(c) && isNaN(c)) {
                        let cascade = JSON.parse(c).map(x => x.text)
                        cascade.forEach(name => {
                            names.push(name)
                        });
                    } else {
                        names.push(c)
                    }
                }
                return true
            })
            let edited = names.join(" - ")
            localStorage.setItem("_dataPointName", edited)
            this.props.reduceDataPoint(localStorage.getItem('_dataPointName'))
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
        let checked = () => (localStorage.getItem(id) === opt.value)
		if (radioType === "checkbox" && this.state.value.indexOf(opt.value) >= 0) {
			checked = () => (true)
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
                value={ this.state.selected } type="select"
                name={ this.props.data.id.toString() + '-' + i}
                onChange={this.handleChange}
            >
                <option key={unique + '-cascade-options-' + 0} value="0" selected>Please Select</option>
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
                try {
                    this.setState({
                        [options]: res.data,
                        [cascade]: [options],
                        value: res.data[ix]['id']
                    })
                } catch (err) {
                    localStorage.removeItem(this.props.data.id)
                }
                return res
            }).then((res) => {
                let levels = this.props.data.levels.level.length
                if (lv < levels) {
                    if (localStorage.getItem(this.props.data.id) === null){
                        this.handleCascadeChange(ix, res.data[ix]['name'], this.props.data.id, res.data[ix]['id'])
                    }
                }
            })
        }
    }

    getInput(data, unique, validation, answered, type) {
        return (
            <input
                className={data.type === "photo" ? "form-control-file" : "form-control"}
                value={answered ? answered : ""}
                min={validation.minVal ? validation.minVal : ""}
                max={validation.maxVal ? validation.maxVal: ""}
                key={unique}
                type={type}
                name={'Q-' + data.id.toString()}
                onChange={this.handleChange}
            />
        )
    }

    getInputOther(data, unique, answered, type) {
        return (
            <input
                className={data.type === "photo" ? "form-control-file" : "form-control"}
                value={answered ? answered : ""}
                key={unique}
                type={type}
                name={'Q-' + data.id.toString()}
                onChange={this.handleChange}
            />
        )
    }

    getPhoto(data, unique, answered, type) {
        return (
            <FilePond
                key={unique}
                allowMultiple={false}
                name={'Q-' + data.id.toString()}
                data-max-file-size="500kb"
                server={API_URL + "upload-image"}
                onprocessfile={(err, file) => {
                    this.handlePhoto(file.serverId)
                }}
            />
        )
    }

    getTextArea(data, unique, answered, type) {
        return (
            <textarea
                key={unique}
                rows="3"
                className="form-control"
                value={answered ? answered : ""}
                type={type}
                onChange={this.handleChange}
                name={'Q-' + data.id.toString()}
            />
        )
    }

    componentDidMount () {
        if (this.props.data.type === "cascade"){
            localStorage.removeItem(this.props.data.id)
            this.getCascadeDropdown(0, 0)
        }
        this.props.checkSubmission()
    }

    render() {
        let data = this.props.data
        let key = 'question-form-' + data.id.toString()
        let formtype = data.type
        let answered = localStorage.getItem(data.id)
        if (data.localeNameFlag) {
            this.setDpStorage()
        }
        switch(formtype) {
            case "option":
                return this.getRadio(data, key)
            case "cascade":
                return this.getCascade(data,0, key)
            case "number":
                return this.getInput(data, key, data.validationRule, answered, formtype)
            case "photo":
                return this.getPhoto(data, key, answered, "file")
            case "date":
                return this.getInputOther(data, key, answered, formtype)
            default:
                return this.getTextArea(data, key, answered, formtype)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionType);
